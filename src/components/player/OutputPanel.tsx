import type { ProgramState, TraceDocument } from "../../engine/trace/types.ts";

interface Props {
  state: ProgramState;
  doc: TraceDocument;
  /** 탭바가 aria-controls로 가리키는 id */
  panelId?: string;
}

export function OutputPanel({ state, doc, panelId }: Props) {
  // 출력이 비어 있는 이유는 두 가지다. 출력을 아예 안 쓰는 예제인지,
  // 아직 출력할 줄에 도달하지 않은 것인지 구분해서 알려 준다.
  const willPrint = doc.events.some((event) => event.type === "OUTPUT_APPEND");
  // 출력 함수의 이름은 언어마다 다르다. 화면이 코드에 없는 이름을 말하면
  // 학습자는 그 이름을 찾으러 코드를 다시 읽는다.
  const call = doc.source.language === "javascript" ? "console.log()" : "print()";

  return (
    <section className="panel panel-output" id={panelId} aria-label="출력">
      <header className="panel-head">
        <h2>OUTPUT</h2>
        <span className="panel-sub">{state.output.length}건</span>
      </header>
      {state.output.length === 0 ? (
        <p className="empty">
          {willPrint ? (
            <>
              아직 <code>{call}</code>가 실행된 줄에 도달하지 않았습니다.
            </>
          ) : (
            <>
              이 예제는 <code>{call}</code>를 쓰지 않습니다. 값의 변화는 STATE 패널에서 확인하세요.
            </>
          )}
        </p>
      ) : (
        <ol className="output-list">
          {state.output.map((entry, index) => (
            <li key={index} className={`out out-${entry.stream}`}>
              <span className="out-line">{entry.line}</span>
              <code>{entry.text}</code>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
