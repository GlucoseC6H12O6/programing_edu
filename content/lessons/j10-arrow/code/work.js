const wafers = [
  { id: "W01", measurement: 94.2 },
  { id: "W02", measurement: 101.3 },
];

const toLabel = (wafer) => ({
  id: wafer.id,
  label: `${wafer.id}:${wafer.measurement}`,
});

const labels = wafers.map(toLabel);
console.log(labels);
console.log(labels[0].label);
