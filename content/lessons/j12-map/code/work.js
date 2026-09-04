const raw = ["94.2", "101.3", "N/A"];

const numbers = raw.map((text) => Number(text));
const labels = raw.map((text, index) => `M${index}:${text}`);

console.log(numbers);
console.log(labels);
console.log(raw);
