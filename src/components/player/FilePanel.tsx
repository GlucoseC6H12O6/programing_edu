import type { FileState, ProgramState } from "../../engine/trace/types.ts";

/**
 * §P18 §10-1 "Disk File, File Object, Python Memory를 서로 다른 패널로 둔다".
 *
 * 메모리(STATE)와 같은 칸에 두면 `open()`만으로 파일 내용이 변수에 들어온다는
 * 오해가 그대로 굳는다. 디스크는 프로그램 바깥이고 실행이 끝나도 남는다.
 */

/** 눈에 보이지 않는 줄바꿈이 이 레슨의 핵심이라 기호로 드러낸다. */
function Content({ text, cursor }: { text: string; cursor?: number }) {
  if (text === "") return <span className="f-empty">(빈 파일)</span>;
  const at = cursor ?? -1;
  return (
    <>
      {[...text].map((ch, index) => (
        <span key={index} className={`f-ch ${index === at ? "is-cursor" : ""}`}>
          {ch === "\n" ? (
            <>
              <span className="f-nl">⏎</span>
              {"\n"}
            </>
          ) : (
            ch
          )}
        </span>
      ))}
      {/* 커서가 끝에 있으면 마지막 글자 뒤에 설 자리가 필요하다 */}
      {at >= text.length && <span className="f-ch is-cursor f-tail"> </span>}
    </>
  );
}

function FileCard({ file, step }: { file: FileState; step: number }) {
  const hot = file.updatedAtStep === step;
  return (
    <li className={`file-box ${hot ? "is-hot" : ""}`}>
      <div className="f-head">
        <span className="f-path">{file.path}</span>
        {file.open ? (
          <span className="f-open" title="열려 있는 통로입니다">
            {file.open.mode} 모드 · 커서 {file.open.cursor}
          </span>
        ) : (
          <span className="f-closed">닫힘</span>
        )}
        <span className="f-size">{file.content.length}자</span>
      </div>
      <pre className="f-body">
        <Content text={file.content} cursor={file.open?.cursor} />
      </pre>
    </li>
  );
}

export function FilePanel({ state }: { state: ProgramState }) {
  return (
    <section className="panel panel-files" aria-label="디스크의 파일">
      <header className="panel-head">
        <h2>FILES</h2>
        <span className="panel-sub">프로그램 바깥</span>
      </header>
      <ul className="files">
        {state.files.map((file) => (
          <FileCard key={file.path} file={file} step={state.step} />
        ))}
      </ul>
    </section>
  );
}
