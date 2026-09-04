function parseValue(text) {
  const value = Number(text);
  if (!Number.isFinite(value)) {
    throw new RangeError(`숫자가 아닙니다: ${text}`);
  }
  return value;
}

const inputs = ["94.2", "N/A"];

for (const text of inputs) {
  try {
    console.log("값:", parseValue(text));
  } catch (error) {
    console.log("실패:", error.name, error.message);
  } finally {
    console.log("정리:", text);
  }
}
