import { useMemo } from "react";

import { loopValue, narrate } from "../../engine/trace/narrate.ts";
import type { TracePlayer } from "../../engine/trace/player.ts";
import type { ProgramState, TraceEvent } from "../../engine/trace/types.ts";

/**
 * §3.9 특수 시각화 플러그인 중 "반복문: 반복 트랙, 현재 회차" 와
 * §16의 Grid view.
 *
 * 격자는 이 데모 전용 파생이다. 공통 엔진이 아니라 레슨 플러그인 자리에
 * 들어갈 코드이므로 트레이스를 직접 훑어 (i, k) → result를 만든다.
 */
function useGrid(player: TracePlayer, cursor: number) {
  return useMemo(() => {
    const cells = new Map<string, string>();
    let i = -1;
    let k = -1;
    let current: { i: number; k: number } | null = null;

    for (let n = 0; n < cursor; n += 1) {
      const event = player.events[n]!;
      if (event.type !== "VARIABLE_CREATE" && event.type !== "VARIABLE_UPDATE") continue;
      const value = event.type === "VARIABLE_CREATE" ? event.value : event.after;
      if (value.kind !== "primitive") continue;

      if (event.name === "i") i = Number(value.repr);
      else if (event.name === "k") k = Number(value.repr);
      else if (event.name === "result" && i >= 0 && k >= 0) cells.set(`${i},${k}`, value.repr);
      if (i >= 0 && k >= 0) current = { i, k };
    }
    return { cells, current };
  }, [player, cursor]);
}

interface Props {
  player: TracePlayer;
  cursor: number;
  state: ProgramState;
  event: TraceEvent | null;
  /** §3.9 레슨 플러그인. 없으면 격자를 그리지 않는다. */
  gridSize?: number;
  /** 탭바가 aria-controls로 가리키는 id */
  panelId?: string;
}

export function ExecutionPanel({ player, cursor, state, event, gridSize, panelId }: Props) {
  const grid = useGrid(player, cursor);
  const message = event ? narrate(event, state) : "`Step`을 눌러 첫 줄부터 실행해 보세요.";
  const activeFrame = state.frames[state.frames.length - 1];
  const callNote = state.evaluating.find((n) => n.substituted?.includes("("));

  return (
    <section className="panel panel-exec" id={panelId} aria-label="실행 흐름">
      <header className="panel-head">
        <h2>EXECUTION</h2>
        <span className="panel-sub">{event ? event.type : "실행 전"}</span>
      </header>

      {/* §9.2-4 실행 해설: 현재 단계의 의미를 1~2문장으로 */}
      <p className="narration">{message}</p>

      {/* §3.6 반복 트랙 */}
      <div className="block">
        <h3>반복 트랙</h3>
        {state.loops.length === 0 ? (
          <p className="empty">아직 시작된 반복이 없습니다.</p>
        ) : (
          <ul className="loop-list">
            {state.loops.map((loop) => (
              <li key={loop.id} className={`loop ${loop.status === "done" ? "is-done" : ""}`}>
                <span className="loop-var">{loop.varNames.join(", ")}</span>
                {loop.track.length === 0 ? (
                  // 카운터 for와 while은 다음 값이 조건 검사로 정해진다. 미리
                  // 그릴 트랙이 없으므로 지금 값 한 칸과 열린 끝만 보여 준다.
                  <span className="track" title="반복할 값이 정해져 있지 않아 회차마다 조건을 검사합니다">
                    {loopValue(state, loop) !== null && (
                      <span className={`cell ${loop.status === "running" ? "is-current" : ""}`}>
                        {loopValue(state, loop)}
                      </span>
                    )}
                    <span className="cell is-open">{loop.status === "done" ? "끝" : "…"}</span>
                  </span>
                ) : (
                  <span className="track">
                    {loop.track.map((value, index) => (
                      <span
                        key={index}
                        className={`cell ${
                          index === loop.index && loop.status === "running" ? "is-current" : ""
                        } ${index < loop.index ? "is-past" : ""}`}
                      >
                        {value}
                      </span>
                    ))}
                  </span>
                )}
                <span className="loop-meta">
                  {loop.status === "done"
                    ? "종료"
                    : loop.index >= 0
                      ? `${loop.index + 1}회차`
                      : "시작 전"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* §16 Grid view: (i, k) 방문 순서와 결과. 이 플러그인을 선언한 레슨에서만. */}
      {gridSize !== undefined && (
      <div className="block">
        <h3>
          방문 격자 <span className="hint">가로 k · 세로 i</span>
        </h3>
        <table className="grid">
          <thead>
            <tr>
              <th scope="col" className="corner">
                i\k
              </th>
              {Array.from({ length: gridSize }, (_, k) => (
                <th key={k} scope="col">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: gridSize }, (_, i) => (
              <tr key={i}>
                <th scope="row">{i}</th>
                {Array.from({ length: gridSize }, (_, k) => {
                  const value = grid.cells.get(`${i},${k}`);
                  const isCurrent = grid.current?.i === i && grid.current?.k === k;
                  return (
                    <td
                      key={k}
                      className={`${value !== undefined ? "is-filled" : ""} ${
                        isCurrent ? "is-current" : ""
                      }`}
                    >
                      {value ?? ""}
                      {isCurrent && <span className="sr-only">현재 위치</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* §3.5 호출 흐름: 인수 치환과 활성 프레임 */}
      <div className="block">
        <h3>호출 흐름</h3>
        {callNote ? (
          <div className="call-flow">
            <code className="call-src">result = mul(i, k)</code>
            <span className="arrow" aria-hidden="true">
              ↓ 현재 값으로 치환
            </span>
            <code className="call-sub">{callNote.substituted}</code>
            {activeFrame && activeFrame.id !== "global" && (
              <>
                <span className="arrow" aria-hidden="true">
                  ↓ 프레임 진입
                </span>
                <code className="call-frame">
                  {activeFrame.id}
                  {activeFrame.bindings.length > 0 &&
                    ` (${activeFrame.bindings
                      .map((b) => `${b.name}=${b.value.kind === "primitive" ? b.value.repr : "…"}`)
                      .join(", ")})`}
                </code>
              </>
            )}
          </div>
        ) : (
          <p className="empty">호출을 실행하면 인수 전달 경로가 여기에 표시됩니다.</p>
        )}
      </div>
    </section>
  );
}
