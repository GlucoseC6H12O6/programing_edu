import { useCallback, useEffect, useState } from "react";

import type { TraceDocument } from "../../engine/trace/types.ts";

/**
 * 학습자가 고친 코드를 **그 자리에서** 다시 트레이스한다.
 *
 * 교재가 권하는 순서는 예측 → Step → 관찰 → **수정** → **재실행**이다(앞머리).
 * 앞의 셋은 커밋된 트레이스로 되지만 뒤의 둘은 실행이 필요하다. 그 실행기는
 * 이미 있다 — RunHere가 "커밋된 트레이스와 브라우저 실행이 같다"를 보이려고
 * 쓰는 `traceInBrowser`가 임의의 소스를 받는다. 여기서는 같은 함수에 학습자가
 * 고친 소스를 넣고, 돌아온 트레이스를 플레이어에 그대로 싣는다.
 *
 *   Python     Pyodide + tracer.py    (빌드의 CPython과 같은 파일)
 *   JavaScript Web Worker + tracer.ts (빌드의 Node와 같은 파일)
 *
 * 원본 트레이스는 건드리지 않는다. `restore()`가 언제든 되돌린다. 화면의
 * 해설(§9)은 원본 코드를 설명하므로, 편집본이 도는 동안에는 그 사실을
 * 코드 패널이 말한다.
 */
export interface EditApi {
  /** 지금 플레이어에 실린 트레이스가 고친 코드에서 나왔는가 */
  isEdited: boolean;
  status: "idle" | "running" | "failed";
  /** 진행 상황이나 실패 이유 */
  note: string;
  run: (source: string) => void;
  restore: () => void;
}

export function useEditableCode(golden: TraceDocument): {
  doc: TraceDocument;
  /** 트레이스가 바뀔 때마다 오른다. 뷰어를 새로 그리는 key로 쓴다. */
  version: number;
  api: EditApi;
} {
  const [doc, setDoc] = useState<TraceDocument | null>(null);
  const [version, setVersion] = useState(0);
  const [status, setStatus] = useState<EditApi["status"]>("idle");
  const [note, setNote] = useState("");

  // 예제(변형)를 바꾸면 편집본은 버린다. 다른 프로그램을 고친 결과를
  // 이어서 보여 줄 방법이 없다.
  useEffect(() => {
    setDoc(null);
    setStatus("idle");
    setNote("");
  }, [golden]);

  const run = useCallback(
    async (source: string) => {
      setStatus("running");
      setNote("준비 중…");
      try {
        // 실행기는 누를 때만 내려받는다. 레슨을 여는 것만으로는 받지 않는다.
        const { traceInBrowser } =
          golden.source.language === "javascript"
            ? await import("../../engine/javascript/runInBrowser.ts")
            : await import("../../engine/python/runInBrowser.ts");

        const next = await traceInBrowser(source, {
          lessonId: golden.lessonId,
          path: golden.source.path,
          // 같이 도는 파일과 실행 전 디스크는 원본 그대로 준다. P20·J19에서
          // 이것이 빠지면 import할 것이 없어 편집본만 오류로 끝난다.
          modules: Object.fromEntries(
            (golden.sources ?? []).map((file) => [
              file.path.replace(/\.(py|js)$/, ""),
              file.lines.join("\n"),
            ]),
          ),
          files: golden.initialFiles,
          onProgress: (progress: string) => setNote(progress),
        });

        setDoc(next);
        setVersion((n) => n + 1);
        setStatus("idle");
        setNote("");
      } catch (error) {
        // 문법 오류로 실패해도 편집 중인 글은 그대로 둔다. 고쳐서 다시 누르면 된다.
        setStatus("failed");
        setNote((error as Error).message);
      }
    },
    [golden],
  );

  const restore = useCallback(() => {
    setDoc(null);
    setVersion((n) => n + 1);
    setStatus("idle");
    setNote("");
  }, []);

  return {
    doc: doc ?? golden,
    version,
    api: { isEdited: doc !== null, status, note, run, restore },
  };
}
