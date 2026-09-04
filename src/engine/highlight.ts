/**
 * 한 줄 구문 강조 — Python과 JavaScript.
 *
 * 라이브러리(Shiki 등)를 붙이지 않는 이유는 이 사이트가 코드를 **두 곳**에서
 * 그리기 때문이다. 플레이어의 CODE 패널은 줄마다 실행 상태(현재/완료/오류)를
 * 입혀 React가 그리고, 교재 본문의 코드 블록은 빌드 타임에 HTML로 굳는다.
 * 같은 코드가 두 곳에서 다르게 보이면 "지금 읽은 그 코드를 실행한다"는
 * 연결이 끊긴다. 토크나이저를 하나만 두고 양쪽이 같은 클래스를 쓰면
 * 색이 어긋날 수가 없다.
 *
 * 두 언어를 한 함수로 다루는 이유도 같다. 두 트랙은 나란히 놓고 비교하라고
 * 만든 것이라(§9.2 8번 "언어 비교"), 같은 자리의 같은 것이 같은 색이어야 한다.
 * 언어별로 다른 것은 표 하나에 모아 두었고 훑는 규칙은 공유한다.
 *
 * 줄 단위로 도는 것은 플레이어가 줄 단위이기 때문이다. 그래서 여러 줄에
 * 걸친 문자열의 가운데 줄은 코드로 읽힌다. 두 교재의 예제에 그런 코드는 없다
 * (Python의 삼중따옴표는 전부 한 줄짜리 docstring이고, JavaScript의 template
 * literal도 한 줄 안에서 닫힌다).
 */

export interface Token {
  text: string;
  /** 빈 문자열이면 색을 입히지 않는다 */
  cls: string;
}

export type Language = "python" | "javascript";

interface Spec {
  keywords: Set<string>;
  /** 키워드지만 값이라 예약어 색이 아니라 값 색이 어울리는 이름 */
  constants: Set<string>;
  builtins: Set<string>;
  /** 줄 끝까지 주석이 되는 표시 */
  lineComment: string;
  /** 이 낱말 뒤의 이름은 정의되는 이름이다 */
  definers: Set<string>;
  /** 자기 자신을 가리키는 이름 */
  receiver: string;
  /** 문자열을 열 수 있는 따옴표 */
  quotes: string;
  /** f"" / r"" 같은 접두사를 쓰는가 */
  stringPrefixes: boolean;
}

const PYTHON: Spec = {
  keywords: new Set([
    "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del",
    "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in",
    "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while",
    "with", "yield",
  ]),
  constants: new Set(["True", "False", "None"]),
  builtins: new Set([
    "abs", "all", "any", "bool", "chr", "dict", "divmod", "enumerate", "filter", "float",
    "format", "getattr", "hasattr", "input", "int", "isinstance", "issubclass", "len",
    "list", "map", "max", "min", "next", "object", "open", "ord", "pow", "print", "range",
    "repr", "reversed", "round", "set", "setattr", "sorted", "str", "sum", "super",
    "tuple", "type", "zip",
    // 교재가 §12에서 이름으로 부르는 예외들. 색이 없으면 그냥 변수처럼 보인다.
    "Exception", "BaseException", "ValueError", "TypeError", "KeyError", "IndexError",
    "ZeroDivisionError", "AttributeError", "NameError", "RuntimeError", "StopIteration",
    "FileNotFoundError", "OSError",
  ]),
  lineComment: "#",
  definers: new Set(["def", "class"]),
  receiver: "self",
  quotes: "\"'",
  stringPrefixes: true,
};

const JAVASCRIPT: Spec = {
  keywords: new Set([
    "async", "await", "break", "case", "catch", "class", "const", "continue", "debugger",
    "default", "delete", "do", "else", "export", "extends", "finally", "for", "from",
    "function", "get", "if", "import", "in", "instanceof", "let", "new", "of", "return",
    "set", "static", "super", "switch", "throw", "try", "typeof", "var", "void", "while",
    "yield",
  ]),
  // undefined와 NaN은 예약어가 아니지만 값으로만 쓰이므로 값 색이 맞다.
  constants: new Set(["true", "false", "null", "undefined", "NaN", "Infinity"]),
  builtins: new Set([
    "Array", "Boolean", "console", "Date", "Function", "JSON", "Map", "Math", "Number",
    "Object", "Promise", "Set", "String", "Symbol", "WeakMap", "WeakSet",
    "isFinite", "isNaN", "parseFloat", "parseInt", "structuredClone",
    "setTimeout", "clearTimeout", "setInterval", "clearInterval", "queueMicrotask",
    // 교재가 §12에서 이름으로 부르는 오류들
    "Error", "TypeError", "RangeError", "ReferenceError", "SyntaxError", "EvalError",
    "URIError", "AggregateError",
  ]),
  lineComment: "//",
  definers: new Set(["function", "class"]),
  receiver: "this",
  quotes: "\"'`",
  stringPrefixes: false,
};

const SPECS: Record<Language, Spec> = { python: PYTHON, javascript: JAVASCRIPT };

const ID_START = /[A-Za-z_$]/;
const ID_PART = /[A-Za-z0-9_$]/;
const OPERATORS = "+-*/%<>=!&|^~@?";

/** 문자열 리터럴 앞에 붙을 수 있는 접두사(f, r, b, rb, ...) */
function stringPrefix(line: string, at: number, spec: Spec): number {
  if (!spec.stringPrefixes) return 0;
  let n = 0;
  while (n < 3 && at + n < line.length && /[fFrRbBuU]/.test(line[at + n]!)) n += 1;
  const quote = line[at + n];
  return n > 0 && quote !== undefined && spec.quotes.includes(quote) ? n : 0;
}

/** 여는 따옴표 위치에서 닫는 위치 다음까지. 줄에서 안 닫히면 줄 끝까지. */
function stringEnd(line: string, open: number): number {
  const quote = line[open]!;
  const triple = line.startsWith(quote.repeat(3), open);
  const mark = triple ? quote.repeat(3) : quote;
  let i = open + mark.length;
  while (i < line.length) {
    if (line[i] === "\\") {
      i += 2;
      continue;
    }
    if (line.startsWith(mark, i)) return i + mark.length;
    i += 1;
  }
  return line.length;
}

function numberEnd(line: string, start: number): number {
  let i = start;
  while (i < line.length && /[0-9a-fA-FxXoObB_.]/.test(line[i]!)) {
    // 1.0e-3의 지수 부호. `-`를 무조건 먹으면 `1-2`가 한 덩어리가 된다.
    if (line[i] === "." && !/[0-9]/.test(line[i + 1] ?? "")) break;
    i += 1;
  }
  if (/[eE]/.test(line[i - 1] ?? "") && /[+-]/.test(line[i] ?? "")) {
    i += 1;
    while (i < line.length && /[0-9]/.test(line[i]!)) i += 1;
  }
  return i;
}

/** 바로 앞에 나온 코드 낱말. `def name` / `function name`을 가려내는 데 쓴다. */
function previousWord(tokens: Token[]): string {
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    const text = tokens[i]!.text.trim();
    if (text) return text;
  }
  return "";
}

export function highlight(line: string, language: Language = "python"): Token[] {
  const spec = SPECS[language] ?? PYTHON;
  const tokens: Token[] = [];
  const push = (text: string, cls: string) => {
    if (!text) return;
    // 같은 색이 이어지면 span을 늘리지 않고 붙인다. 한 줄에 span이 수십 개씩
    // 생기면 수백 개 블록에서 HTML이 눈에 띄게 불어난다.
    const last = tokens[tokens.length - 1];
    if (last && last.cls === cls) last.text += text;
    else tokens.push({ text, cls });
  };

  let i = 0;
  while (i < line.length) {
    const ch = line[i]!;

    // 주석. 문자열 안의 `#`나 `//`는 여기까지 오지 않는다 — 문자열을 먼저 먹기 때문이다.
    if (line.startsWith(spec.lineComment, i)) {
      push(line.slice(i), "tok-comment");
      break;
    }

    // /* ... */ 는 한 줄 안에서 닫히는 것만 다룬다.
    if (language === "javascript" && line.startsWith("/*", i)) {
      const close = line.indexOf("*/", i + 2);
      const end = close === -1 ? line.length : close + 2;
      push(line.slice(i, end), "tok-comment");
      i = end;
      continue;
    }

    if (spec.quotes.includes(ch)) {
      const end = stringEnd(line, i);
      push(line.slice(i, end), "tok-str");
      i = end;
      continue;
    }

    if (ID_START.test(ch)) {
      const prefix = stringPrefix(line, i, spec);
      if (prefix) {
        const end = stringEnd(line, i + prefix);
        push(line.slice(i, end), "tok-str");
        i = end;
        continue;
      }

      let end = i;
      while (end < line.length && ID_PART.test(line[end]!)) end += 1;
      const word = line.slice(i, end);
      const previous = previousWord(tokens);
      // 이름 뒤의 공백을 건너뛰고 `(`가 오면 호출이다. `print (x)`도 호출이다.
      let after = end;
      while (after < line.length && line[after] === " ") after += 1;
      const isCall = line[after] === "(";

      const cls = spec.constants.has(word)
        ? "tok-const"
        : spec.keywords.has(word)
          ? "tok-kw"
          : spec.definers.has(previous)
            ? "tok-def"
            : spec.builtins.has(word)
              ? "tok-builtin"
              : word === spec.receiver
                ? "tok-self"
                : isCall
                  ? "tok-fn"
                  : "";
      push(word, cls);
      i = end;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      const end = numberEnd(line, i);
      push(line.slice(i, end), "tok-num");
      i = end;
      continue;
    }

    if (OPERATORS.includes(ch)) {
      push(ch, "tok-op");
      i += 1;
      continue;
    }

    push(ch, "");
    i += 1;
  }

  return tokens;
}

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };

function escapeHtml(text: string): string {
  return text.replace(/[&<>]/g, (ch) => ESCAPES[ch]!);
}

/**
 * 코드 블록 전체를 HTML로. 빌드 타임(교재 렌더링)에서만 쓴다.
 * 플레이어는 줄마다 상태를 입혀야 해서 `highlight`를 직접 쓴다.
 */
export function highlightHtml(code: string, language: Language = "python"): string {
  return code
    .split("\n")
    .map((line) =>
      highlight(line, language)
        .map((token) =>
          token.cls
            ? `<span class="${token.cls}">${escapeHtml(token.text)}</span>`
            : escapeHtml(token.text),
        )
        .join(""),
    )
    .join("\n");
}
