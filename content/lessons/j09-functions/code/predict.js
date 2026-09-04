function isInRange(value, lower = 90.0, upper = 100.0) {
  return value >= lower && value <= upper;
}

console.log(isInRange(94.2));
console.log(isInRange(94.2, 95.0));
console.log(isInRange(94.2, 90.0, 94.0));
