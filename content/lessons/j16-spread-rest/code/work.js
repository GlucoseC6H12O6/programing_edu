function average(...values) {
  if (values.length === 0) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

console.log(average(94.2, 101.3, 96.0).toFixed(2));
console.log(average());

const source = { id: "W01", details: { status: "PASS" } };
const copy = { ...source };
copy.id = "W02";
copy.details.status = "REVIEW";

console.log(source.id, copy.id);
console.log(source.details.status, copy.details.status);
