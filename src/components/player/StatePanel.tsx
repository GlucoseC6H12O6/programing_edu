import { heapLabel } from "../../engine/trace/reducer.ts";
import type {
  Binding,
  Frame,
  HeapObject,
  ProgramState,
  TaskState,
  Value,
} from "../../engine/trace/types.ts";

function valueText(value: Value): string {
  return value.kind === "primitive" ? value.repr : `→ ${value.id}`;
}

function typeText(value: Value): string {
  return value.kind === "primitive" ? value.type : "ref";
}

function BindingRow({ binding, step }: { binding: Binding; step: number }) {
  const justChanged = binding.updatedAtStep === step;
  const changed = binding.previous !== undefined;

  return (
    <li
      className={`binding ${justChanged ? "is-hot" : ""} ${binding.retired ? "is-retired" : ""}`}
    >
      <span className="b-name">{binding.name}</span>
      <span className="b-type">{typeText(binding.value)}</span>
      <span className="b-value">
        {/* §1.2-4 변경 전후 비교 */}
        {changed && justChanged && (
          <>
            <span className="b-prev">{valueText(binding.previous!)}</span>
            <span className="b-arrow" aria-hidden="true">
              →
            </span>
          </>
        )}
        <span className="b-current">{valueText(binding.value)}</span>
      </span>
      {/* §1.2-3 값의 출처 표시 */}
      {binding.origin?.from && <span className="b-origin">← {binding.origin.from}</span>}
      {binding.retired && <span className="b-note">스코프 종료로 제거됨</span>}
    </li>
  );
}

function FrameCard({ frame, step }: { frame: Frame; step: number }) {
  // module 프레임에는 회차가 없다. `config#1`이라고 쓰면 함수 호출처럼 읽힌다.
  const title =
    frame.callNumber && frame.kind !== "module" ? `${frame.name}#${frame.callNumber}` : frame.name;
  return (
    <li className={`frame is-${frame.phase}`}>
      <header>
        <span className="f-name">{title}</span>
        {frame.kind === "module" && (
          <span className="f-kind" title="import한 module의 최상위 코드가 도는 프레임입니다">
            module
          </span>
        )}
        <span
          className="f-phase"
          title={
            frame.phase === "paused"
              ? "yield 또는 await에서 멈췄습니다. 지역 변수는 그대로 남아 있습니다"
              : undefined
          }
        >
          {frame.phase === "active"
            ? "활성"
            : frame.phase === "waiting"
              ? "대기"
              : frame.phase === "returning"
                ? "반환 중"
                : frame.phase === "paused"
                  ? "멈춤"
                  : "제거됨"}
        </span>
      </header>
      {frame.bindings.length === 0 ? (
        <p className="empty">변수 없음</p>
      ) : (
        <ul className="bindings">
          {frame.bindings.map((b) => (
            <BindingRow key={b.name} binding={b} step={step} />
          ))}
        </ul>
      )}
      {frame.returnLine !== null && (
        <p className="f-return">다음 복귀 위치: {frame.returnLine}번 줄</p>
      )}
    </li>
  );
}

/**
 * §3.4 "인덱스가 표시된 셀로 원소를 보여준다".
 *
 * 이름표만으로는 P06·P07을 가르칠 수 없다. List는 인덱스가 붙은 칸으로,
 * Dictionary는 키가 값을 여는 칸으로 그려야 레슨이 성립한다.
 */
function HeapContents({ object }: { object: HeapObject }) {
  if (object.kind === "sequence")
    return (
      <ol className="h-cells" start={0}>
        {object.items.map((item, index) => (
          <li key={index} className="h-cell">
            <span className="h-key">{index}</span>
            <span className="h-val">{valueText(item)}</span>
          </li>
        ))}
      </ol>
    );

  if (object.kind === "mapping")
    return (
      <ul className="h-cells">
        {object.entries.map((entry) => (
          <li key={entry.key} className="h-cell">
            {/* attribute는 점으로 닿는 이름이다. dict의 키와 같은 모양으로
                그리면 `obj["x"]`로도 닿을 것처럼 보인다. */}
            <span className="h-key">
              {object.label === "instance" ? `.${entry.key}` : entry.key}
            </span>
            <span className="h-val">{valueText(entry.value)}</span>
          </li>
        ))}
      </ul>
    );

  // §P21 §10-1의 Class Card. 초기화 규칙과 공유 method가 설계도 쪽에 있다는
  // 사실 자체가 이 레슨이 가르치는 것이다.
  if (object.kind === "class")
    return (
      <>
        {object.initRule && object.initRule.length > 0 && (
          <p className="h-rule">
            <span className="h-rule-label">초기 상태 규칙</span>
            {object.initRule.map((name) => `.${name}`).join(", ")}
          </p>
        )}
        <ul className="h-cells">
          {object.attributes.map((entry) => (
            <li key={entry.key} className="h-cell">
              <span className="h-key">.{entry.key}</span>
              <span className="h-val">{valueText(entry.value)}</span>
            </li>
          ))}
          {object.methods.map((m) => (
            <li key={m.name} className="h-cell is-method">
              <span className="h-val">
                {m.name}({m.params.join(", ")})
              </span>
            </li>
          ))}
        </ul>
      </>
    );

  if (object.kind === "set")
    return (
      // 순서가 없는 값이므로 번호를 붙이지 않는다. 붙이면 없는 규칙을 가르치게 된다.
      <ul className="h-cells">
        {object.items.map((item, index) => (
          <li key={index} className="h-cell is-unkeyed">
            <span className="h-val">{valueText(item)}</span>
          </li>
        ))}
      </ul>
    );

  return null;
}

/**
 * §J21 §10의 작업 카드.
 *
 * 비동기의 어려움은 "지금 아무 프레임도 돌지 않는데 프로그램이 끝나지 않았다"는
 * 상태다. Call Stack만 보면 그 순간이 빈 화면이라 아무 일도 없어 보인다.
 * 남아 있는 일을 여기에 두어야 그 순간이 설명된다.
 */
function TaskRow({ task }: { task: TaskState }) {
  const label =
    task.state === "pending" ? "대기" : task.state === "fulfilled" ? "완료" : "실패";
  return (
    <li className={`task is-${task.state}`}>
      <span className="t-label">{task.label}</span>
      <span className="t-state">{label}</span>
      {task.value && task.state !== "pending" && (
        <span className="t-value">
          {task.value.kind === "primitive" ? task.value.repr : `→ ${task.value.id}`}
        </span>
      )}
      {task.awaitedBy && <span className="t-waiter">{task.awaitedBy}가 기다림</span>}
    </li>
  );
}

export function StatePanel({ state, panelId }: { state: ProgramState; panelId?: string }) {
  // §3.5 스택의 아래는 오래된 호출, 위는 현재 활성 호출
  const stack = [...state.frames].reverse();
  const heapEntries = Object.values(state.heap);

  return (
    <section className="panel panel-state" id={panelId} aria-label="상태">
      <header className="panel-head">
        <h2>STATE</h2>
        <span className="panel-sub">이벤트 {state.step}</span>
      </header>

      <div className="block">
        <h3>
          Call Stack <span className="hint">위가 현재 활성 호출</span>
        </h3>
        <ul className="frames">
          {stack.map((frame) => (
            <FrameCard key={frame.id} frame={frame} step={state.step} />
          ))}
        </ul>
      </div>

      {heapEntries.length > 0 && (
        <div className="block">
          <h3>
            객체 <span className="hint">변수가 가리키는 대상</span>
          </h3>
          <ul className="heap">
            {heapEntries.map((obj) => (
              <li key={obj.id} className="heap-box">
                <div className="h-head">
                  <span className="h-id">{obj.id}</span>
                  <span className="h-label">{heapLabel(obj)}</span>
                  {obj.kind === "sequence" && obj.frozen && (
                    <span className="h-tag" title="Tuple은 만든 뒤 바꿀 수 없습니다">잠김</span>
                  )}
                  {obj.kind === "mapping" && obj.label === "instance" && (
                    <span className="h-tag" title="설계도(class)로 만든 실물입니다. method는 설계도 카드에 하나만 있습니다">
                      인스턴스
                    </span>
                  )}
                  {obj.kind === "class" && (
                    <span className="h-tag" title="설계도입니다. 여기에는 값이 아니라 만드는 규칙이 있습니다">
                      설계도
                    </span>
                  )}
                  {obj.kind === "set" && obj.unordered && (
                    <span className="h-tag" title="Python의 set은 순서를 보장하지 않습니다. 보이는 차례는 표시를 위해 고정한 것입니다">
                      순서 없음
                    </span>
                  )}
                  <span className="h-count">
                    {obj.kind === "sequence" || obj.kind === "set"
                      ? `${obj.items.length}개`
                      : obj.kind === "mapping"
                        ? `${obj.entries.length}개`
                        : obj.kind === "class"
                          ? `method ${obj.methods.length}개`
                          : ""}
                  </span>
                </div>
                <HeapContents object={obj} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.tasks.length > 0 && (
        <div className="block">
          <h3>
            대기 중인 작업 <span className="hint">Call Stack에는 없지만 끝나지 않은 일</span>
          </h3>
          <ul className="tasks">
            {state.tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        </div>
      )}

      {state.error && (
        <div className="block">
          <h3>오류</h3>
          <p className="error-box">
            <strong>{state.error.name}</strong>: {state.error.message}
            <span className="hint"> ({state.error.line}번 줄)</span>
          </p>
        </div>
      )}
    </section>
  );
}
