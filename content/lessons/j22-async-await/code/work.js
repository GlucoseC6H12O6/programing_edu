function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

async function readValue(text) {
  const value = await delay(10, Number(text));
  if (!Number.isFinite(value)) {
    throw new RangeError(`숫자가 아닙니다: ${text}`);
  }
  return value;
}

async function main() {
  const inputs = ["94.2", "N/A", "101.3"];
  let total = 0;
  for (const text of inputs) {
    try {
      const value = await readValue(text);
      total = total + value;
      console.log("OK", value);
    } catch (error) {
      console.log("실패", error.name, error.message);
    }
  }
  console.log("합계", total.toFixed(1));
}

main();
console.log("동기 부분은 여기서 끝납니다");
