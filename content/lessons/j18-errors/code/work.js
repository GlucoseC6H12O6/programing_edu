function readMeasurement(row) {
  if (row === null || row === undefined) {
    throw new TypeError("행이 없습니다");
  }
  const value = Number(row.measurement);
  if (!Number.isFinite(value)) {
    throw new RangeError(`숫자가 아닙니다: ${row.measurement}`);
  }
  return value;
}

const rows = [
  { id: "W01", measurement: "94.2" },
  { id: "W02", measurement: "N/A" },
  null,
];

let ok = 0;
const failures = [];

for (const row of rows) {
  try {
    const value = readMeasurement(row);
    ok = ok + 1;
    console.log("OK", value);
  } catch (error) {
    failures.push(error.name);
  }
}

console.log("성공", ok, "실패", failures);
