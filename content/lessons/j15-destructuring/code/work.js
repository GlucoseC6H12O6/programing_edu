const wafers = [
  { id: "W01", measurement: 94.2 },
  { id: "W02", measurement: 101.3, status: "FAIL" },
];

function label({ id, measurement, status = "UNKNOWN" }) {
  return `${id}:${measurement}:${status}`;
}

for (const wafer of wafers) {
  console.log(label(wafer));
}

const [first, second] = wafers;
console.log(first.id, second.id);
