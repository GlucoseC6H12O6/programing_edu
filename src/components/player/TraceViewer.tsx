import { useEffect, useId, useRef, useState } from "react";

import { narrateForScreenReader } from "../../engine/trace/narrate.ts";
import type { TraceDocument, TraceEvent } from "../../engine/trace/types.ts";
import { CodePanel } from "./CodePanel.tsx";
import { Controls } from "./Controls.tsx";
import { ExecutionPanel } from "./ExecutionPanel.tsx";
import { FilePanel } from "./FilePanel.tsx";
import { OutputPanel } from "./OutputPanel.tsx";
import { StatePanel } from "./StatePanel.tsx";
import type { EditApi } from "./useEditableCode.ts";
import { usePlayer, useReducedMotion } from "./usePlayer.ts";

type Tab = "code" | "exec" | "state" | "output";

const TABS: { id: Tab; label: string }[] = [
  { id: "code", label: "Code" },
  { id: "exec", label: "Flow" },
  { id: "state", label: "State" },
  { id: "output", label: "Output" },
];

/** §3.11 작은 화면에서 자동 전환할 탭을 이벤트에서 고른다. */
function tabFor(event: TraceEvent | null): Tab | null {
  if (!event) return null;
  switch (event.type) {
    case "OUTPUT_APPEND":
      return "output";
    // 파일 사건은 출력 칸에 함께 있다. 디스크가 바뀌는 순간을 놓치면
    // P18에서 볼 것이 아무것도 남지 않는다.
    case "FILE_OPEN":
    case "FILE_WRITE":
    case "FILE_READ":
    case "FILE_CLOSE":
      return "output";
    case "VARIABLE_CREATE":
    case "VARIABLE_UPDATE":
    case "VARIABLE_DELETE":
    case "PARAMETER_BIND":
    case "FUNCTION_ENTER":
    case "FRAME_POP":
      return "state";
    case "LOOP_START":
    case "LOOP_ITERATION":
    case "LOOP_END":
    case "FUNCTION_CALL":
    case "BRANCH_TEST":
    case "BRANCH_TAKEN":
      return "exec";
    case "LINE_ENTER":
      return "code";
    default:
      return null;
  }
}

interface Props {
  doc: TraceDocument;
  gridSize?: number;
  /** 없으면 코드 패널은 읽기 전용이다 */
  edit?: EditApi;
}

export function TraceViewer({ doc, gridSize, edit }: Props) {
  const api = usePlayer(doc);
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const [tab, setTab] = useState<Tab>("code");
  const [pinned, setPinned] = useState(false);

  // 탭과 패널을 aria-controls로 잇는다. 한 페이지에 뷰어가 둘일 수 있으므로
  // (변형 전환은 하나씩 그리지만 id가 겹칠 이유를 남겨 두지 않는다) useId로 짓는다.
  const uid = useId();
  const panelId = (t: Tab) => `${uid}-${t}`;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /**
   * 탭바 안에서의 좌우 이동. WAI-ARIA tabs 패턴대로 방향키가 탭을 옮기고
   * Home/End가 양 끝으로 간다. 뷰어 전체의 →/←는 Step/Prev라서, 탭에 초점이
   * 있을 때만 이쪽이 가져간다(아래 window 리스너도 role="tab"을 건너뛴다).
   */
  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = TABS.length - 1;
    const to =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    e.stopPropagation();
    setTab(TABS[to]!.id);
    tabRefs.current[to]?.focus();
  };

  const { event, state, step, prev, reset, playing, setPlaying } = api;

  // 자동 탭 전환. 사용자가 고정하면 멈춘다.
  useEffect(() => {
    if (pinned) return;
    const next = tabFor(event);
    if (next) setTab(next);
  }, [event, pinned]);

  // §3.11 모든 실행 제어를 키보드로. 입력 요소 위에서는 가로채지 않는다.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      // 탭 위에서의 →/←는 탭 이동이다(onTabKey).
      if (target?.getAttribute("role") === "tab") return;
      if (!rootRef.current?.contains(document.activeElement) && document.activeElement !== document.body)
        return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          step();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prev();
          break;
        case "r":
        case "R":
          reset();
          break;
        case "p":
        case "P":
          setPlaying(!playing);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, prev, reset, playing, setPlaying]);

  return (
    <div
      className="viewer"
      ref={rootRef}
      data-tab={tab}
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <div className="tabbar" role="tablist" aria-label="패널 선택">
        {TABS.map((t, index) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`${uid}-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={panelId(t.id)}
            // 탭 무리는 Tab 키 한 번에 들어오고 나간다. 안에서는 방향키로 옮긴다.
            tabIndex={tab === t.id ? 0 : -1}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className={tab === t.id ? "is-on" : ""}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => onTabKey(e, index)}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          className={`pin ${pinned ? "is-on" : ""}`}
          onClick={() => setPinned(!pinned)}
          aria-pressed={pinned}
          title="현재 탭 고정 (자동 전환 끄기)"
        >
          고정
        </button>
      </div>

      {/*
        2x2다. DOM 순서가 보이는 순서와 같아야 키보드와 스크린 리더가 화면과
        어긋나지 않으므로, 감싸는 열 없이 네 패널을 그대로 늘어놓는다.

          CODE      STATE
          EXECUTION OUTPUT

        3열이던 동안 가운데 열이 EXECUTION 위에 OUTPUT을 쌓고 있었다. 즉 행은
        이미 둘이었고, 2x2는 없던 행을 만드는 것이 아니라 그 스택을 옮긴 것이다.
        그래서 폭이 1452px에서 1000px로 줄어도 코드 한 줄에 들어가는 글자 수는
        46자에서 53자로 오히려 늘었다.
      */}
      <div className="panel-grid">
        <CodePanel
          panelId={panelId("code")}
          edit={edit}
          source={doc.source}
          sources={doc.sources}
          state={state}
          breakpoints={api.breakpoints}
          onToggleBreakpoint={api.toggleBreakpoint}
        />
        <StatePanel panelId={panelId("state")} state={state} />
        <ExecutionPanel
          panelId={panelId("exec")}
          player={api.player}
          cursor={api.cursor}
          state={state}
          event={event}
          gridSize={gridSize}
        />
        <OutputPanel panelId={panelId("output")} state={state} doc={doc} />
        {/* 파일을 다루지 않는 레슨에는 이 패널이 없다. 다섯 번째라 짝이 없어
            아래 행을 통째로 쓴다. */}
        {state.files.length > 0 && <FilePanel state={state} />}
      </div>

      <Controls {...api} />

      {/* §3.11 스크린 리더용 매 단계 요약 */}
      <p className="sr-only" role="status" aria-live="polite">
        {event ? narrateForScreenReader(event, state) : "실행 전"}
      </p>
    </div>
  );
}
