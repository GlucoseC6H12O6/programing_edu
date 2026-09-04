/**
 * 레슨 로더 (빌드 타임 전용).
 *
 * 레슨 하나는 두 곳에서 온다.
 *   - `meta.yaml`  — 기계가 쓰는 사실(단계, 선행 레슨, 예제 파일, 트레이스 목록)
 *   - 교재(`content/<트랙>-visible-textbook-*.md`) — 사람이 읽는 본문 전부
 *
 * 본문을 meta.yaml에 요약해 두지 않는 이유: 같은 내용이 두 군데 있으면 반드시
 * 어긋난다. 교재가 단일 출처이고 meta.yaml은 교재를 가리키기만 한다.
 *
 * **서버에서만** 불린다. 브라우저는 실행기를 내려받지 않고, 이미 만들어진
 * 이벤트 배열을 props로 받아 커서만 움직인다.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { load as parseYaml } from "js-yaml";

import type { TraceDocument } from "../engine/trace/types.ts";
import { estimate, type LessonTime } from "./estimate.ts";
import { loadTextbook, textbookKey, type TextbookLesson } from "./textbook.ts";

const LESSONS_DIR = join(process.cwd(), "content", "lessons");

export interface LessonTrace {
  id: string;
  file: string;
  source: string;
  /** §3.9 레슨 플러그인 설정. P11의 (i, k) 방문 격자 크기. */
  gridSize?: number;
  doc: TraceDocument;
}

interface LessonMeta {
  id: string;
  track: "python" | "javascript";
  stage: string;
  prerequisites?: string[];
  code: string;
  traces?: Omit<LessonTrace, "doc">[];
  /** 교재가 없는 트랙만 쓰는 옛 방식의 본문 */
  title?: string;
  objectives?: string[];
  confusions?: string[];
  concept?: string;
  summary?: string[];
}

export interface Lesson {
  id: string;
  track: "python" | "javascript";
  stage: string;
  title: string;
  /** 원고 분량과 트레이스 길이에서 계산한다. estimate.ts 참고. */
  time?: LessonTime;
  prerequisites: string[];
  code: string;
  /** `code`가 가리키는 파일의 내용. 트레이스가 아직 없는 레슨도 문법은 보여야 한다. */
  codeText: string;
  traces: LessonTrace[];
  /** 교재 본문. 두 트랙 모두 언제나 있다. */
  textbook?: TextbookLesson;
  /** 교재가 없는 레슨의 본문 */
  objectives: string[];
  confusions: string[];
  concept?: string;
  summary?: string[];
}

export function loadLessons(): Lesson[] {
  const textbook = loadTextbook();

  return readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = join(LESSONS_DIR, entry.name);
      const meta = parseYaml(readFileSync(join(dir, "meta.yaml"), "utf8")) as LessonMeta;
      // 두 트랙 모두 교재가 단일 출처다. 교재에 없는 레슨만 meta.yaml의
      // 옛 방식(본문을 직접 적는)을 쓴다.
      const chapter = textbook.get(textbookKey(meta.id));

      const title = chapter?.title ?? meta.title;
      if (!title) throw new Error(`${meta.id}: 제목이 없습니다 (교재에도, meta.yaml에도)`);

      const traces = (meta.traces ?? []).map((trace) => ({
        ...trace,
        doc: JSON.parse(readFileSync(join(dir, trace.file), "utf8")) as TraceDocument,
      }));

      return {
        ...meta,
        title,
        textbook: chapter,
        time: chapter ? estimate(chapter, traces.map((t) => t.doc)) : undefined,
        codeText: readFileSync(join(dir, meta.code), "utf8").replace(/\n$/, ""),
        prerequisites: meta.prerequisites ?? [],
        objectives: meta.objectives ?? [],
        confusions: meta.confusions ?? [],
        traces,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}
