function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

console.log("A 시작");

const task = delay(10, "결과");
console.log("B 만든 직후:", task);

task.then((value) => {
  console.log("D 도착:", value);
});

console.log("C 동기 끝");
