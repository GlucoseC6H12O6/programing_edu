const raw = '[{"id":"W01","measurement":"94.2"},{"id":"W02","measurement":"N/A"}]';
const rows = JSON.parse(raw);

const parsed = rows.map((row) => ({
  id: row.id,
  value: Number(row.measurement),
}));

const usable = parsed.filter((row) => Number.isFinite(row.value));

console.log(rows.length, usable.length);
for (const row of usable) {
  console.log(row.id, row.value);
}
console.log(JSON.stringify(usable));
