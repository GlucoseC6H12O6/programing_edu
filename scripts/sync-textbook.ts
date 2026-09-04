/**
 * 교재 §8(실행 전 예측 문제)의 코드를 레슨의 예제 파일로 내보낸다.
 *
 *   node --experimental-strip-types scripts/sync-textbook.ts          # 쓰기
 *   node --experimental-strip-types scripts/sync-textbook.ts --check  # 검사
 *
 * 왜 §8인가: 교재가 권하는 흐름이 "예측 → Step → 관찰"이다(교안 서두).
 * §8은 학습자에게 결과를 먼저 적게 하는 코드이고, §9는 그 코드를 한 단계씩
 * 따라간다. 플레이어가 돌려야 할 코드가 바로 그것이다. 다른 코드를 돌리면
 * 화면과 원고가 서로 다른 프로그램을 이야기하게 된다.
 *
 * 파일을 만들어 두고 커밋하는 이유는 골든 트레이스와 같다. 트레이스는 이
 * 파일에서 나오므로, 원고가 바뀌었는데 파일이 그대로면 --check가 잡는다.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { loadTextbook, textbookKey } from "../src/content/textbook.ts";

const LESSONS_DIR = join(process.cwd(), "content", "lessons");
/** 트랙마다 확장자만 다르다. 절의 뜻은 두 교재가 같다. */
const EXTENSION = { python: "py", javascript: "js" } as const;
/** §8 = 예측 문제의 코드, §13 = 업무형 예제. 둘 다 자족적인 프로그램이다. */
const FILES: { section: number; stem: string; label: string }[] = [
  { section: 8, stem: "code/predict", label: "§8 실행 전 예측 문제" },
  { section: 13, stem: "code/work", label: "§13 업무형 예제" },
];

/**
 * 교재의 절이 그대로 한 파일이 되지 않는 경우.
 *
 * 기본은 "§8 한 블록 = predict.py, §13 한 블록 = work.py"다. 두 레슨만 다르고,
 * 둘 다 그 레슨이 가르치는 것 때문에 다르다.
 *
 *  - P20은 module 레슨이라 §8·§13이 "두 파일을 나란히 둔다"(§5)는 그림 자체다.
 *    한 파일로 합치면 import할 것이 없어져 레슨이 성립하지 않는다.
 *  - P24는 캡스톤이라 §8이 "summarize를 부르면?"이라는 조각이고, 돌아가는
 *    프로그램은 §6이 6.1~6.5로 나눠 싣는다. §7이 읽는 "전체 프로그램의 큰
 *    순서"가 바로 그 블록들의 순서라 이어 붙이면 그대로 하나의 프로그램이다.
 */
interface Override {
  /** 코드를 가져올 절. 생략하면 원래 절 */
  from?: number;
  /** 블록을 순서대로 이어 한 파일로 만든다 */
  join?: boolean;
  /** 블록마다 다른 파일로 내보낸다. 마지막이 실행을 시작하는 파일이다. */
  files?: string[];
}

const OVERRIDES: Record<string, Record<number, Override>> = {
  P20: {
    8: { files: ["code/config.py", "code/predict.py"] },
    13: { files: ["code/measurement_utils.py", "code/work.py"] },
  },
  P24: { 8: { from: 6, join: true } },
  // J19도 module 레슨이라 P20과 같은 이유로 두 파일이다. §5가 "두 파일을
  // 나란히 둔다"고 그린 그림 자체이므로 한 파일로 합치면 레슨이 성립하지 않는다.
  J19: {
    8: { files: ["code/config.js", "code/predict.js"] },
    13: { files: ["code/measurement_utils.js", "code/work.js"] },
  },
  J23: { 8: { from: 6, join: true } },
};

const check = process.argv.includes("--check");
const textbook = loadTextbook();
let failed = false;

for (const entry of readdirSync(LESSONS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const key = textbookKey(entry.name);
  const lesson = textbook.get(key);
  if (!lesson) continue; // 교재에 없는 레슨은 건드리지 않는다

  for (const { section, stem, label } of FILES) {
    const rule = OVERRIDES[key]?.[section] ?? {};
    const blocks = lesson.sections[(rule.from ?? section) - 1]!.code;
    const targets = rule.files ?? [`${stem}.${EXTENSION[lesson.language]}`];

    // 이어 붙이는 경우는 파일이 하나이고 블록이 전부다
    const bodies = rule.join
      ? [blocks.join("\n\n")]
      : targets.map((_, index) => blocks[index] ?? "");

    for (const [index, target] of targets.entries()) {
      const code = bodies[index];
      if (!code) {
        failed = true;
        console.error(
          `✗ ${key}: ${label}에 ${lesson.language} 코드 블록이 ${index + 1}개 이상 필요합니다`,
        );
        continue;
      }

      const path = join(LESSONS_DIR, entry.name, target);
      const body = `${code}\n`;

      if (check) {
        if (!existsSync(path) || readFileSync(path, "utf8") !== body) {
          failed = true;
          console.error(
            `✗ ${entry.name}/${target}: 교재 ${label}의 코드와 다릅니다. sync-textbook을 다시 실행하세요.`,
          );
        } else {
          console.log(`✓ ${entry.name}/${target}`);
        }
      } else {
        writeFileSync(path, body);
        console.log(`✓ ${entry.name}/${target} 작성 (${code.split("\n").length}줄)`);
      }
    }
  }
}

process.exit(failed ? 1 : 0);
