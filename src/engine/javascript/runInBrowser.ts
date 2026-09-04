/**
 * 브라우저에서 JavaScript를 직접 실행한다.
 *
 * Python 쪽(Pyodide)과 같은 주장을 같은 방식으로 성립시킨다. 빌드 타임에
 * Node가 만든 골든 트레이스와 여기서 워커가 만든 트레이스는 **같은 tracer.ts**의
 * 결과이므로 갈라질 수 없고, 갈라지지 않았다는 것을 화면에서 확인할 수 있다.
 *
 * 다른 점 하나: 내려받을 런타임이 없다. 실행기가 이미 브라우저 안에 있다.
 */

import type { TraceDocument } from "../trace/types.ts";

export type Progress = (message: string) => void;

export interface RunOptions {
  lessonId?: string;
  path?: string;
  onProgress?: Progress;
  /** 같이 도는 파일들. `{ measurement_utils: "<소스>" }` (§J19) */
  modules?: Record<string, string>;
  /** Python 쪽과 인터페이스를 맞추기 위한 자리. JavaScript에는 파일이 없다. */
  files?: Record<string, string>;
  /** 상한을 삼켜 버리는 코드까지 끊어 내는 마지막 방어선 */
  timeoutMs?: number;
}

export function traceInBrowser(
  code: string,
  {
    lessonId = "sandbox",
    path = "main.js",
    onProgress,
    modules,
    timeoutMs = 10000,
  }: RunOptions = {},
): Promise<TraceDocument> {
  onProgress?.("워커를 시작하는 중…");
  const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

  return new Promise<TraceDocument>((resolve, reject) => {
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error(`${timeoutMs / 1000}초 안에 끝나지 않아 중단했습니다.`));
    }, timeoutMs);

    const finish = (action: () => void) => {
      clearTimeout(timer);
      worker.terminate();
      action();
    };

    worker.onmessage = (event: MessageEvent<{ ok: boolean; doc?: TraceDocument; message?: string }>) => {
      const data = event.data;
      finish(() =>
        data.ok && data.doc ? resolve(data.doc) : reject(new Error(data.message ?? "실행 실패")),
      );
    };
    worker.onerror = (event) => finish(() => reject(new Error(event.message || "워커 오류")));

    onProgress?.("실행 중…");
    worker.postMessage({ code, path, lessonId, modules });
  });
}
