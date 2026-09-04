/**
 * Node → Python 트레이서 다리.
 *
 * 브라우저에서는 같은 `tracer.py`를 Pyodide가 읽는다. 빌드 타임에 굳이
 * Pyodide를 띄우지 않는 이유는 단순하다. tracer.py는 표준 라이브러리만 쓰므로
 * CPython과 Pyodide(같은 CPython)가 같은 결과를 낸다. 대신 브라우저에서 만든
 * 트레이스가 커밋된 골든과 같은지는 실제 브라우저에서 확인한다.
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { TraceDocument } from "../../src/engine/trace/types.ts";

export const TRACER_PATH = join(import.meta.dirname, "..", "..", "src", "engine", "python", "tracer.py");

export interface TraceRequest {
  sourcePath: string;
  lessonId: string;
  /** 화면에 보여 줄 파일 이름. 트레이스의 source.path가 된다. */
  displayPath?: string;
  /** 실행 전 디스크에 있던 파일들. §P18 §9의 "Before" 상태다. */
  files?: Record<string, string>;
  /** 같이 도는 다른 파일들. `{ config: "/…/code/config.py" }` (§P20) */
  modules?: Record<string, string>;
}

export function tracePython({
  sourcePath,
  lessonId,
  displayPath,
  files,
  modules,
}: TraceRequest): TraceDocument {
  const python = process.env.PYTHON ?? "python3";
  const seed = files && Object.keys(files).length > 0 ? writeSeed(files) : null;
  const map = modules && Object.keys(modules).length > 0 ? writeSeed(modules) : null;
  const run = spawnSync(
    python,
    [TRACER_PATH, sourcePath, lessonId, seed?.file ?? "", ...(map ? [map.file] : [])],
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  );
  seed?.cleanup();
  map?.cleanup();

  if (run.error) {
    throw new Error(
      `${python}을 실행할 수 없습니다: ${run.error.message}\n` +
        "PYTHON 환경 변수로 인터프리터 경로를 지정할 수 있습니다.",
    );
  }
  if (run.status !== 0) {
    throw new Error(`트레이서가 실패했습니다 (exit ${run.status})\n${run.stderr}`);
  }

  const doc = JSON.parse(run.stdout) as TraceDocument;
  if (displayPath) doc.source.path = displayPath;
  return doc;
}

export function pythonVersion(): string {
  const python = process.env.PYTHON ?? "python3";
  const run = spawnSync(python, ["--version"], { encoding: "utf8" });
  return (run.stdout || run.stderr || "").trim();
}

/**
 * 계측 없이 그대로 실행했을 때의 stdout.
 *
 * 트레이스의 `meta.stdout`과 이것이 다르면 계측이 프로그램의 의미를 바꾼 것이다.
 * 시각화가 아무리 그럴듯해도 실제 실행과 다른 것을 가르치면 소용이 없으므로
 * 빌드에서 매번 대조한다.
 */
export function runPlain(
  sourcePath: string,
  files?: Record<string, string>,
): { stdout: string; failed: boolean } {
  const python = process.env.PYTHON ?? "python3";
  // 계측 없는 실행은 진짜 open()을 쓴다. 저장소 안에서 돌리면 레슨 코드가
  // 작업 폴더에 파일을 남기므로, 빈 임시 폴더를 만들어 그 안에서 실행한다.
  const dir = mkdtempSync(join(tmpdir(), "trace-plain-"));
  try {
    for (const [name, body] of Object.entries(files ?? {})) writeFileSync(join(dir, name), body);
    const run = spawnSync(python, [sourcePath], {
      cwd: dir,
      // import는 스크립트가 있는 폴더에서 찾으므로 모듈 파일을 따로 옮기지
      // 않아도 된다. 대신 저장소에 __pycache__를 남기지 않게 막는다.
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
    return { stdout: run.stdout ?? "", failed: run.status !== 0 };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function writeSeed(files: Record<string, string>): { file: string; cleanup: () => void } {
  // 트레이서에 넘길 작은 JSON 하나. 인수로 밀어 넣으면 따옴표 때문에 깨진다.
  const dir = mkdtempSync(join(tmpdir(), "trace-seed-"));
  const file = join(dir, "files.json");
  writeFileSync(file, JSON.stringify(files));
  return { file, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}
