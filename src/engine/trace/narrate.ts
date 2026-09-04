/**
 * 이벤트 → 단계 설명 문구.
 *
 * §9.3의 규칙: [실행 위치] + [사용한 실제 값] + [변경 또는 선택] + [다음 흐름]
 *
 * 손으로 쓰지 않는 것이 요점이다. P11을 9×9로 확장하면 단계가 수백 개라
 * 사람이 감당할 수 없다. 여기서 기계적으로 만들고, 레슨은 특정 단계만
 * `message` 필드로 덮어쓴다.
 */

import { josa } from "./josa.ts";
import type { HeapObject, LoopState, ProgramState, TraceEvent, Value } from "./types.ts";

/**
 * 값을 문장에 넣을 수 있는 형태로 만든다.
 *
 * 참조는 힙을 따라가 내용을 보여 준다. "변수 measurements에 <list@1>이
 * 저장됩니다"는 학습자에게 아무 의미가 없다 (§1.2-3 값의 출처 표시).
 */
export function show(value: Value | undefined, state?: ProgramState): string {
  if (!value) return "?";
  if (value.kind === "primitive") return value.repr;
  const object = state?.heap[value.id];
  return object ? heapText(object, state) : `<${value.id}>`;
}

const PREVIEW = 6;

function heapText(object: HeapObject, state?: ProgramState): string {
  switch (object.kind) {
    case "function":
      return `함수 ${object.name}(${object.params.map((p) => p.name).join(", ")})`;
    case "sequence": {
      const items = object.items.slice(0, PREVIEW).map((v) => show(v, state));
      if (object.items.length > PREVIEW) items.push("…");
      const inner = items.join(", ");
      // JS 배열도 대괄호다. 괄호로 감싸는 것은 파이썬 튜플뿐이다.
      return object.label === "tuple" ? `(${inner})` : `[${inner}]`;
    }
    case "mapping": {
      // 인스턴스는 점으로 닿는 이름의 묶음이라 중괄호로 쓰면 dict로 읽힌다
      if (object.label === "instance") {
        const attrs = object.entries
          .slice(0, PREVIEW)
          .map((e) => `${e.key}=${show(e.value, state)}`);
        if (object.entries.length > PREVIEW) attrs.push("…");
        return `${object.className ?? "instance"}(${attrs.join(", ")})`;
      }
      const entries = object.entries
        .slice(0, PREVIEW)
        .map((e) => `${e.key}: ${show(e.value, state)}`);
      if (object.entries.length > PREVIEW) entries.push("…");
      return `{${entries.join(", ")}}`;
    }
    case "set": {
      const items = object.items.slice(0, PREVIEW).map((v) => show(v, state));
      if (object.items.length > PREVIEW) items.push("…");
      return `{${items.join(", ")}}`;
    }
    case "range":
      return `range(${object.start}, ${object.stop}${object.step !== 1 ? `, ${object.step}` : ""})`;
    case "class":
      return `클래스 ${object.name}`;
    case "module":
      return `module ${object.name}`;
  }
}

/** 한국어 서수. "1번째 회차"보다 "첫 번째 회차"가 읽기 쉽다. */
const NATIVE_ORDINALS = [
  "첫", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열",
];
const ordinal = (n: number) =>
  n < NATIVE_ORDINALS.length ? `${NATIVE_ORDINALS[n]} 번째` : `${n + 1}번째`;

const truth = (value: boolean) => (value ? "참" : "거짓");

/**
 * 파일 내용을 문장에 넣는다. 줄바꿈을 그대로 흘리면 한 문장이 여러 줄로
 * 찢어지고, 눈에 보이지 않는 `\n`이 이 레슨의 핵심이라 기호로 드러낸다.
 */
const quote = (text: string) => `'${text.replace(/\n/g, "\\n")}'`;

const KIND_LABEL: Record<string, string> = {
  function: "함수",
  sequence: "리스트",
  mapping: "딕셔너리",
  set: "집합",
  range: "range",
  class: "클래스",
  module: "module",
};

export function narrate(event: TraceEvent, state: ProgramState): string {
  if (event.message) return event.message;
  const at = `${event.line}번 줄`;

  switch (event.type) {
    case "LINE_ENTER":
      return `${at}을 실행합니다.`;

    case "LINE_EXIT":
      return `${at} 실행을 마쳤습니다.`;

    case "PROGRAM_END":
      if (event.reason === "truncated")
        return "실행 단계 상한에 도달해 중단했습니다. 반복 조건이 계속 참인지 확인하세요.";
      if (event.reason === "error") return "오류로 프로그램이 종료되었습니다.";
      return "프로그램이 끝났습니다. 더 실행할 줄이 없습니다.";

    case "EXPRESSION_EVAL": {
      const expr = event.substituted ?? event.expression;
      if (event.pending) return `${at}의 \`${expr}\`${josa(expr, "을를")} 계산할 차례입니다.`;
      const result = show(event.result, state);
      return `${at}에서 \`${expr}\`${josa(expr, "을를")} 계산해 ${result}${josa(
        result,
        "을를",
      )} 얻었습니다.`;
    }

    case "VARIABLE_CREATE": {
      const value = show(event.value, state);
      return `${at}에서 변수 \`${event.name}\`${josa(
        event.name,
        "이가",
      )} 만들어지고 ${value}${josa(value, "이가")} 저장됩니다.`;
    }

    case "VARIABLE_UPDATE": {
      const before = show(event.before, state);
      const after = show(event.after, state);
      return `${at}에서 \`${event.name}\`${josa(event.name, "이가")} ${before}에서 ${after}${josa(
        after,
        "로",
      )} 바뀝니다.`;
    }

    case "VARIABLE_DELETE":
      return `${at}에서 \`${event.name}\`${josa(event.name, "이가")} 제거됩니다.`;

    case "BRANCH_TEST": {
      const expr = event.substituted ?? event.expression;
      const skipped = event.skipped?.length
        ? ` \`${event.skipped.join("`, `")}\`은 단축 평가로 계산하지 않았습니다.`
        : "";
      return `${at}의 조건 \`${expr}\`${josa(expr, "은는")} ${truth(event.result)}입니다.${skipped}`;
    }

    case "BRANCH_TAKEN":
      return `조건이 참인 \`${event.label}\` 경로를 선택해 ${event.targetLine}번 줄로 갑니다.`;

    case "LOOP_START": {
      const vars = event.varNames.join(", ");
      const who = vars ? `\`${vars}\` 반복` : "반복";
      // 값 목록을 미리 알 수 있는 반복(for...of, for x in ...)만 트랙이 찬다.
      // 카운터 for와 while은 매 회차 조건을 검사해야 다음 값이 정해진다.
      if (event.track.length === 0) {
        return `${at}에서 ${who}이 시작됩니다. 반복할 값이 정해져 있지 않아 회차마다 조건을 검사합니다.`;
      }
      return `${at}에서 ${who}이 시작됩니다. 반복 값은 ${event.track.join(", ")}입니다.`;
    }

    case "LOOP_ITERATION": {
      const loop = state.loops.find((l) => l.id === event.loopId);
      const vars = loop?.varNames.join(", ") ?? "";
      const value = loopValue(state, loop);
      const head = `${at}: ${ordinal(event.index)} 회차입니다.`;
      if (!vars || !value) return `${head}${describeCombo(state)}`;
      return `${head} \`${vars}\`에 ${value}${josa(value, "이가")} 들어갑니다.${describeCombo(state)}`;
    }

    case "LOOP_END":
      return event.reason === "break"
        ? `${at}에서 \`break\`로 반복을 중단합니다.`
        : `${at}의 반복 값이 모두 소진되어 반복이 끝났습니다.`;

    case "FUNCTION_DEFINE":
      return `${at}에서 함수 \`${event.name}\`${josa(
        event.name,
        "이가",
      )} 정의됩니다. 본문은 아직 실행되지 않습니다.`;

    case "FUNCTION_CALL":
      return `${at}에서 \`${event.substituted}\`${josa(
        event.substituted,
        "을를",
      )} 호출합니다. 현재 값으로 치환하면 이 형태입니다.`;

    case "FUNCTION_ENTER": {
      if (event.kind === "module")
        return `\`${event.name}\` module의 최상위 코드를 실행할 프레임이 생깁니다. 여기서 만든 이름들이 그 module의 namespace가 됩니다.`;
      const frame = `${event.name}#${event.callNumber}`;
      return `\`${event.name}\`의 새 프레임 ${frame}${josa(
        frame,
        "이가",
      )} 만들어집니다. 끝나면 ${event.returnLine}번 줄로 돌아갑니다.`;
    }

    case "PARAMETER_BIND": {
      const value = show(event.value, state);
      return `매개변수 \`${event.name}\`에 ${event.from ? `\`${event.from}\`의 ` : ""}${value}${josa(
        value,
        "이가",
      )} 연결됩니다.`;
    }

    case "FUNCTION_RETURN": {
      const value = show(event.value, state);
      return `${at}에서 ${value}${josa(
        value,
        "을를",
      )} 반환합니다. 이 값이 ${event.toLine}번 줄의 호출 위치로 돌아갑니다.`;
    }

    case "FRAME_POP":
      if (event.reason === "abandoned")
        return `${event.poppedFrameId}${josa(
          event.poppedFrameId,
          "은는",
        )} 값을 더 요구받지 않아 멈춘 채로 남아 있었습니다. 프로그램이 끝나며 정리됩니다.`;
      return `${event.poppedFrameId} 프레임이 제거됩니다. 그 안의 지역 변수는 스코프 종료로 사라집니다.`;

    case "GENERATOR_CREATE":
      // 호출했는데 아무 일도 안 일어나는 것처럼 보이는 순간이다. 그것이 요점이다.
      return `${at}에서 \`${event.substituted}\`${josa(
        event.substituted,
        "을를",
      )} 호출했지만 몸통은 아직 한 줄도 실행되지 않습니다. 값을 요구받을 때 비로소 시작합니다.`;

    case "GENERATOR_YIELD": {
      const value = show(event.value, state);
      // 설명 문구는 평문으로 그려진다. 마크다운 기호를 넣으면 별표가 그대로 보인다.
      return `\`yield\`가 ${value}${josa(
        value,
        "을를",
      )} 내보내고 이 프레임은 사라지지 않고 멈춘 채로 남습니다. 지역 변수는 그대로입니다.`;
    }

    case "GENERATOR_RESUME":
      return "값이 한 번 더 필요해졌습니다. 멈췄던 자리에서 이어서 실행합니다.";

    case "MODULE_IMPORT": {
      const bound = `\`${event.binds.join("`, `")}\``;
      // §5: import는 함수 내용을 복사하는 것이 아니다. 이 문장이 그 오해를 막는다.
      if (event.names)
        return `${at}에서 \`${event.module}\` 카드의 ${bound}${josa(
          event.binds.join(", "),
          "을를",
        )} 현재 namespace에 직접 연결합니다.`;
      const how = event.cached
        ? "이미 불러온 module 객체를 그대로 씁니다"
        : "module의 최상위 코드를 한 번 실행해 namespace를 채웠습니다";
      return `${at}에서 ${bound}${josa(
        event.binds.join(", "),
        "이가",
      )} \`${event.module}\` module 객체를 가리킵니다. ${how}.`;
    }

    case "FILE_OPEN": {
      const where = event.mode === "a" ? "끝" : "0번 위치";
      const gone = event.discarded
        ? ` \`w\` 모드라 기존 내용 ${quote(event.discarded)}${josa(
            quote(event.discarded),
            "은는",
          )} 지워졌습니다.`
        : "";
      return `${at}에서 \`${event.path}\`로 가는 ${event.mode} 모드 통로가 열립니다. 커서는 ${where}입니다.${gone}`;
    }

    case "FILE_WRITE":
      // 자동 줄바꿈이 없다는 것이 §9 Step 2가 짚는 지점이다
      return `${quote(event.text)}${josa(quote(event.text), "을를")} 커서 위치에 씁니다. 커서가 ${
        event.cursor
      }${josa(String(event.cursor), "로")} 옮겨집니다.`;

    case "FILE_READ":
      return `파일에서 ${quote(event.text)}${josa(quote(event.text), "을를")} 읽어 메모리로 가져옵니다. 커서는 ${event.cursor}입니다.`;

    case "FILE_CLOSE":
      return `\`${event.path}\` 통로를 닫습니다. 디스크에 남은 내용은 ${quote(event.content)}입니다.`;

    case "CLASS_DEFINE": {
      const methods = event.methods.filter((m) => m !== "__init__");
      const shared = methods.length ? ` 공유 method는 \`${methods.join("`, `")}\`입니다.` : "";
      return `${at}에서 클래스 \`${event.name}\`${josa(
        event.name,
        "이가",
      )} 정의됩니다. 설계도가 생겼을 뿐 아직 실물은 없습니다.${shared}`;
    }

    case "INSTANCE_CREATE":
      // §10-2. __init__이 인스턴스를 "반환해 만든다"는 오해를 여기서 끊는다.
      return `${event.className} 설계도로 빈 인스턴스 ${event.heapId}${josa(
        event.heapId,
        "이가",
      )} 먼저 만들어집니다. 이어서 \`__init__\`이 그 객체의 초기 상태를 채웁니다.`;

    case "ATTR_READ": {
      const value = show(event.value, state);
      const where =
        event.owner === "instance"
          ? "이 인스턴스"
          : event.owner === "module"
            ? "module 카드"
            : "클래스 카드";
      return `\`${event.attr}\`${josa(event.attr, "을를")} ${where}에서 찾아 ${value}${josa(
        value,
        "을를",
      )} 읽습니다.`;
    }

    case "ATTR_WRITE": {
      const after = show(event.after, state);
      if (!event.before)
        return `이 인스턴스에 \`${event.attr}\` attribute가 새로 생기고 ${after}${josa(
          after,
          "이가",
        )} 들어갑니다.`;
      return `이 인스턴스의 \`${event.attr}\`${josa(event.attr, "이가")} ${show(
        event.before,
        state,
      )}에서 ${after}${josa(after, "로")} 바뀝니다. 다른 인스턴스는 그대로입니다.`;
    }

    case "HEAP_ALLOC": {
      const object = event.object;
      if (object.kind === "class")
        return `${at}에 \`${object.name}\` 설계도 카드가 놓입니다. method는 여기에 하나만 있고 모든 인스턴스가 함께 씁니다.`;
      // 인스턴스를 "딕셔너리 객체"라고 부르면 §11이 애써 갈라놓은 둘이 붙는다
      if (object.kind === "mapping" && object.label === "instance")
        return `${at}에서 ${object.className ?? ""} 인스턴스 카드의 내용이 갱신됩니다.`;
      const kind = KIND_LABEL[object.kind];
      return `${at}에서 ${kind} 객체가 만들어집니다. 변수에는 이 객체를 가리키는 참조가 담깁니다.`;
    }

    case "ITEM_READ": {
      const value = show(event.value, state);
      return `\`${event.key}\` 위치의 값 ${value}${josa(value, "을를")} 읽습니다.`;
    }

    case "ITEM_WRITE": {
      const after = show(event.after, state);
      // 없던 키에 값을 넣는 것은 변경이 아니라 삽입이다. 이전 값이 없는데
      // "…에서 …로 바뀝니다"라고 하면 빈 자리가 생긴다.
      if (!event.before)
        return `\`${event.key}\` 자리가 새로 만들어지고 ${after}${josa(after, "이가")} 들어갑니다.`;
      return `\`${event.key}\` 위치가 ${show(event.before, state)}에서 ${after}${josa(
        after,
        "로",
      )} 바뀝니다.`;
    }

    case "ITEM_APPEND": {
      const value = show(event.value, state);
      return `${value}${josa(value, "이가")} 끝에 추가됩니다.`;
    }

    case "ITEM_REMOVE":
      return `\`${event.key}\` 위치의 값이 제거됩니다.`;

    case "ITERATOR_MOVE": {
      const value = show(event.value, state);
      return `${ordinal(event.index)} 원소 ${value}${josa(value, "로")} 이동합니다.`;
    }

    case "OUTPUT_APPEND":
      return `${at}의 출력으로 \`${event.text}\`${josa(event.text, "이가")} 나타납니다.`;

    case "ERROR_THROW":
      return `${at}에서 ${event.name}${josa(event.name, "이가")} 발생했습니다: ${event.message}`;

    case "ERROR_PROPAGATE":
      return `오류가 ${event.fromFrameId}에서 ${event.toFrameId}로 전달됩니다.`;

    case "ERROR_CATCH":
      return `${event.handlerLine}번 줄의 처리 블록이 오류를 받았습니다. 실행이 이어집니다.`;

    case "TASK_CREATE":
      return `비동기 작업 \`${event.label}\`${josa(event.label, "이가")} 만들어집니다.`;

    case "PROMISE_STATE": {
      const task = state.tasks.find((t) => t.id === event.taskId);
      const name = task ? `\`${task.label}\`` : "이 작업";
      if (event.state === "pending")
        return `${name}${josa(task?.label ?? "작업", "은는")} 아직 결과가 정해지지 않았습니다. 프로그램은 여기서 멈추지 않습니다.`;
      const value = event.value ? show(event.value, state) : "값 없음";
      if (event.state === "rejected")
        return `${name}${josa(task?.label ?? "작업", "이가")} ${value}${josa(value, "로")} 실패로 정해졌습니다.`;
      return `${name}의 결과가 ${value}${josa(value, "로")} 정해졌습니다. 이 값을 기다리던 코드가 다음 차례에 깨어납니다.`;
    }

    case "AWAIT_SUSPEND":
      return `${at}의 \`await\`에서 이 프레임이 호출 스택을 떠납니다. 지역 변수는 그대로 든 채입니다. 그 사이 다른 코드가 실행됩니다.`;

    case "AWAIT_RESUME": {
      const value = show(event.value, state);
      return `대기하던 값 ${value}${josa(value, "이가")} 도착해 ${at}부터 재개합니다.`;
    }

    case "TASK_COMPLETE": {
      const task = state.tasks.find((t) => t.id === event.taskId);
      return `${task ? `\`${task.label}\`` : "이 작업"}${josa(task?.label ?? "작업", "이가")} 끝났습니다. 대기 목록에서 빠집니다.`;
    }
  }
}

/**
 * 반복 변수의 현재 값.
 *
 * 트랙이 있으면 그 회차의 값이고, 없으면(카운터 for·while) 변수에 실제로
 * 들어 있는 값을 읽는다. 둘 다 없으면 값 구절을 통째로 뺀다. 문장에 물음표를
 * 남기느니 짧게 끝내는 편이 낫다.
 */
export function loopValue(state: ProgramState, loop: LoopState | undefined): string | null {
  if (!loop) return null;
  const tracked = loop.track[loop.index];
  if (tracked !== undefined) return tracked;
  const name = loop.varNames[0];
  if (!name) return null;
  const frame = state.frames.find((f) => f.id === loop.frameId) ?? state.frames.at(-1);
  const binding = frame?.bindings.find((b) => b.name === name && !b.retired);
  return binding ? show(binding.value, state) : null;
}

/** 중첩 반복에서 현재 조합을 덧붙인다. §P11의 "현재 조합은 (0, 0)이다" */
function describeCombo(state: ProgramState): string {
  const running = state.loops.filter((l) => l.status === "running" && l.index >= 0);
  if (running.length < 2) return "";
  const pairs = running.map((l) => loopValue(state, l));
  if (pairs.some((value) => value === null)) return "";
  return ` 현재 조합은 (${pairs.join(", ")})입니다.`;
}

/**
 * §3.11 스크린 리더용 요약.
 * "6번 줄 실행, 변수 result가 6에서 8로 변경됨" 형태의 짧은 문장.
 */
export function narrateForScreenReader(event: TraceEvent, state: ProgramState): string {
  const head = `${event.line}번 줄`;
  switch (event.type) {
    case "VARIABLE_UPDATE": {
      const after = show(event.after, state);
      return `${head}, 변수 ${event.name}${josa(event.name, "이가")} ${show(
        event.before,
      )}에서 ${after}${josa(after, "로")} 변경됨`;
    }
    case "VARIABLE_CREATE":
      return `${head}, 변수 ${event.name} 생성, 값 ${show(event.value, state)}`;
    case "FUNCTION_ENTER":
      return `${head}, ${event.name} 함수 진입, 프레임 ${event.callNumber}번`;
    case "FUNCTION_RETURN":
      return `${head}, ${show(event.value, state)} 반환`;
    case "FRAME_POP":
      return `${head}, ${event.poppedFrameId} 프레임 제거`;
    case "LOOP_ITERATION": {
      const loop = state.loops.find((l) => l.id === event.loopId);
      const vars = loop?.varNames.join(", ") ?? "";
      const value = loopValue(state, loop);
      if (!vars || !value) return `${head}, 반복 ${event.index + 1}회차`;
      return `${head}, 반복 ${event.index + 1}회차, ${vars}${josa(vars, "은는")} ${value}`;
    }
    case "ERROR_THROW":
      return `${head}, 오류 ${event.name}`;
    default:
      return narrate(event, state);
  }
}
