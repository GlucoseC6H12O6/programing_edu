/**
 * 트레이스의 단계 문구를 그대로 출력한다. 레슨 원고 검수용.
 *
 *   node --experimental-strip-types scripts/show-trace.ts <trace.json> [core|expression]
 *
 * §13.3의 "모든 Step 이벤트와 설명 문구가 코드 실행 결과와 일치한다"를
 * 눈으로 확인할 때 쓴다. 브라우저를 열지 않고 문구만 빠르게 훑을 수 있다.
 */

import { readFileSync } from "node:fs";

import { narrate } from "../src/engine/trace/narrate.ts";
import { TracePlayer } from "../src/engine/trace/player.ts";
import type { DetailLevel, TraceDocument } from "../src/engine/trace/types.ts";

const path = process.argv[2];
if (!path) {
  console.error("사용법: show-trace.ts <trace.json> [core|expression]");
  process.exit(1);
}

const doc = JSON.parse(readFileSync(path, "utf8")) as TraceDocument;
const detail = (process.argv[3] ?? "core") as DetailLevel;
const player = new TracePlayer(doc);
const stops = player.stops(detail);

console.log(`${doc.lessonId} · ${doc.source.path} · ${doc.events.length} events · ${stops.length - 1}단계 (${detail})\n`);
doc.source.lines.forEach((line, i) => console.log(`  ${String(i + 1).padStart(2)} │ ${line}`));
console.log();

for (const cursor of stops) {
  if (cursor === 0) continue;
  const event = player.eventAt(cursor)!;
  const index = stops.indexOf(cursor);
  console.log(
    `${String(index).padStart(3)}  L${String(event.line).padStart(2)}  ${event.type.padEnd(16)} ${narrate(event, player.stateAt(cursor))}`,
  );
}
