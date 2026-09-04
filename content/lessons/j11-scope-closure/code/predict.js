const status = "GLOBAL";

function inspect() {
  const status = "LOCAL";
  console.log("안쪽:", status);
}

inspect();
console.log("바깥:", status);

function makeChecker(lower, upper) {
  return function check(value) {
    return value >= lower && value <= upper;
  };
}

const normal = makeChecker(90, 100);
const strict = makeChecker(95, 98);

console.log(normal(96), strict(96));
console.log(normal(94.2), strict(94.2));
