const text = '{"id":"W01","measurement":94.2,"note":null}';
const wafer = JSON.parse(text);

console.log(typeof text, typeof wafer);
console.log(wafer.measurement + 1);
console.log(wafer.note, wafer.missing);

wafer.checked = undefined;
wafer.at = "2026-01-01";
console.log(JSON.stringify(wafer));
