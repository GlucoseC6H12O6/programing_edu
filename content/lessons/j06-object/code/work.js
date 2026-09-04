const wafer = { id: "W01", measurement: 94.2, passed: true };
const field = "passed";

console.log(wafer.field);
console.log(wafer[field]);

wafer.measurement = 95.1;
wafer.retested = true;

console.log(wafer);
console.log(wafer.operator);
