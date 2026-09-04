const measurements = [93.1, 95.4, 104.2, 99.8];
const limit = 100.0;

let index = 0;
let firstOver = -1;

while (index < measurements.length) {
  if (measurements[index] > limit) {
    firstOver = index;
    break;
  }
  index = index + 1;
}

console.log("첫 초과 위치:", firstOver);

for (const value of measurements) {
  console.log(value, value > limit ? "OVER" : "ok");
}
