import { useMemo } from "react";

import { SPEEDS, type PlayerApi, type Speed } from "./usePlayer.ts";

/**
 * 9×9(1093 이벤트)에서는 마커가 250개를 넘어 타임라인이 그냥 막대가 된다.
 * §3.6 "전체 81회 실행은 회차 건너뛰기를 지원해 피로도를 낮춘다"의 취지대로,
 * 드물고 중요한 지점(오류·출력·분기·종료)은 모두 남기고 호출 마커만 솎는다.
 */
const MAX_MARKERS = 60;
const ALWAYS_KEEP = new Set(["error", "end", "output", "branch"]);

const MARKER_LABEL: Record<string, string> = {
  call: "함수 호출",
  return: "반환",
  loop: "반복 회차",
  output: "출력",
  branch: "분기",
  error: "오류",
  end: "종료",
};

export function Controls(api: PlayerApi) {
  const {
    stops,
    stopIndex,
    markers,
    atEnd,
    playing,
    setPlaying,
    speed,
    setSpeed,
    detail,
    setDetail,
    breakpoints,
    step,
    prev,
    reset,
    goToStopIndex,
    jumpToCursor,
    runToBreakpoint,
  } = api;

  const lastIndex = stops.length - 1;

  const shownMarkers = useMemo(() => {
    if (markers.length <= MAX_MARKERS) return markers;
    const keep = markers.filter((m) => ALWAYS_KEEP.has(m.kind));
    const calls = markers.filter((m) => m.kind === "call");
    const budget = Math.max(1, MAX_MARKERS - keep.length);
    const stride = Math.ceil(calls.length / budget);
    const sampled = calls.filter((_, i) => i % stride === 0);
    return [...keep, ...sampled].sort((a, b) => a.cursor - b.cursor);
  }, [markers]);

  return (
    <div className="controls">
      <div className="timeline-row">
        <div className="timeline">
          {/* 마커는 타임라인 위에 겹쳐 놓는다. §3.7 "함수 호출, 오류, 출력 발생 지점으로 이동" */}
          <div className="markers" aria-hidden="true">
            {shownMarkers.map((marker, index) => {
              const at = stops.findIndex((s) => s >= marker.cursor);
              if (at < 0) return null;
              return (
                <button
                  key={index}
                  type="button"
                  className={`marker-dot m-${marker.kind}`}
                  style={{ left: `${(at / Math.max(lastIndex, 1)) * 100}%` }}
                  title={`${MARKER_LABEL[marker.kind]} · ${marker.label} (${marker.line}번 줄)`}
                  onClick={() => jumpToCursor(marker.cursor)}
                  tabIndex={-1}
                />
              );
            })}
          </div>
          <input
            type="range"
            min={0}
            max={lastIndex}
            value={stopIndex}
            onChange={(e) => {
              setPlaying(false);
              goToStopIndex(Number(e.target.value));
            }}
            aria-label="실행 타임라인"
            aria-valuetext={`${lastIndex}단계 중 ${stopIndex}단계`}
          />
        </div>
        <span className="step-count" aria-live="off">
          단계 {stopIndex} / {lastIndex}
        </span>
      </div>

      <div className="buttons">
        <button type="button" onClick={prev} disabled={stopIndex === 0}>
          <span aria-hidden="true">◀</span> Prev
        </button>
        <button type="button" className="primary" onClick={step} disabled={atEnd}>
          <span aria-hidden="true">▶</span> Step
        </button>
        {playing ? (
          <button type="button" onClick={() => setPlaying(false)}>
            <span aria-hidden="true">❚❚</span> Pause
          </button>
        ) : (
          <button type="button" onClick={() => setPlaying(true)} disabled={atEnd}>
            <span aria-hidden="true">▷</span> Auto
          </button>
        )}
        <button type="button" onClick={reset} disabled={stopIndex === 0}>
          <span aria-hidden="true">↺</span> Reset
        </button>
        <button
          type="button"
          onClick={runToBreakpoint}
          disabled={breakpoints.size === 0}
          title={
            breakpoints.size === 0
              ? "코드 왼쪽 여백을 눌러 중단점을 설정하세요"
              : "다음 중단점까지 실행"
          }
        >
          <span aria-hidden="true">⇥</span> 중단점까지
        </button>

        <span className="spacer" />

        <fieldset className="speed">
          <legend className="sr-only">재생 속도</legend>
          {SPEEDS.map((s: Speed) => (
            <button
              key={s}
              type="button"
              className={speed === s ? "is-on" : ""}
              onClick={() => setSpeed(s)}
              aria-pressed={speed === s}
            >
              {s}×
            </button>
          ))}
        </fieldset>

        <fieldset className="detail">
          <legend className="sr-only">상세도</legend>
          <button
            type="button"
            className={detail === "core" ? "is-on" : ""}
            onClick={() => setDetail("core")}
            aria-pressed={detail === "core"}
          >
            핵심 단계
          </button>
          <button
            type="button"
            className={detail === "expression" ? "is-on" : ""}
            onClick={() => setDetail("expression")}
            aria-pressed={detail === "expression"}
          >
            표현식 상세
          </button>
        </fieldset>
      </div>

      <p className="shortcuts">
        단축키 — <kbd>→</kbd>/<kbd>Space</kbd> 다음 단계 · <kbd>←</kbd> 이전 · <kbd>R</kbd> 초기화 ·{" "}
        <kbd>P</kbd> 자동 실행
      </p>
    </div>
  );
}
