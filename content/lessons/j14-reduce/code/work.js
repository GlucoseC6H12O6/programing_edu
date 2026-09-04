const wafers = [
  { id: "W01", measurement: 94.2, status: "PASS" },
  { id: "W02", measurement: 101.3, status: "FAIL" },
  { id: "W03", measurement: 96.0, status: "PASS" },
];

const total = wafers.reduce((sum, wafer) => sum + wafer.measurement, 0);
const average = total / wafers.length;

const counts = wafers.reduce((acc, wafer) => {
  acc[wafer.status] = (acc[wafer.status] ?? 0) + 1;
  return acc;
}, {});

console.log("합계", total.toFixed(1), "평균", average.toFixed(2));
console.log(counts);
