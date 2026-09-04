import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TracePlayer } from "../../engine/trace/player.ts";
import type { DetailLevel, TraceDocument } from "../../engine/trace/types.ts";

export const SPEEDS = [0.5, 1, 2, 4] as const;
export type Speed = (typeof SPEEDS)[number];

const BASE_INTERVAL_MS = 900;

/** 현재 커서 이하의 가장 가까운 스톱을 찾는다. */
function snap(stops: number[], cursor: number): number {
  let best = stops[0]!;
  for (const s of stops) {
    if (s <= cursor) best = s;
    else break;
  }
  return best;
}

export function usePlayer(doc: TraceDocument) {
  const player = useMemo(() => new TracePlayer(doc), [doc]);

  const [detail, setDetailRaw] = useState<DetailLevel>("core");
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);
  const [breakpoints, setBreakpoints] = useState<ReadonlySet<number>>(new Set());

  const stops = useMemo(() => player.stops(detail), [player, detail]);
  const markers = useMemo(() => player.markers(), [player]);

  const state = useMemo(() => player.stateAt(cursor), [player, cursor]);
  const event = useMemo(() => player.eventAt(cursor), [player, cursor]);

  const stopIndex = useMemo(() => {
    let index = 0;
    for (let i = 0; i < stops.length; i += 1) {
      if (stops[i]! <= cursor) index = i;
      else break;
    }
    return index;
  }, [stops, cursor]);

  const atEnd = stopIndex >= stops.length - 1;

  /**
   * 상세도를 바꿔도 "지금 보고 있는 지점"은 유지되어야 한다.
   * 상세 → 핵심으로 내릴 때는 현재 커서 이하의 가장 가까운 핵심 스톱으로 붙는다.
   */
  const setDetail = useCallback(
    (next: DetailLevel) => {
      setDetailRaw(next);
      setCursor((c) => snap(player.stops(next), c));
    },
    [player],
  );

  const goToStopIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, stops.length - 1));
      setCursor(stops[clamped]!);
    },
    [stops],
  );

  const step = useCallback(() => {
    if (atEnd) {
      setPlaying(false);
      return;
    }
    goToStopIndex(stopIndex + 1);
  }, [atEnd, goToStopIndex, stopIndex]);

  const prev = useCallback(() => {
    setPlaying(false);
    goToStopIndex(stopIndex - 1);
  }, [goToStopIndex, stopIndex]);

  const reset = useCallback(() => {
    setPlaying(false);
    setCursor(0);
  }, []);

  const jumpToCursor = useCallback(
    (target: number) => {
      setPlaying(false);
      setCursor(snap(stops, target));
    },
    [stops],
  );

  /** §3.7 Run to breakpoint. 반복이 긴 예제에 필수. */
  const runToBreakpoint = useCallback(() => {
    const next = player.nextBreakpoint(cursor, new Set(breakpoints), stops);
    setPlaying(false);
    if (next !== null) setCursor(next);
    else setCursor(stops[stops.length - 1]!);
  }, [player, cursor, breakpoints, stops]);

  const toggleBreakpoint = useCallback((line: number) => {
    setBreakpoints((prevSet) => {
      const next = new Set(prevSet);
      if (next.has(line)) next.delete(line);
      else next.add(line);
      return next;
    });
  }, []);

  // ── 자동 실행 ────────────────────────────────────────────
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => stepRef.current(), BASE_INTERVAL_MS / speed);
    return () => window.clearInterval(id);
  }, [playing, speed]);

  useEffect(() => {
    if (atEnd) setPlaying(false);
  }, [atEnd]);

  return {
    player,
    state,
    event,
    detail,
    setDetail,
    cursor,
    stops,
    stopIndex,
    markers,
    atEnd,
    playing,
    setPlaying,
    speed,
    setSpeed,
    breakpoints,
    toggleBreakpoint,
    step,
    prev,
    reset,
    jumpToCursor,
    goToStopIndex,
    runToBreakpoint,
  };
}

export type PlayerApi = ReturnType<typeof usePlayer>;

/** §3.11 애니메이션 감소 설정 지원 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
