/**
 * 골든 트레이스 생성/검증.
 *
 *   node --experimental-strip-types scripts/emit-traces.ts          # 생성
 *   node --experimental-strip-types scripts/emit-traces.ts --check  # 검증
 *
 * 각 레슨 폴더의 meta.yaml에서 `traces` 목록을 읽어, 각 항목의 `source`를
 * Python 트레이서로 실행하고 결과를 골든 JSON으로 남긴다.
 *
 * 생성된 트레이스를 저장소에 커밋하는 이유:
 *  1. 레슨 진입 시 실행기(Pyodide) 다운로드 없이 즉시 단계 실행이 가능하다.
 *  2. `--check`를 CI에 걸면 "모든 Step 이벤트와 설명 문구가 코드 실행 결과와
 *     일치한다"(§13.3)가 사람 검수가 아니라 자동 검사가 된다.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { load as parseYaml } from "js-yaml";

import { buildMulDemo } from "../src/engine/fixtures/mulDemo.ts";
import { applyEvent, initialState } from "../src/engine/trace/reducer.ts";
import { TracePlayer } from "../src/engine/trace/player.ts";
import { narrate } from "../src/engine/trace/narrate.ts";
import { diffEvents } from "../src/engine/trace/compare.ts";
import type { TraceDocument } from "../src/engine/trace/types.ts";
import { pythonVersion, runPlain as runPlainPython, tracePython } from "./lib/tracePython.ts";
import { nodeVersion, runPlain as runPlainNode, traceJavaScript } from "./lib/traceJavaScript.ts";

const LESSONS_DIR = join(import.meta.dirname, "..", "content", "lessons");

interface TraceSpec {
  id: string;
  file: string;
  source: string;
  /** 실행 전 디스크에 있던 파일들 (§P18 §9의 Before 상태) */
  files?: Record<string, string>;
  /** 같이 도는 다른 파일들. `{ config: code/config.py }` (§P20) */
  modules?: Record<string, string>;
}

interface LessonMeta {
  id: string;
  title: string;
  traces?: TraceSpec[];
}

/**
 * 레슨별 설명 문구 오버레이.
 *
 * 트레이서는 이벤트만 만든다. 문구는 narrate.ts가 기계적으로 생성하지만,
 * 대표 레슨은 §9.3에 맞춰 손으로 다듬은 문장을 얹는다. 오버레이는 트레이서
 * 결과와 **구조가 완전히 같을 때만** 적용되므로, 코드나 트레이서가 바뀌어
 * 단계가 어긋나면 조용히 엉뚱한 줄에 붙지 않고 빌드가 실패한다.
 *
 * P11의 오버레이(mulDemo 픽스처)는 동시에 기획서 §16 단계표의 명세이기도 하다.
 */
const OVERLAYS: Record<string, () => TraceDocument> = {
  "p11-nested-loops:mul3": () => buildMulDemo(3),
  "p11-nested-loops:mul9": () => buildMulDemo(9),
};

/** 오버레이의 message를 트레이서 이벤트에 얹는다. 구조가 다르면 실패한다. */
function applyOverlay(doc: TraceDocument, spec: TraceDocument): string[] {
  const diff = diffEvents(doc, spec);
  if (diff) {
    return [
      `오버레이가 어긋납니다 (step ${diff.step})`,
      `  트레이서: ${diff.left.slice(0, 200)}`,
      `  명세    : ${diff.right.slice(0, 200)}`,
    ];
  }
  doc.events.forEach((event, i) => {
    const message = spec.events[i]!.message;
    if (message) event.message = message;
  });
  return [];
}

/** 소스 확장자가 어느 트레이서를 쓸지 정한다. */
function traceOf(
  sourcePath: string,
  lessonId: string,
  displayPath?: string,
  files?: Record<string, string>,
  modules?: Record<string, string>,
): TraceDocument {
  const request = { sourcePath, lessonId, displayPath, files, modules };
  return sourcePath.endsWith(".js") ? traceJavaScript(request) : tracePython(request);
}

/**
 * 계측 실행과 그냥 실행의 stdout이 같은지 확인한다.
 *
 * 계측이 프로그램의 의미를 바꾸면 화면의 모든 설명이 거짓이 된다. 가장 싸고
 * 가장 확실한 방어선이라 매 빌드에서 돌린다.
 */
function checkSemantics(
  doc: TraceDocument,
  sourcePath: string,
  files?: Record<string, string>,
): string[] {
  const plain = sourcePath.endsWith(".js")
    ? runPlainNode(sourcePath)
    : runPlainPython(sourcePath, files);
  if (plain.failed) return []; // 오류로 끝나는 예제는 stdout 비교 대상이 아니다
  const traced = doc.meta.stdout ?? "";
  if (traced === plain.stdout) return [];
  return [
    "계측 실행과 일반 실행의 출력이 다릅니다 (계측이 의미를 바꿨습니다)",
    `  계측: ${JSON.stringify(traced).slice(0, 160)}`,
    `  일반: ${JSON.stringify(plain.stdout).slice(0, 160)}`,
  ];
}

/** 트레이스가 자기 자신과 모순되지 않는지 확인한다. */
function selfCheck(doc: TraceDocument): string[] {
  const problems: string[] = [];
  const player = new TracePlayer(doc);

  // 줄 번호는 그 이벤트가 속한 **파일**의 범위 안이어야 한다. main만 보고
  // 검사하면 §P20처럼 여러 파일이 도는 트레이스에서 멀쩡한 줄이 걸린다.
  const lineCount = new Map<string, number>([[doc.source.path, doc.source.lines.length]]);
  for (const extra of doc.sources ?? []) lineCount.set(extra.path, extra.lines.length);

  doc.events.forEach((event, index) => {
    if (event.step !== index + 1) problems.push(`step 번호 불일치: index ${index} → step ${event.step}`);
    const where = event.source ?? doc.source.path;
    const limit = lineCount.get(where);
    if (limit === undefined) problems.push(`step ${event.step}: 모르는 파일 ${where}`);
    else if (event.line < 1 || event.line > limit)
      problems.push(`step ${event.step}: ${where}의 범위를 벗어난 줄 번호 ${event.line}`);
  });

  // 모든 스톱에서 설명 문구가 만들어지는지 (§9.3)
  for (const cursor of player.stops("expression")) {
    if (cursor === 0) continue;
    const event = player.eventAt(cursor)!;
    const text = narrate(event, player.stateAt(cursor));
    // 물음표나 두 칸 띄어쓰기는 "값을 못 찾아 자리가 비었다"는 뜻이다. 이런
    // 문구가 화면에 나가느니 빌드가 서는 편이 낫다. 다만 따옴표와 백틱 안은
    // 값이나 코드의 내용이라 검사하지 않는다. `'  eq-01  '`처럼 공백이나
    // 물음표를 품은 문자열이 정상적으로 등장한다.
    const skeleton = text
      .replace(/'[^']*'/g, "'#'")
      .replace(/"[^"]*"/g, '"#"')
      .replace(/`[^`]*`/g, "`#`");
    // `undefined`는 Python에서는 "자리가 비었다"는 신호지만 JavaScript에서는
    // 값 그 자체다. 언어마다 뜻이 달라 같은 규칙을 쓸 수 없다.
    const emptySlot = doc.source.language === "python" && skeleton.includes("undefined");
    if (!text || emptySlot || skeleton.includes("?") || skeleton.includes("  "))
      problems.push(`step ${event.step} (${event.type}): 설명 문구 이상 — "${text}"`);
  }

  // keyframe 캐시 정확성.
  // 임의 지점으로 점프한 결과가 처음부터 순서대로 접은 결과와 달라지면
  // 타임라인·Prev·중단점이 전부 조용히 틀린 상태를 보여주게 된다.
  const sampleCount = Math.min(40, doc.events.length);
  const random = new TracePlayer(doc);
  const cursors = Array.from({ length: sampleCount }, (_, n) =>
    Math.round((n / Math.max(sampleCount - 1, 1)) * doc.events.length),
  );
  for (const cursor of [...cursors].sort(() => Math.random() - 0.5)) {
    let reference = initialState(doc);
    for (let i = 0; i < cursor; i += 1)
      reference = applyEvent(reference, doc.events[i]!, doc.source.path);
    if (JSON.stringify(random.stateAt(cursor)) !== JSON.stringify(reference))
      problems.push(`cursor ${cursor}: keyframe 점프 결과가 순차 재생과 다릅니다`);
  }

  const end = player.stateAt(player.maxCursor);
  const last = doc.events[doc.events.length - 1];
  if (last?.type !== "PROGRAM_END") problems.push("마지막 이벤트가 PROGRAM_END가 아닙니다");

  // 프레임 수지: 정상 종료라면 모든 FUNCTION_ENTER가 FRAME_POP으로 닫혀야 한다.
  // 오류로 끝난 트레이스는 오류가 난 지점의 스택이 남아 있는 편이 맞다 (§3.9).
  if (end.status === "done" && end.frames.length !== 1)
    problems.push(`실행 종료 시 프레임이 ${end.frames.length}개 남았습니다 (global만 남아야 함)`);

  // 참조가 가리키는 힙 객체가 실제로 있는지 (HEAP_ALLOC 누락 탐지)
  for (const frame of end.frames) {
    for (const binding of frame.bindings) {
      if (binding.value.kind === "ref" && !end.heap[binding.value.id])
        problems.push(`종료 시점에 \`${binding.name}\`이 없는 힙 객체 ${binding.value.id}를 가리킵니다`);
    }
  }

  return problems;
}

function loadLessons(): { dir: string; meta: LessonMeta }[] {
  return readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = join(LESSONS_DIR, entry.name);
      const meta = parseYaml(readFileSync(join(dir, "meta.yaml"), "utf8")) as LessonMeta;
      return { dir, meta };
    })
    .filter((lesson) => (lesson.meta.traces ?? []).length > 0);
}

// ── 실행 ─────────────────────────────────────────────────────

const check = process.argv.includes("--check");
let failed = false;

console.log(`트레이서: ${pythonVersion()} · ${nodeVersion()}`);

for (const { dir, meta } of loadLessons()) {
  for (const spec of meta.traces ?? []) {
    const label = `${meta.id}/${spec.file}`;
    let doc: TraceDocument;
    try {
      const modules = Object.fromEntries(
        Object.entries(spec.modules ?? {}).map(([name, file]) => [name, join(dir, file)]),
      );
      doc = traceOf(join(dir, spec.source), meta.id, spec.source.split("/").pop(), spec.files, modules);
    } catch (error) {
      failed = true;
      console.error(`✗ ${label}: ${(error as Error).message}`);
      continue;
    }

    const overlay = OVERLAYS[`${meta.id}:${spec.id}`];
    const problems = overlay ? applyOverlay(doc, overlay()) : [];
    if (problems.length === 0) {
      problems.push(...checkSemantics(doc, join(dir, spec.source), spec.files));
      problems.push(...selfCheck(doc));
    }

    if (problems.length > 0) {
      failed = true;
      console.error(`✗ ${label}: 검증 실패`);
      for (const problem of problems.slice(0, 10)) console.error(`    ${problem}`);
      continue;
    }

    const path = join(dir, spec.file);
    const json = `${JSON.stringify(doc, null, 2)}\n`;

    if (check) {
      if (!existsSync(path)) {
        failed = true;
        console.error(`✗ ${label}: 파일이 없습니다. 먼저 생성하세요.`);
      } else if (readFileSync(path, "utf8") !== json) {
        failed = true;
        console.error(`✗ ${label}: 커밋된 트레이스가 현재 실행 결과와 다릅니다.`);
      } else {
        console.log(`✓ ${label} (${doc.events.length} events)`);
      }
    } else {
      writeFileSync(path, json);
      console.log(`✓ ${label} 작성 (${doc.events.length} events)`);
    }
  }
}

process.exit(failed ? 1 : 0);
