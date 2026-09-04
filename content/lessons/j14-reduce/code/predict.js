const values = [1, 2, 3];
const total = values.reduce((sum, value) => sum + value, 10);
console.log(total);

const statuses = ["PASS", "FAIL", "PASS"];
const counts = statuses.reduce((acc, status) => {
  acc[status] = (acc[status] ?? 0) + 1;
  return acc;
}, {});
console.log(counts);

const empty = [].reduce((sum, value) => sum + value, 0);
console.log(empty);
