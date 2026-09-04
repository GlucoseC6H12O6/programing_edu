import { useState } from "react";

import { diffEvents } from "../../engine/trace/compare.ts";
import type { TraceDocument } from "../../engine/trace/types.ts";

type Status =
  | { kind: "idle" }
  | { kind: "running"; note: string }
  | { kind: "match"; events: number }
  | { kind: "mismatch"; step: number; left: string; right: string }
  | { kind: "failed"; message: string };

interface Props {
  golden: TraceDocument;
  onTrace?: (doc: TraceDocument) => void;
}

/**
 * 이 페이지의 코드를 브라우저에서 **직접** 실행해 커밋된 트레이스와 비교한다.
 *
 * 굳이 화면에 노출하는 이유: "미리 만들어 둔 설명"과 "실제 실행"이 같다는 것을
 * 학습자와 제작자 모두가 눈으로 확인할 수 있어야 한다.
 *
 * 두 언어가 같은 구조로 성립한다.
 *   Python     빌드 CPython ↔ 브라우저 Pyodide   (같은 tracer.py)
 *   JavaScript 빌드 Node    ↔ 브라우저 Web Worker (같은 tracer.ts)
 * 비교하는 함수도 하나다. diffEvents가 두 언어를 그대로 대조한다.
 */
export function RunHere({ golden, onTrace }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const busy = status.kind === "running";
  const isJavaScript = golden.source.language === "javascript";

  async function run() {
    setStatus({ kind: "running", note: "준비 중…" });
    try {
      // 실행기는 누를 때만 불러온다. 레슨을 여는 것만으로는 아무것도 받지 않는다.
      const { traceInBrowser } = isJavaScript
        ? await import("../../engine/javascript/runInBrowser.ts")
        : await import("../../engine/python/runInBrowser.ts");
      // 같이 도는 파일과 실행 전 디스크 내용도 넘긴다. 이것이 빠지면 P20·J19는
      // import할 것이 없어 브라우저 쪽만 오류로 끝난다 — 두 경로가 갈라진 것이
      // 아니라 한쪽에 입력을 덜 준 것이다.
      const doc = await traceInBrowser(golden.source.lines.join("\n"), {
        lessonId: golden.lessonId,
        path: golden.source.path,
        modules: Object.fromEntries(
          (golden.sources ?? []).map((file) => [
            file.path.replace(/\.(py|js)$/, ""),
            file.lines.join("\n"),
          ]),
        ),
        files: golden.initialFiles,
        onProgress: (note) => setStatus({ kind: "running", note }),
      });
      const diff = diffEvents(doc, golden);
      onTrace?.(doc);
      setStatus(
        diff
          ? { kind: "mismatch", step: diff.step, left: diff.left, right: diff.right }
          : { kind: "match", events: doc.events.length },
      );
    } catch (error) {
      setStatus({ kind: "failed", message: (error as Error).message });
    }
  }

  return (
    <div className="run-here">
      <button type="button" onClick={run} disabled={busy}>
        {busy ? "실행 중…" : "브라우저에서 직접 실행"}
      </button>

      <p className="run-here-note" role="status" aria-live="polite">
        {status.kind === "idle" &&
          (isJavaScript
            ? "같은 tracer.ts를 브라우저 워커에서 돌려 위 트레이스와 일치하는지 확인합니다. 내려받을 런타임은 없습니다."
            : "같은 tracer.py를 브라우저에서 돌려 위 트레이스와 일치하는지 확인합니다. 누를 때만 Python 런타임을 내려받습니다.")}
        {status.kind === "running" && status.note}
        {status.kind === "match" && (
          <span className="is-ok">
            ✓ 브라우저 실행 결과가 커밋된 트레이스와 완전히 같습니다 ({status.events}개 이벤트).
          </span>
        )}
        {status.kind === "mismatch" && (
          <span className="is-bad">✗ {status.step}단계부터 다릅니다. 골든 트레이스를 다시 만들어야 합니다.</span>
        )}
        {status.kind === "failed" && <span className="is-bad">실행 실패: {status.message}</span>}
      </p>

      {status.kind === "mismatch" && (
        <pre className="run-here-diff">
          브라우저: {status.left}
          {"\n"}골든    : {status.right}
        </pre>
      )}
    </div>
  );
}
