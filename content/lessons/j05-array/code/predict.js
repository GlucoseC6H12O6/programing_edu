const values = [1, 2, 3];
const result = values.push(4);
console.log(values, result);

const copied = values.slice(0, 2);
console.log(copied, values);

const removed = values.splice(0, 2);
console.log(removed, values);
