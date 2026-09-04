const values = [1, 2, 3];
const calls = [];

const doubled = values.map((value) => {
  calls.push(value);
  return value * 10;
});

const missing = values.map((value) => {
  value * 10;
});

console.log(doubled);
console.log(missing);
console.log("콜백 호출 횟수:", calls.length, calls);
console.log("원본:", values);
