const limits = [90.0, 100.0];
const [lower, upper] = limits;

const wafer = { id: "W01", measurement: 94.2, note: null };
const { id: waferId, measurement, status = "UNKNOWN", note = "-" } = wafer;

console.log(lower, upper);
console.log(waferId, measurement, status, note);
console.log(wafer.id, wafer.status);
