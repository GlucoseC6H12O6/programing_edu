import { useState } from "react";

import type { TraceDocument } from "../engine/trace/types.ts";
import { RunHere } from "./player/RunHere.tsx";
import { TraceViewer } from "./player/TraceViewer.tsx";
import { useEditableCode } from "./player/useEditableCode.ts";

export interface Variant {
  id: string;
  label: string;
  doc: TraceDocument;
  gridSize?: number;
}

interface Props {
  variants: Variant[];
  /** 변형 선택 줄에 붙일 설명. 예: "반복 크기" */
  switchLabel?: string;
}

/**
 * 레슨 하나의 단계 실행 화면.
 *
 * §16: "먼저 3×3으로 개념을 익히고, 이후 9×9로 확장한다." 9×9는 호출이 81회라
 * 전 단계를 클릭하게 하지 않는다는 것이 요점이므로, 변형 전환은 타임라인·
 * 중단점·상세도 전환이 실제로 필요해지는 시험대이기도 하다.
 */
export function LessonPlayer({ variants, switchLabel = "예제" }: Props) {
  const [active, setActive] = useState(0);
  const variant = variants[active]!;

  // 고친 코드가 있으면 그쪽 트레이스가 실린다. version이 오르면 뷰어를 새로
  // 그린다 — 커서와 중단점은 다른 프로그램에서 그대로 이어질 수 없다.
  const { doc, version, api: edit } = useEditableCode(variant.doc);

  return (
    <>
      {variants.length > 1 && (
        <div className="demo-switch">
          <span>{switchLabel}</span>
          {variants.map((v, index) => (
            <button
              key={v.id}
              type="button"
              className={index === active ? "is-on" : ""}
              onClick={() => setActive(index)}
              aria-pressed={index === active}
            >
              {v.label}
            </button>
          ))}
          <span className="demo-meta">{doc.events.length}개 이벤트</span>
        </div>
      )}
      <TraceViewer
        key={`${variant.id}-${version}`}
        doc={doc}
        gridSize={variant.gridSize}
        edit={edit}
      />
      {/* 원본이 커밋된 트레이스와 같은지 확인하는 자리. 편집본과는 다른 일이다. */}
      <RunHere golden={variant.doc} />
    </>
  );
}
