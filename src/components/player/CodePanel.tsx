import { useState } from "react";

import { highlight } from "../../engine/highlight.ts";
import type { ProgramState, TraceSource } from "../../engine/trace/types.ts";
import type { EditApi } from "./useEditableCode.ts";

interface Props {
  source: TraceSource;
  /** main 외의 파일들. §P20처럼 import한 module이 함께 도는 레슨에서만 찬다. */
  sources?: TraceSource[];
  state: ProgramState;
  breakpoints: ReadonlySet<number>;
  onToggleBreakpoint: (line: number) => void;
  /** 탭바가 aria-controls로 가리키는 id */
  panelId?: string;
  /** 없으면 읽기 전용. 있으면 이 패널에서 고쳐 다시 실행할 수 있다. */
  edit?: EditApi;
}

export function CodePanel({
  source,
  sources,
  state,
  breakpoints,
  onToggleBreakpoint,
  panelId,
  edit,
}: Props) {
  const errorLine = state.error && !state.error.caught ? state.error.line : null;

  /** 편집 중인 글. null이면 편집 중이 아니다. */
  const [draft, setDraft] = useState<string | null>(null);
  const editing = draft !== null;
  const busy = edit?.status === "running";

  const onDraftKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    // Python은 들여쓰기가 문법이다. Tab이 초점을 옮겨 버리면 고칠 수가 없다.
    // 대신 Esc로 편집을 빠져나갈 수 있게 해 초점이 갇히지 않는다.
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart: from, selectionEnd: to } = el;
      setDraft(`${el.value.slice(0, from)}    ${el.value.slice(to)}`);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = from + 4;
      });
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setDraft(null);
      return;
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      edit?.run(el.value);
    }
  };

  // §P20 §10-2: 실행이 imported module로 들어가면 그 파일을 보여 준다.
  // 사용자가 고를 것이 아니라 실행이 정하는 것이라 탭이 아니라 표시만 바꾼다.
  const all = [source, ...(sources ?? [])];
  const shown = all.find((file) => file.path === state.sourcePath) ?? source;

  return (
    <section className="panel panel-code" id={panelId} aria-label="코드">
      <header className="panel-head">
        <h2>CODE</h2>
        {all.length > 1 ? (
          <span className="code-files">
            {all.map((file) => (
              <span key={file.path} className={file.path === shown.path ? "is-on" : ""}>
                {file.path}
              </span>
            ))}
          </span>
        ) : (
          <span className="panel-sub">{source.path}</span>
        )}
      </header>

      {edit && (
        <div className="code-edit-bar">
          {editing ? (
            <>
              <button
                type="button"
                className="is-primary"
                onClick={() => edit.run(draft)}
                disabled={busy}
              >
                {busy ? "실행 중…" : "고친 코드로 실행"}
              </button>
              <button type="button" onClick={() => setDraft(null)} disabled={busy}>
                취소
              </button>
              <span className="code-edit-hint">Tab 공백 4칸 · ⌘/Ctrl+Enter 실행 · Esc 취소</span>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setDraft(source.lines.join("\n"))} disabled={busy}>
                코드 고치기
              </button>
              {edit.isEdited && (
                <>
                  <span className="code-edit-badge">편집본</span>
                  <button type="button" onClick={edit.restore}>
                    원본으로
                  </button>
                </>
              )}
            </>
          )}
          {edit.note && (
            <span className={`code-edit-note ${edit.status === "failed" ? "is-bad" : ""}`}>
              {edit.note}
            </span>
          )}
        </div>
      )}

      {/* 해설은 원본 코드를 설명한다. 편집본이 도는 동안에는 그렇다고 말해 둔다. */}
      {edit?.isEdited && !editing && (
        <p className="code-edit-warn">
          고친 코드를 실행한 결과입니다. §9 Walkthrough와 §16 정답은 원본 기준입니다.
        </p>
      )}

      {editing ? (
        <textarea
          className="code-edit-area"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onDraftKey}
          spellCheck={false}
          autoComplete="off"
          rows={Math.max(source.lines.length + 1, 8)}
          aria-label={`${source.path} 코드 편집`}
        />
      ) : (
        <ol className="code-lines">
          {shown.lines.map((text, index) => {
            const line = index + 1;
            const isCurrent = state.line === line;
            const isPrev = state.prevLine === line && !isCurrent;
            const isDone = state.completedLines.includes(line) && !isCurrent;
            const isError = errorLine === line;
            const hasBreakpoint = breakpoints.has(line);

            // §3.11 색만으로 상태를 구분하지 않는다. 아이콘 + 테두리 + 라벨을 함께 쓴다.
            const status = isError
              ? { cls: "is-error", icon: "!", label: "오류 발생 줄" }
              : isCurrent
                ? { cls: "is-current", icon: "▶", label: "지금 실행할 줄" }
                : isDone
                  ? { cls: "is-done", icon: "✓", label: "실행 완료" }
                  : isPrev
                    ? { cls: "is-prev", icon: "·", label: "직전 실행 줄" }
                    : { cls: "", icon: "", label: "" };

            return (
              <li key={line} className={`code-line ${status.cls}`}>
                <button
                  type="button"
                  className={`bp ${hasBreakpoint ? "bp-on" : ""}`}
                  onClick={() => onToggleBreakpoint(line)}
                  aria-pressed={hasBreakpoint}
                  aria-label={`${line}번 줄 중단점 ${hasBreakpoint ? "해제" : "설정"}`}
                />
                <span className="ln" aria-hidden="true">
                  {line}
                </span>
                <span className="marker" aria-hidden="true">
                  {status.icon}
                </span>
                <code>
                  {text === "" ? (
                    " "
                  ) : (
                    highlight(text, shown.language).map((token, i) => (
                      <span key={i} className={token.cls}>
                        {token.text}
                      </span>
                    ))
                  )}
                </code>
                {status.label && <span className="sr-only">{status.label}</span>}
              </li>
            );
          })}
        </ol>
      )}

      <footer className="legend">
        <span className="legend-item is-current">
          <span aria-hidden="true">▶</span> 실행 전
        </span>
        <span className="legend-item is-done">
          <span aria-hidden="true">✓</span> 실행 완료
        </span>
        <span className="legend-item is-error">
          <span aria-hidden="true">!</span> 오류
        </span>
      </footer>
    </section>
  );
}
