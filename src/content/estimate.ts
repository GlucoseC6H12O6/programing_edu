/**
 * 레슨 하나에 걸리는 시간 (빌드 타임 계산).
 *
 * 사람이 meta.yaml에 적어 두지 않는다. 적어 둔 숫자는 원고가 자라도 그대로
 * 남아서, P01이 10분이고 P24가 25분이라고 말하게 된다 — P24는 산문만
 * 14,000자에 코드 154줄인 종합 실습이다. 원고가 단일 출처라는 규칙을
 * 시간에도 적용한다. 원고를 고치면 시간이 따라 바뀐다.
 *
 * 하나의 숫자로 뭉뚱그리지 않는 이유는 이 교재의 한 레슨이 세 가지 다른
 * 일이기 때문이다. 읽는 일, 한 단계씩 눌러 보는 일, 직접 고쳐 보는 일.
 * "40분"보다 "읽기 15 · 실행 10 · 연습 15"가 어디서 시간이 드는지 말해 준다.
 */

import type { TraceDocument } from "../engine/trace/types.ts";
import { TracePlayer } from "../engine/trace/player.ts";
import type { TextbookLesson } from "./textbook.ts";

export interface LessonTime {
  /** 본문을 읽는 시간 */
  read: number;
  /** 플레이어를 Step으로 따라가는 시간 */
  run: number;
  /** §14 직접 해보기 + §15 확인 문제 */
  practice: number;
  total: number;
}

/** 상수는 전부 여기. 하나를 바꾸면 47개 레슨이 같이 움직인다. */
/** 한국어 기술 산문을 "예측하며" 읽는 속도. 훑어 읽기(600~)보다 느리게 잡는다. */
const CHARS_PER_MINUTE = 400;
/** 코드 한 줄을 눈으로 따라가는 시간. 산문 한 줄보다 오래 걸린다. */
const SECONDS_PER_CODE_LINE = 9;
/** 한 번 누르고, 어느 패널이 바뀌었는지 찾고, 다시 누르기까지 */
const SECONDS_PER_STEP = 6;
/** 이보다 많은 단계는 규칙을 알아채고 건너뛴다. §16이 9×9에 대해 말하는 그것. */
const STEPS_COUNTED = 60;
/** §8 예측 문제와 §13 업무형 예제. 그 뒤의 변형(3×3·9×9)은 선택이다. */
const TRACES_COUNTED = 2;
/** 실행 전에 결과를 적어 보는 시간 */
const MINUTES_PREDICTING = 1;
/** §14 과제 하나 — 고치고, 돌리고, 예측과 맞는지 본다 */
const MINUTES_PER_TASK = 5;
/** §15 확인 문제 한 문항 */
const MINUTES_PER_QUIZ = 2;

const SECTION_PRACTICE = 14;
const SECTION_QUIZ = 15;

export function estimate(book: TextbookLesson, docs: TraceDocument[]): LessonTime {
  const prose = book.sections.reduce((n, s) => n + s.metrics.prose, 0);
  const codeLines = book.sections.reduce((n, s) => n + s.metrics.codeLines, 0);
  const read = Math.round(prose / CHARS_PER_MINUTE + (codeLines * SECONDS_PER_CODE_LINE) / 60);

  const steps = docs
    .slice(0, TRACES_COUNTED)
    .reduce((n, doc) => n + Math.min(new TracePlayer(doc).stops("core").length, STEPS_COUNTED), 0);
  const run = docs.length === 0 ? 0 : Math.round(MINUTES_PREDICTING + (steps * SECONDS_PER_STEP) / 60);

  // 절이 비어 있는 경우는 없지만(로더가 18개를 강제한다), 목록 없이 한 문단으로
  // 낸 과제도 과제 하나다.
  const tasks = Math.max(1, book.sections[SECTION_PRACTICE - 1]!.metrics.items);
  const quizzes = Math.max(1, book.sections[SECTION_QUIZ - 1]!.metrics.items);
  const practice = tasks * MINUTES_PER_TASK + quizzes * MINUTES_PER_QUIZ;

  return { read, run, practice, total: read + run + practice };
}
