const a = { value: 1 };
const b = a;
b.value = 2;

const c = { ...a };
c.value = 3;

console.log(a.value, b.value, c.value);
console.log(a === b, a === c);
