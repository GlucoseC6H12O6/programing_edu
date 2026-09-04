/**
 * 트레이서를 돌리는 Web Worker.
 *
 * 굳이 워커를 쓰는 이유는 두 가지다.
 *  1. 학습자 코드가 무한 루프에 빠져도 페이지가 멈추지 않는다. 이벤트/시간
 *     상한이 먼저 걸리는 것이 보통이지만, 코드가 그 예외를 통째로 삼켜 버리면
 *     상한이 소용없다. 그때는 바깥에서 terminate()로 끊는다.
 *  2. DOM·window에 아예 닿을 수 없는 곳에서 돈다. `with(화이트리스트)` 스코프와
 *     겹쳐 §3.10의 실행 격리가 두 겹이 된다.
 */

import { traceSource } from "./tracer.ts";

interface Request {
  code: string;
  path?: string;
  lessonId?: string;
  /** 같이 도는 파일들. 이름 → 소스 (§J19) */
  modules?: Record<string, string>;
}

self.onmessage = (event: MessageEvent<Request>) => {
  const { code, path, lessonId, modules } = event.data;
  try {
    const files = Object.fromEntries(
      Object.entries(modules ?? {}).map(([name, source]) => [
        name,
        { path: `${name}.js`, code: source },
      ]),
    );
    self.postMessage({ ok: true, doc: traceSource(code, { path, lessonId, modules: files }) });
  } catch (error) {
    self.postMessage({ ok: false, message: (error as Error).message });
  }
};
