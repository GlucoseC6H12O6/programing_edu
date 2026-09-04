import { LIMIT, parseValue, judge } from "./measurement_utils.js";

const raw = ["94.2", "101.3", "N/A"];
let ok = 0;

for (const text of raw) {
  const value = parseValue(text);
  if (value === null) {
    console.log(text, "→ 사용 불가");
  } else {
    ok = ok + 1;
    console.log(text, "→", value, judge(value));
  }
}

console.log("기준", LIMIT, "· 사용 가능", ok, "건");
