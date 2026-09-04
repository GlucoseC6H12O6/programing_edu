const values = [94.2, 101.3, 96.0, 88.7];

const passed = values.filter((value) => value >= 90 && value <= 100);
const firstHigh = values.find((value) => value > 100);
const negative = values.filter((value) => value < 0);
const firstNegative = values.find((value) => value < 0);

console.log(passed);
console.log(firstHigh);
console.log(negative, negative.length);
console.log(firstNegative);
