/**
 * 두 트레이스가 같은 실행인지 비교한다.
 *
 * 두 곳에서 쓴다.
 *  · 빌드: 트레이서 결과와 §16 명세(mulDemo 픽스처)가 어긋나지 않는지
 *  · 브라우저: Pyodide로 직접 실행한 결과가 커밋된 골든과 같은지
 *
 * `message`는 레슨이 얹는 해설이고, `span`은 표시용 부가 정보다. 둘 다 실행
 * 자체를 바꾸지 않으므로 비교에서 뺀다.
 */

import type { TraceDocument, TraceEvent } from "./types.ts";

/**
 * 키 순서는 생성기마다 다르므로 **재귀적으로** 정렬한다.
 *
 * JSON.stringify의 replacer 배열을 쓰면 안 된다. 그 배열은 중첩 객체에도
 * 적용되어 `value.repr` 같은 하위 필드를 조용히 빼고 비교하게 된다.
 */
function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, sortDeep(record[key])]),
    );
  }
  return value;
}

export function canonical(event: TraceEvent): string {
  const { message, span, ...rest } = event as TraceEvent & { span?: unknown };
  void message;
  void span;
  return JSON.stringify(sortDeep(rest));
}

export interface EventDiff {
  step: number;
  left: string;
  right: string;
}

/** 첫 번째 불일치를 돌려준다. 같으면 null. */
export function diffEvents(
  left: TraceDocument | TraceEvent[],
  right: TraceDocument | TraceEvent[],
): EventDiff | null {
  const a = Array.isArray(left) ? left : left.events;
  const b = Array.isArray(right) ? right : right.events;

  const shorter = Math.min(a.length, b.length);
  for (let i = 0; i < shorter; i += 1) {
    const x = canonical(a[i]!);
    const y = canonical(b[i]!);
    if (x !== y) return { step: i + 1, left: x, right: y };
  }
  if (a.length !== b.length) {
    return {
      step: shorter + 1,
      left: a[shorter] ? canonical(a[shorter]!) : `(없음 · 총 ${a.length}개)`,
      right: b[shorter] ? canonical(b[shorter]!) : `(없음 · 총 ${b.length}개)`,
    };
  }
  return null;
}
