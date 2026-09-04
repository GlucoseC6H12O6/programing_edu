function makeHighChecker(limit) {
  return function isHigh(value) {
    return value > limit;
  };
}

const overSpec = makeHighChecker(100.0);
const overWarn = makeHighChecker(98.0);
const measurements = [94.2, 99.1, 104.3];

for (const value of measurements) {
  console.log(value, overWarn(value), overSpec(value));
}
