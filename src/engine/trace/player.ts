/**
 * 트레이스 플레이어.
 *
 * 핵심 결정: 실행과 재생을 분리한다. 코드는 이미 끝까지 실행되어 이벤트
 * 배열로 남았고, Prev / Step / Auto / 타임라인 / 중단점까지 실행은 전부
 * 이 배열 위의 커서 이동이다. 일시정지 가능한 인터프리터가 필요 없다.
 *
 * 상태는 events를 접어서 만든다. 매번 0부터 접으면 O(n²)이 되므로
 * keyframe을 일정 간격으로 캐시하고 거기서부터 앞으로만 접는다.
 */

import { applyEvent, initialState } from "./reducer.ts";
import type { DetailLevel, ProgramState, TraceDocument, TraceEvent } from "./types.ts";

const KEYFRAME_INTERVAL = 40;

export interface TimelineMarker {
  /** 이 마커가 가리키는 커서 값 (= 적용된 이벤트 개수) */
  cursor: number;
  kind: "call" | "return" | "loop" | "output" | "error" | "branch" | "end";
  line: number;
  label: string;
}

export class TracePlayer {
  readonly doc: TraceDocument;
  /** 커서 = 적용된 이벤트 개수. 0이면 실행 전. */
  readonly maxCursor: number;

  #keyframes: Map<number, ProgramState> = new Map();

  constructor(doc: TraceDocument) {
    this.doc = doc;
    this.maxCursor = doc.events.length;
    this.#keyframes.set(0, initialState(doc));
  }

  get events(): TraceEvent[] {
    return this.doc.events;
  }

  /** 커서 위치에서 방금 적용된 이벤트. 커서 0이면 null. */
  eventAt(cursor: number): TraceEvent | null {
    if (cursor <= 0 || cursor > this.maxCursor) return null;
    return this.doc.events[cursor - 1] ?? null;
  }

  stateAt(cursor: number): ProgramState {
    const target = Math.max(0, Math.min(cursor, this.maxCursor));
    const cached = this.#keyframes.get(target);
    if (cached) return cached;

    // 가장 가까운 이전 keyframe을 찾아 거기서부터 앞으로 접는다.
    let base = 0;
    for (const key of this.#keyframes.keys()) {
      if (key <= target && key > base) base = key;
    }

    let state = this.#keyframes.get(base)!;
    for (let i = base; i < target; i += 1) {
      state = applyEvent(state, this.doc.events[i]!, this.doc.source.path);
      if ((i + 1) % KEYFRAME_INTERVAL === 0) {
        this.#keyframes.set(i + 1, state);
      }
    }
    this.#keyframes.set(target, state);
    return state;
  }

  /**
   * 상세도에 따라 실제로 멈추는 커서 목록.
   *
   * 중요: 이벤트를 "숨긴다"는 것이 "실행하지 않는다"가 아니다. 상태는 항상
   * 모든 이벤트를 적용해 계산하고, 멈추는 지점만 걸러낸다.
   */
  stops(detail: DetailLevel): number[] {
    const result = [0];
    this.doc.events.forEach((event, index) => {
      if (detail === "expression" || event.detail === "core") result.push(index + 1);
    });
    return result;
  }

  /** §3.7 타임라인: 함수 호출, 오류, 출력, 반복 회차로 이동 */
  markers(): TimelineMarker[] {
    const out: TimelineMarker[] = [];
    this.doc.events.forEach((event, index) => {
      const cursor = index + 1;
      switch (event.type) {
        case "FUNCTION_ENTER":
          out.push({
            cursor,
            kind: "call",
            line: event.line,
            label: `${event.name}#${event.callNumber}`,
          });
          break;
        case "FUNCTION_RETURN":
          out.push({ cursor, kind: "return", line: event.line, label: "return" });
          break;
        case "LOOP_ITERATION":
          out.push({
            cursor,
            kind: "loop",
            line: event.line,
            label: `#${event.index + 1}`,
          });
          break;
        case "OUTPUT_APPEND":
          out.push({ cursor, kind: "output", line: event.line, label: event.text });
          break;
        case "BRANCH_TAKEN":
          out.push({ cursor, kind: "branch", line: event.line, label: event.label });
          break;
        case "ERROR_THROW":
          out.push({ cursor, kind: "error", line: event.line, label: event.name });
          break;
        case "PROGRAM_END":
          out.push({ cursor, kind: "end", line: event.line, label: "끝" });
          break;
        default:
          break;
      }
    });
    return out;
  }

  /** §3.7 Run to breakpoint. 반복이 긴 예제에 필수. */
  nextBreakpoint(from: number, breakpoints: Set<number>, stops: number[]): number | null {
    if (breakpoints.size === 0) return null;
    for (const cursor of stops) {
      if (cursor <= from) continue;
      const event = this.eventAt(cursor);
      if (event && breakpoints.has(event.line)) return cursor;
    }
    return null;
  }
}
