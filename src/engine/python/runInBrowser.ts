/**
 * 브라우저에서 Python을 직접 실행한다 (§11 연습·샌드박스 모드의 토대).
 *
 * 핵심은 **같은 tracer.py**를 쓴다는 것이다. 빌드 타임에 CPython이 만든 골든
 * 트레이스와 여기서 Pyodide가 만든 트레이스는 같아야 하고, 실제로 같은지를
 * 화면에서 확인할 수 있다. 두 경로가 갈라지면 "미리 만든 설명"과 "직접 실행한
 * 결과"가 다른 말을 하게 되는데, 그건 교육용으로는 치명적이다.
 *
 * Pyodide는 수 MB이므로 **누를 때만** 내려받는다. 레슨을 여는 것만으로는
 * 아무것도 받지 않는다.
 */

import type { TraceDocument } from "../trace/types.ts";

const PYODIDE_VERSION = "0.28.3";
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type Pyodide = {
  runPython: (code: string, options?: { globals?: unknown }) => unknown;
  globals: { get: (name: string) => (() => unknown) };
};

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<Pyodide>;
  }
}

let runtime: Promise<Pyodide> | null = null;

export type Progress = (message: string) => void;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error(`${src} 로드 실패`)));
      if (window.loadPyodide) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`${src} 로드 실패`));
    document.head.append(script);
  });
}

async function getRuntime(onProgress?: Progress): Promise<Pyodide> {
  if (!runtime) {
    runtime = (async () => {
      onProgress?.("Python 런타임을 내려받는 중…");
      await loadScript(`${INDEX_URL}pyodide.js`);
      if (!window.loadPyodide) throw new Error("Pyodide를 불러오지 못했습니다.");
      const py = await window.loadPyodide({ indexURL: INDEX_URL });
      onProgress?.("런타임 준비 완료");
      return py;
    })();
    runtime.catch(() => {
      runtime = null; // 실패하면 다음 시도에 다시 받을 수 있게 한다
    });
  }
  return runtime;
}

export interface RunOptions {
  lessonId?: string;
  path?: string;
  onProgress?: Progress;
  /** 같이 도는 다른 파일들. `{ config: "<소스>" }` (§P20) */
  modules?: Record<string, string>;
  /** 실행 전 디스크에 있던 파일들 (§P18) */
  files?: Record<string, string>;
}

export async function traceInBrowser(
  code: string,
  { lessonId = "sandbox", path = "main.py", onProgress, modules, files }: RunOptions = {},
): Promise<TraceDocument> {
  const py = await getRuntime(onProgress);

  onProgress?.("트레이서를 적재하는 중…");
  // 빌드 타임 생성기와 **완전히 같은 파일**을 그대로 읽어 온다.
  const { default: tracerSource } = await import("./tracer.py?raw");

  const namespace = py.globals.get("dict")() as {
    set: (key: string, value: unknown) => void;
    get: (key: string) => unknown;
    destroy: () => void;
  };
  try {
    // tracer.py 끝의 CLI 블록이 돌지 않도록 __main__이 아닌 이름을 준다.
    namespace.set("__name__", "tracer");
    py.runPython(tracerSource, { globals: namespace });

    onProgress?.("실행 중…");
    namespace.set("__source__", code);
    namespace.set("__path__", path);
    namespace.set("__lesson__", lessonId);
    // 같이 도는 파일과 디스크 내용까지 넘겨야 빌드 경로와 같은 입력이 된다.
    // JSON으로 넘기는 이유는 Pyodide의 dict 프록시 수명을 여기서 관리하지
    // 않아도 되기 때문이다.
    namespace.set("__modules__", JSON.stringify(modules ?? {}));
    namespace.set("__files__", JSON.stringify(files ?? {}));
    py.runPython(
      "import json as __json__\n" +
        "__result__ = trace_source(__source__, path=__path__, lesson_id=__lesson__," +
        " modules=__json__.loads(__modules__), files=__json__.loads(__files__))",
      { globals: namespace },
    );

    const proxy = namespace.get("__result__") as {
      toJs: (options: { dict_converter: (entries: Iterable<[string, unknown]>) => unknown }) => TraceDocument;
      destroy: () => void;
    };
    try {
      return proxy.toJs({ dict_converter: Object.fromEntries });
    } finally {
      proxy.destroy();
    }
  } finally {
    namespace.destroy();
  }
}
