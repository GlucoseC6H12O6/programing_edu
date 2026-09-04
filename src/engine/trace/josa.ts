/**
 * 조사 자동 선택.
 *
 * 단계 설명 문구를 기계 생성하기로 한 이상(§9.3, narrate.ts) 조사는 반드시
 * 계산해야 한다. "끝값 3는", "i는 0로 고정" 같은 문장이 수백 단계에 걸쳐
 * 반복되면 설명 자체의 신뢰를 깎는다.
 *
 * 값이 숫자나 영문 식별자(`W01`, `mul`)로 끝나는 경우가 많으므로
 * 한글 받침뿐 아니라 숫자·알파벳의 한국어 독음 받침까지 처리한다.
 */

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSEONG_RIEUL = 8;

type Batchim = "none" | "rieul" | "other";

/** 숫자 독음의 받침: 0 영, 1 일, 2 이, 3 삼, 4 사, 5 오, 6 육, 7 칠, 8 팔, 9 구 */
const DIGIT_BATCHIM: Record<string, Batchim> = {
  "0": "other",
  "1": "rieul",
  "2": "none",
  "3": "other",
  "4": "none",
  "5": "none",
  "6": "other",
  "7": "rieul",
  "8": "rieul",
  "9": "none",
};

/** 알파벳 독음의 받침: l 엘, m 엠, n 엔, r 알, f 에프 만 받침이 있다 */
const LATIN_BATCHIM: Record<string, Batchim> = {
  l: "rieul",
  r: "rieul",
  m: "other",
  n: "other",
  f: "other",
};

/** 뒤에서부터 조사 판단에 쓸 수 있는 첫 글자(한글·영문·숫자)를 찾는다. */
function lastMeaningfulChar(text: string): string | null {
  for (let i = text.length - 1; i >= 0; i -= 1) {
    const ch = text[i]!;
    if (/[0-9A-Za-z가-힣]/.test(ch)) return ch;
  }
  return null;
}

function batchimOf(text: string): Batchim | null {
  const ch = lastMeaningfulChar(text);
  if (!ch) return null;

  const code = ch.codePointAt(0)!;
  if (code >= HANGUL_START && code <= HANGUL_END) {
    const jongseong = (code - HANGUL_START) % 28;
    if (jongseong === 0) return "none";
    return jongseong === JONGSEONG_RIEUL ? "rieul" : "other";
  }
  if (/[0-9]/.test(ch)) return DIGIT_BATCHIM[ch] ?? "other";
  return LATIN_BATCHIM[ch.toLowerCase()] ?? "none";
}

export type JosaPair = "은는" | "이가" | "을를" | "와과" | "로" | "라는";

/**
 * 앞말에 붙일 조사를 고른다.
 *
 *   `${name}${josa(name, "이가")} ${value}${josa(value, "로")} 바뀝니다`
 */
export function josa(word: string, pair: JosaPair): string {
  const batchim = batchimOf(word);
  // 판단할 근거가 없으면(기호만 있는 값) 무난한 쪽을 쓴다
  const hasBatchim = batchim === null ? false : batchim !== "none";

  switch (pair) {
    case "은는":
      return hasBatchim ? "은" : "는";
    case "이가":
      return hasBatchim ? "이" : "가";
    case "을를":
      return hasBatchim ? "을" : "를";
    case "와과":
      return hasBatchim ? "과" : "와";
    case "라는":
      return hasBatchim ? "이라는" : "라는";
    case "로":
      // ㄹ 받침은 '으로'가 아니라 '로'를 쓴다
      return batchim === "other" ? "으로" : "로";
  }
}

/** 앞말과 조사를 붙여 반환하는 축약형 */
export function withJosa(word: string, pair: JosaPair): string {
  return `${word}${josa(word, pair)}`;
}
