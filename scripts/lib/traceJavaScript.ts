/**
 * Node → JavaScript 트레이서 다리.
 *
 * Python 쪽과 달리 하위 프로세스가 필요 없다. 트레이서 자체가 TypeScript이므로
 * 빌드 스크립트가 그대로 불러 쓰고, 브라우저는 같은 모듈을 Web Worker에서 쓴다.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { traceSource } from "../../src/engine/javascript/tracer.ts";
import type { TraceDocument } from "../../src/engine/trace/types.ts";

export interface TraceRequest {
  sourcePath: string;
  lessonId: string;
  /** 화면에 보여 줄 파일 이름. 트레이스의 source.path가 된다. */
  displayPath?: string;
  /** 같이 도는 파일들. `{ measurement_utils: <경로> }` (§J19) */
  modules?: Record<string, string>;
}

export function traceJavaScript({
  sourcePath, lessonId, displayPath, modules,
}: TraceRequest): TraceDocument {
  const code = readFileSync(sourcePath, "utf8");
  return traceSource(code, {
    path: displayPath ?? sourcePath.split("/").pop() ?? "main.js",
    lessonId,
    modules: Object.fromEntries(
      Object.entries(modules ?? {}).map(([name, file]) => [
        name,
        { path: file.split("/").pop() ?? `${name}.js`, code: readFileSync(file, "utf8") },
      ]),
    ),
  });
}

export function nodeVersion(): string {
  return `Node ${process.version}`;
}

/**
 * 계측 없이 **진짜 node로** 그대로 실행했을 때의 stdout.
 *
 * 트레이스의 `meta.stdout`과 이것이 다르면 둘 중 하나다. 계측이 프로그램의
 * 의미를 바꿨거나, 트레이서의 출력 표기가 실제 console.log와 다르거나.
 * 어느 쪽이든 화면의 설명이 거짓이 되므로 매 빌드에서 대조한다.
 */
export function runPlain(sourcePath: string): { stdout: string; failed: boolean } {
  const run = spawnSync(process.execPath, [sourcePath], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  return { stdout: run.stdout ?? "", failed: run.status !== 0 };
}
