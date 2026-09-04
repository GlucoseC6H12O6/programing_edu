const a = (x) => x * 2;
const b = (x) => { x * 2; };
const c = (x) => { return x * 2; };

console.log(a(3), b(3), c(3));
console.log(typeof a, typeof a(3));
