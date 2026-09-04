function countFinite(values) {
  let count = 0;
  for (const text of values) {
    const value = Number(text);
    if (Number.isFinite(value) && text !== "") {
      count = count + 1;
    }
  }
  return count;
}

const raw = ["94.2", "N/A", "", "101.3"];
const usable = countFinite(raw);
console.log("사용 가능:", usable, "/", raw.length);
