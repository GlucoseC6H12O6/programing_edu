const raw = "  eq-01  ";
const name = raw.trim().toUpperCase().replace("-", "_");
const measurement = 94.234;
const report = `${name} measurement=${measurement.toFixed(2)}`;

console.log(report);
console.log(raw);
console.log(name.length, raw.length);
