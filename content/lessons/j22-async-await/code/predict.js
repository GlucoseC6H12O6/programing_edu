function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

async function loadValue(id) {
  console.log("요청:", id);
  const value = await delay(10, id * 10);
  console.log("응답:", value);
  return value;
}

async function main() {
  const first = await loadValue(1);
  const second = await loadValue(2);
  console.log("합계", first + second);
}

console.log("A 동기");
main();
console.log("B 동기");
