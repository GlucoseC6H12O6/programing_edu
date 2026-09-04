const wafers = [
  { id: "W01", measurement: 94.2 },
  { id: "W02", measurement: 101.3 },
  { id: "W03", measurement: 96.0 },
];

const passed = wafers.filter((wafer) => wafer.measurement <= 100.0);
const firstHigh = wafers.find((wafer) => wafer.measurement > 100.0);

console.log("합격:", passed.length, "장");
for (const wafer of passed) {
  console.log(" ", wafer.id, wafer.measurement);
}

if (firstHigh) {
  console.log("첫 초과:", firstHigh.id, firstHigh.measurement);
} else {
  console.log("초과 없음");
}
