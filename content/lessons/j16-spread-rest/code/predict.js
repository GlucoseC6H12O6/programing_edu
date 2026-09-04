const first = ["W01", "W02"];
const second = ["W03"];
const all = [...first, ...second];

const original = { id: "W01", measurement: 94.2 };
const updated = { ...original, measurement: 95.1 };
const reversed = { measurement: 95.1, ...original };

console.log(all, first);
console.log(updated.measurement, reversed.measurement);

const source = { details: { status: "PASS" } };
const copy = { ...source };
copy.details.status = "REVIEW";
console.log(source.details.status, copy.details.status);
