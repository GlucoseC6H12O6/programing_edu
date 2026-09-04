/**
 * `보이는 교과서` 로더 (빌드 타임 전용).
 *
 * 레슨 원고는 트랙마다 한 파일이다. 파일을 쪼개지 않는 이유: 원고를 쓰고
 * 고치는 사람은 레슨 스무 개를 이어서 읽고 고친다. 사이트가 읽기 편하자고
 * 레슨마다 폴더로 흩어 놓으면 원고 쪽이 불편해진다. 대신 여기서 기계가
 * 읽는다. 구조가 규칙적이라(레슨마다 `## 1.`~`## 18.`) 파싱이 추측에
 * 기대지 않는다.
 *
 * 두 트랙은 **같은 18개 절**을 쓴다. 같은 자리에 같은 종류의 내용이 있어야
 * P09와 J08을 나란히 놓고 "여기서 두 언어가 갈린다"고 말할 수 있다.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { Marked } from "marked";

import { highlightHtml, type Language } from "../engine/highlight.ts";

/** 트랙마다 원고 한 파일. 접두사(P/J)가 레슨 키의 앞글자가 된다. */
export const TEXTBOOKS = [
  { language: "python" as const, file: "python-visible-textbook-p01-p24.md", prefix: "P" },
  { language: "javascript" as const, file: "javascript-visible-textbook-j01-j23.md", prefix: "J" },
];

/** 레슨마다 반드시 있어야 하는 절. 하나라도 빠지면 빌드를 세운다. */
export const SECTION_TITLES = [
  "레슨 한 줄 질문",
  "왜 필요한가 / 현실 상황",
  "학습 목표",
  "핵심 용어",
  "Mental Model",
  "핵심 문법 상세 해설",
  "컴퓨터처럼 코드 읽기",
  "실행 전 예측 문제",
  "단계 실행 Walkthrough",
  "Visual Script",
  "왜 이렇게 동작하는가",
  "자주 하는 오해/실수",
  "업무형/엔지니어형 예제",
  "직접 해보기",
  "확인 문제",
  "정답 및 해설",
  "핵심 요약",
  "다음 레슨 연결",
];

export interface TextbookSection {
  /** 1~18 */
  n: number;
  title: string;
  /** 렌더링된 HTML */
  html: string;
  /** 이 절에 들어 있는 python 코드 블록 원문 */
  code: string[];
  /** 예상 시간을 계산하는 재료. estimate.ts가 쓴다. */
  metrics: SectionMetrics;
}

/**
 * 절 하나의 분량. 예상 시간을 사람이 적어 두지 않고 여기서 세는 이유는
 * meta.yaml 머리에 적힌 것과 같다 — 같은 사실이 두 군데 있으면 어긋난다.
 * 원고를 고치면 시간도 따라 바뀐다.
 */
export interface SectionMetrics {
  /** 코드·그림을 뺀 산문의 글자 수 */
  prose: number;
  /** 코드 블록의 줄 수 (그림·결과 블록은 제외) */
  codeLines: number;
  /** 목록 항목 수. §14·§15에서 "해 볼 것"의 개수가 된다. */
  items: number;
}

export interface TextbookLesson {
  /** "P01" · "J01" */
  key: string;
  title: string;
  language: "python" | "javascript";
  sections: TextbookSection[];
}

/**
 * 교재 앞머리 — 첫 레슨(`# P01.`) 이전의 글.
 *
 * 목적, 권장 사용법(예측 → Step → 관찰 → 수정 → 재실행), 사이트 공통 시각
 * 언어, 전체 학습 지도가 전부 여기 있다. 레슨 파서는 `# P01.`에서부터 자르기
 * 때문에 이 글이 통째로 버려졌다. 정작 처음 온 사람이 **가장 먼저** 읽어야
 * 할 글이고, 특히 시각 언어 표는 플레이어의 색과 표시를 읽는 법이라
 * 이것을 안 읽으면 화면의 절반이 장식으로 보인다.
 */
export interface TextbookIntro {
  language: "python" | "javascript";
  /** "보이는 Python 교과서" */
  title: string;
  /** 표지의 한 줄 소개 (강조가 들어 있어 HTML이다) */
  tagline: string;
  sections: { n: number; title: string; html: string }[];
}

/**
 * 교재에는 세 가지 블록이 있고 셋은 서로 달라 보여야 한다.
 *
 *  - ```python — 사람이 쓴 코드. 이 교재의 첫 주제가 "코드와 실행 결과는
 *    다른 것"이라 코드 쪽을 확실히 코드처럼 보이게 한다.
 *  - ```text  — 실행 결과나 상태 메모.
 *  - ```text 중 선 문자가 든 것 — 그림이다. 원고 156개 중 74개가 여기 속한다.
 *    `결과`라는 이름표를 붙이면 "이게 프로그램이 뱉은 것"이라고 거짓말을 한다.
 *    그림은 줄 간격을 좁혀야 `│`와 `─`가 실제로 이어져 상자로 보인다.
 */
const DIAGRAM_GLYPHS = /[\u2500-\u257f\u2190-\u21ff\u25b2\u25b6\u25bc\u25c0]/;

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
const escapeHtml = (text: string) => text.replace(/[&<>]/g, (ch) => ESCAPES[ch]!);

/**
 * 그림과 결과 블록의 한글을 정확히 두 칸으로 고정한다.
 *
 * 원고는 터미널에서 쓰였다. 터미널에서 한글은 라틴 문자 두 칸을 차지하므로
 * 글쓴이는 `조건 검사`가 8칸이라고 세고 선을 그었다. 브라우저는 그렇지 않다.
 * 고정폭 글꼴에 한글이 없으면 한글만 대체 글꼴로 떨어지고, 그 폭은 두 칸이
 * 아니다. 그래서 화살표와 상자가 전부 어긋난다.
 *
 * 한글 폰트를 지정해 맞추는 방법은 그 폰트가 깔린 기계에서만 통한다.
 * 글자마다 `width: 2ch`를 주면 어느 기계에서든 어긋날 수가 없다.
 */
const WIDE = /[\u1100-\u115f\u2e80-\u303e\u3041-\u33ff\u3400-\u4dbf\u4e00-\u9fff\ua960-\ua97f\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/g;

const gridAlign = (text: string) =>
  escapeHtml(text).replace(WIDE, (ch) => `<span class="w2">${ch}</span>`);

/**
 * 지금 렌더링 중인 절의 번호.
 *
 * marked의 renderer는 인자를 더 받을 수 없어서 모듈 변수로 넘긴다.
 * `md.parse`가 동기라서 한 번에 한 절만 돌고, 이 로더는 빌드 타임에만 불린다.
 */
let currentSection = 0;

/** 코드 블록의 라벨. 원고의 fence 이름을 그대로 믿는다. */
const CODE_LANGS: Record<string, string> = { python: "Python", javascript: "JavaScript" };

function renderBlock(code: string, lang: string): string {
  const body = code.replace(/\n$/, "");

  const label = CODE_LANGS[lang];
  if (label)
    return (
      `<figure class="codeblock">` +
      `<figcaption><span class="cb-dots" aria-hidden="true"></span>` +
      `<span class="cb-lang">${label}</span></figcaption>` +
      `<pre><code class="language-${lang}">${highlightHtml(body, lang as Language)}</code></pre>` +
      `</figure>`
    );

  // 앞머리에는 절 번호가 없다(currentSection === 0). 거기 있는 text 블록은
  // 학습자가 따라 적는 메모 서식이라, `결과`라고 부르면 프로그램이 뱉은
  // 것이라고 거짓말을 하게 된다.
  if (currentSection === 0)
    return (
      `<figure class="noteblock">` +
      `<figcaption>메모 서식</figcaption>` +
      `<pre>${gridAlign(body)}</pre>` +
      `</figure>`
    );

  // §5는 Mental Model이다. 이 절의 text 블록은 정의상 프로그램이 뱉은 것이
  // 아니라 그림이다(원고 24개 레슨 전부 그렇다). 선 문자가 없는 그림도 있어서
  // — P04의 인덱스 자, P11의 방문 격자 — 글자 모양만 보면 놓친다.
  if (currentSection === 5 || DIAGRAM_GLYPHS.test(body))
    return (
      `<figure class="diagram">` +
      `<pre>${gridAlign(body)}</pre>` +
      `<figcaption>그림</figcaption>` +
      `</figure>`
    );

  return (
    `<figure class="outblock">` +
    `<figcaption>결과</figcaption>` +
    `<pre>${gridAlign(body)}</pre>` +
    `</figure>`
  );
}

/** 전역 `marked`를 건드리지 않도록 이 로더 전용 인스턴스를 쓴다. */
const md = new Marked({
  renderer: {
    code({ text, lang }) {
      return renderBlock(text, lang ?? "");
    },
  },
});

/** 코드 fence를 걷어내고 남은 산문·코드·목록의 양을 센다. */
function measure(markdown: string): SectionMetrics {
  const fences = [...markdown.matchAll(/```(\w*)\n([\s\S]*?)```/g)];
  // 그림과 결과(```text)는 읽는 데 걸리는 시간이 코드와 다르다. 코드만 센다.
  const codeLines = fences
    .filter(([, lang]) => lang === "python" || lang === "javascript")
    .reduce((n, [, , body]) => n + body!.trimEnd().split("\n").length, 0);

  const prose = markdown.replace(/```[\s\S]*?```/g, "");
  return {
    prose: prose.replace(/\s+/g, " ").length,
    codeLines,
    items: (prose.match(/^\s*(?:[-*]|\d+\.)\s+/gm) ?? []).length,
  };
}

function codeBlocks(markdown: string, language: string): string[] {
  const out: string[] = [];
  const re = new RegExp("```" + language + "\\n([\\s\\S]*?)```", "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) out.push(match[1]!.replace(/\n$/, ""));
  return out;
}

let cache: Map<string, TextbookLesson> | null = null;
let intros: Map<TextbookIntro["language"], TextbookIntro> | null = null;

export function loadTextbook(): Map<string, TextbookLesson> {
  if (cache) return cache;
  const lessons = new Map<string, TextbookLesson>();
  const found = new Map<TextbookIntro["language"], TextbookIntro>();
  for (const book of TEXTBOOKS) {
    const path = join(process.cwd(), "content", book.file);
    if (!existsSync(path)) continue; // 아직 쓰지 않은 트랙
    const intro = readTextbook(readFileSync(path, "utf8"), book.prefix, book.language, lessons);
    if (intro) found.set(book.language, intro);
  }
  cache = lessons;
  intros = found;
  return lessons;
}

/** 트랙마다 하나. 교재 앞머리를 읽는 페이지(`/guide/<트랙>`)가 쓴다. */
export function loadIntros(): Map<TextbookIntro["language"], TextbookIntro> {
  loadTextbook();
  return intros!;
}

/**
 * 앞머리에서 빼는 절. `문서 목차`는 레슨 스물넷을 문단으로 늘어놓은 것인데,
 * 사이트의 첫 화면이 같은 목록을 **링크로** 보여 준다. 링크 없는 사본을
 * 한 번 더 보여 주면 어느 쪽을 눌러야 하는지 헷갈리기만 한다.
 */
const INTRO_SKIP = new Set(["문서 목차"]);

function readIntro(preamble: string, language: TextbookIntro["language"]): TextbookIntro | null {
  const title = /^# (.+)$/m.exec(preamble)?.[1]?.trim();
  if (!title) return null;

  currentSection = 0; // 앞머리에는 절 번호가 없다
  const parts = preamble.split(/^## (.+)$/m);
  const sections: TextbookIntro["sections"] = [];
  for (let i = 1; i < parts.length; i += 2) {
    const sectionTitle = parts[i]!.trim();
    if (INTRO_SKIP.has(sectionTitle)) continue;
    // 앞머리는 절 사이를 `---`로 나눈다. 화면에서는 절마다 상자가 되므로
    // 가로줄이 한 번 더 그어지면 칸이 두 번 나뉜 것처럼 보인다.
    const body = parts[i + 1]!.replace(/^\s*---\s*$/gm, "").trim();
    sections.push({
      n: sections.length + 1,
      title: sectionTitle,
      html: md.parse(body, { async: false }) as string,
    });
  }
  if (sections.length === 0) return null;

  return {
    language,
    title,
    // 인용 한 줄이지만 굵게가 들어 있다. 그대로 내면 별표가 화면에 보인다.
    tagline: md.parseInline(/^> (.+)$/m.exec(preamble)?.[1]?.trim() ?? "", {
      async: false,
    }) as string,
    sections,
  };
}

function readTextbook(
  raw: string,
  prefix: string,
  language: "python" | "javascript",
  lessons: Map<string, TextbookLesson>,
): TextbookIntro | null {
  // "# P01. 출력과 주석" 으로 레슨을 자른다.
  const chunks = raw.split(new RegExp(`^# (${prefix}\\d\\d)\\. (.+)$`, "m"));
  // chunks[0]은 첫 레슨 이전, 곧 교재 앞머리다.
  const intro = readIntro(chunks[0] ?? "", language);
  for (let i = 1; i < chunks.length; i += 3) {
    const key = chunks[i]!;
    const title = chunks[i + 1]!.trim();
    const body = chunks[i + 2]!;

    const parts = body.split(/^## (\d+)\. (.+)$/m);
    const sections: TextbookSection[] = [];
    for (let j = 1; j < parts.length; j += 3) {
      const n = Number(parts[j]);
      const sectionTitle = parts[j + 1]!.trim();
      const markdown = parts[j + 2]!.trim();
      currentSection = n;
      sections.push({
        n,
        title: sectionTitle,
        html: md.parse(markdown, { async: false }) as string,
        code: codeBlocks(markdown, language),
        metrics: measure(markdown),
      });
    }

    // 원고가 규칙을 벗어나면 조용히 반쪽짜리 페이지를 내보내느니 빌드가 서야 한다.
    if (sections.length !== SECTION_TITLES.length)
      throw new Error(`${key}: 절이 ${sections.length}개입니다 (${SECTION_TITLES.length}개여야 합니다)`);
    sections.forEach((section, index) => {
      if (section.n !== index + 1) throw new Error(`${key}: ${index + 1}번째 절의 번호가 ${section.n}입니다`);
      if (section.title !== SECTION_TITLES[index])
        throw new Error(`${key} §${section.n}: 제목이 "${section.title}"입니다 ("${SECTION_TITLES[index]}"여야 합니다)`);
    });

    lessons.set(key, { key, title, language, sections });
  }

  return intro;
}

/** 레슨 id("p01-print")에서 교재 키("P01")를 얻는다. */
export function textbookKey(lessonId: string): string {
  return lessonId.split("-")[0]!.toUpperCase();
}
