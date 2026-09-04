/**
 * 기획서 §16의 대표 데모를 손으로 만든 골든 트레이스.
 *
 * 이 파일의 목적은 "예제 하나를 돌리는 것"이 아니라 **스키마 검증**이다.
 * tracer를 한 줄도 쓰기 전에, 이벤트 스키마만으로 §17이 지목한 세 장면 중
 * 두 개(반복 재시작 / 인수·반환)를 화면에 그릴 수 있는지 확인한다.
 * 여기서 스키마를 고치는 건 하루, tracer 두 개를 만든 뒤 고치는 건 몇 주다.
 *
 * ── detail 규칙 ──────────────────────────────────────────────
 * `core`는 **의미 단위를 닫는 이벤트**에 붙인다 (§3.2 "학습자에게 의미가 있는
 * 변화를 한 단계로 정의한다"). 예를 들어 프레임 생성과 두 개의 매개변수
 * 바인딩은 §16 표에서 한 단계(7단계)이므로, 앞의 둘은 expression이고
 * 마지막 PARAMETER_BIND만 core다. core 모드에서 그 지점에 멈추면 상태에는
 * 이미 세 이벤트가 모두 적용되어 있다.
 */

import { josa } from "../trace/josa.ts";
import type { TraceDocument, TraceEvent, Value } from "../trace/types.ts";

type WithoutStep<T> = T extends unknown ? Omit<T, "step"> : never;

class TraceBuilder {
  readonly events: TraceEvent[] = [];

  add(event: WithoutStep<TraceEvent>): void {
    this.events.push({ ...event, step: this.events.length + 1 } as TraceEvent);
  }
}

const int = (n: number): Value => ({ kind: "primitive", type: "int", repr: String(n) });

const sourceFor = (size: number) => [
  "def mul(a, b):",
  "    return a * b",
  "",
  `for i in range(0, ${size}):`,
  `    for k in range(0, ${size}):`,
  "        result = mul(i, k)",
];

const LINE_DEF = 1;
const LINE_RETURN = 2;
const LINE_OUTER = 4;
const LINE_INNER = 5;
const LINE_BODY = 6;

export function buildMulDemo(size = 3): TraceDocument {
  const b = new TraceBuilder();
  const track = Array.from({ length: size }, (_, n) => String(n));
  let callNumber = 0;

  // ── 1단계: 함수 정의 ──────────────────────────────────────
  b.add({
    type: "FUNCTION_DEFINE",
    line: LINE_DEF,
    frameId: "global",
    detail: "core",
    name: "mul",
    heapId: "fn:mul",
    params: [{ name: "a" }, { name: "b" }],
    message: "1번 줄에서 함수 `mul`이 정의됩니다. 본문(2번 줄)은 아직 실행되지 않습니다.",
  });

  // ── 2단계: 바깥 반복 준비 ─────────────────────────────────
  b.add({
    type: "LOOP_START",
    line: LINE_OUTER,
    frameId: "global",
    detail: "core",
    loopId: "loop:i@4",
    varNames: ["i"],
    track,
    message: `4번 줄의 \`range(0, ${size})\`가 만드는 값은 ${track.join(
      ", ",
    )}입니다. 끝값 ${size}${josa(String(size), "은는")} 포함되지 않습니다.`,
  });

  for (let i = 0; i < size; i += 1) {
    // 반복 변수 갱신 → 회차 시작. core 스톱은 회차 시작 쪽에 둔다.
    b.add({
      type: i === 0 ? "VARIABLE_CREATE" : "VARIABLE_UPDATE",
      line: LINE_OUTER,
      frameId: "global",
      detail: "expression",
      name: "i",
      ...(i === 0
        ? { value: int(i) }
        : { before: int(i - 1), after: int(i) }),
      origin: { kind: "iteration", label: "range" },
    } as WithoutStep<TraceEvent>);

    b.add({
      type: "LOOP_ITERATION",
      line: LINE_OUTER,
      frameId: "global",
      detail: "core",
      loopId: "loop:i@4",
      index: i,
      message:
        i === 0
          ? "바깥 반복의 첫 회차가 시작되고 `i`는 0입니다."
          : `안쪽 반복이 끝난 뒤에야 바깥 \`i\`가 ${i}${josa(String(i), "로")} 증가합니다.`,
    });

    // 안쪽 반복은 바깥 회차마다 **새로 시작**한다. §3.6의 핵심 장면.
    b.add({
      type: "LOOP_START",
      line: LINE_INNER,
      frameId: "global",
      detail: "core",
      loopId: "loop:k@5",
      varNames: ["k"],
      track,
      parentLoopId: "loop:i@4",
      message: `\`i\`는 ${i}${josa(String(i), "로")} 고정된 채 \`k\` 반복이 0부터 새로 시작합니다.`,
    });

    for (let k = 0; k < size; k += 1) {
      b.add({
        type: i === 0 && k === 0 ? "VARIABLE_CREATE" : "VARIABLE_UPDATE",
        line: LINE_INNER,
        frameId: "global",
        detail: "expression",
        name: "k",
        ...(i === 0 && k === 0
          ? { value: int(k) }
          : { before: int(k === 0 ? size - 1 : k - 1), after: int(k) }),
        origin: { kind: "iteration", label: "range" },
      } as WithoutStep<TraceEvent>);

      b.add({
        type: "LOOP_ITERATION",
        line: LINE_INNER,
        frameId: "global",
        detail: "core",
        loopId: "loop:k@5",
        index: k,
        message: `현재 조합은 (${i}, ${k})입니다.`,
      });

      // ── 본문: result = mul(i, k) ────────────────────────
      callNumber += 1;
      const frameId = `mul#${callNumber}`;

      b.add({
        type: "LINE_ENTER",
        line: LINE_BODY,
        frameId: "global",
        detail: "expression",
      });
      b.add({
        type: "EXPRESSION_EVAL",
        line: LINE_BODY,
        frameId: "global",
        detail: "expression",
        expression: "i",
        result: int(i),
        message: `인수 자리의 \`i\`를 읽어 ${i}을 얻습니다.`,
      });
      b.add({
        type: "EXPRESSION_EVAL",
        line: LINE_BODY,
        frameId: "global",
        detail: "expression",
        expression: "k",
        result: int(k),
        message: `인수 자리의 \`k\`를 읽어 ${k}을 얻습니다.`,
      });
      b.add({
        type: "FUNCTION_CALL",
        line: LINE_BODY,
        frameId: "global",
        detail: "core",
        callee: "mul",
        substituted: `mul(${i}, ${k})`,
        args: [
          { value: int(i), from: "global.i" },
          { value: int(k), from: "global.k" },
        ],
        targetFrameId: frameId,
        message: `\`mul(i, k)\`를 현재 값으로 치환하면 \`mul(${i}, ${k})\`입니다.`,
      });
      b.add({
        type: "FUNCTION_ENTER",
        line: LINE_DEF,
        frameId,
        detail: "expression",
        name: "mul",
        callNumber,
        parentFrameId: "global",
        returnLine: LINE_BODY,
      });
      b.add({
        type: "PARAMETER_BIND",
        line: LINE_DEF,
        frameId,
        detail: "expression",
        name: "a",
        value: int(i),
        from: "global.i",
      });
      b.add({
        type: "PARAMETER_BIND",
        line: LINE_DEF,
        frameId,
        detail: "core",
        name: "b",
        value: int(k),
        from: "global.k",
        message: `새 프레임 ${frameId}이 만들어지고 인수가 매개변수로 연결됩니다: a=${i}, b=${k}. 같은 함수라도 호출마다 별도 프레임입니다.`,
      });
      b.add({
        type: "LINE_ENTER",
        line: LINE_RETURN,
        frameId,
        detail: "expression",
      });
      b.add({
        type: "EXPRESSION_EVAL",
        line: LINE_RETURN,
        frameId,
        detail: "core",
        expression: "a * b",
        substituted: `${i} * ${k}`,
        result: int(i * k),
        message: `${frameId}의 지역 변수로 \`${i} * ${k}\`${josa(String(k), "을를")} 계산해 ${i * k}${josa(String(i * k), "을를")} 얻습니다.`,
      });
      b.add({
        type: "FUNCTION_RETURN",
        line: LINE_RETURN,
        frameId,
        detail: "expression",
        value: int(i * k),
        toLine: LINE_BODY,
      });
      b.add({
        type: "FRAME_POP",
        line: LINE_BODY,
        frameId: "global",
        detail: "expression",
        poppedFrameId: frameId,
      });
      b.add({
        type: i === 0 && k === 0 ? "VARIABLE_CREATE" : "VARIABLE_UPDATE",
        line: LINE_BODY,
        frameId: "global",
        detail: "core",
        name: "result",
        ...(i === 0 && k === 0
          ? { value: int(0) }
          : { before: int(previousResult(i, k, size)), after: int(i * k) }),
        origin: { kind: "return", from: frameId },
        message: `반환값 ${i * k}${josa(String(i * k), "이가")} 6번 줄의 호출 위치로 돌아와 \`result\`에 저장되고, ${frameId}의 \`a\`, \`b\`는 사라집니다.`,
      } as WithoutStep<TraceEvent>);
    }

    b.add({
      type: "LOOP_END",
      line: LINE_INNER,
      frameId: "global",
      detail: "core",
      loopId: "loop:k@5",
      reason: "exhausted",
      message: `\`k\`가 ${size - 1}까지 모두 소진되어 안쪽 반복이 끝났습니다. 이제 바깥 반복으로 돌아갑니다.`,
    });
  }

  b.add({
    type: "LOOP_END",
    line: LINE_OUTER,
    frameId: "global",
    detail: "core",
    loopId: "loop:i@4",
    reason: "exhausted",
  });
  b.add({
    type: "PROGRAM_END",
    line: LINE_OUTER,
    frameId: "global",
    detail: "core",
    reason: "normal",
    message: `프로그램이 끝났습니다. \`mul\`은 모두 ${size * size}번 호출되었습니다.`,
  });

  return {
    version: 1,
    lessonId: "p11-nested-loops",
    source: { path: "nested_loops.py", language: "python", lines: sourceFor(size) },
    events: b.events,
    meta: {
      generator: `fixture:mulDemo(${size})`,
      truncated: false,
    },
  };
}

/** 직전 회차의 result 값. (i, k)에서 하나 뒤로 간다. */
function previousResult(i: number, k: number, size: number): number {
  if (k > 0) return i * (k - 1);
  return (i - 1) * (size - 1);
}
