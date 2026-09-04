const rawValues = ["94.2", "N/A", "", "0"];

for (const text of rawValues) {
  const value = Number(text);
  const usable = Number.isFinite(value) && text !== "";
  console.log(text, value, usable);
}
