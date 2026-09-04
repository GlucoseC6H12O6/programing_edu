function toMeasurement(raw) {
  if (raw === null || raw === undefined || raw === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function summarize(rows, lower = 90.0, upper = 100.0) {
  const parsed = rows.map((row) => ({
    wafer: row.wafer,
    value: toMeasurement(row.measurement),
  }));

  const valid = parsed.filter((row) => row.value !== null);
  const review = valid.filter((row) => row.value < lower || row.value > upper);
  const total = valid.reduce((sum, row) => sum + row.value, 0);

  return {
    validCount: valid.length,
    invalidCount: parsed.length - valid.length,
    passCount: valid.length - review.length,
    average: valid.length > 0 ? total / valid.length : null,
    reviewWaferIds: review.map((row) => row.wafer),
    error: null,
  };
}

const rows = [
  { wafer: "W01", measurement: "94.2" },
  { wafer: "W02", measurement: "N/A" },
  { wafer: "W03", measurement: 101.3 },
  { wafer: "W04", measurement: "" },
];

const summary = summarize(rows);
console.log(summary.validCount, summary.invalidCount, summary.passCount);
console.log(summary.average.toFixed(2));
console.log(summary.reviewWaferIds);
console.log(JSON.stringify(summary));
