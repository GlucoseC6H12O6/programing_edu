function fetchMeasurement(id, ms, value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value === null) {
        reject(new RangeError(`측정 실패: ${id}`));
      } else {
        resolve({ id, value });
      }
    }, ms);
  });
}

fetchMeasurement("W01", 20, 94.2)
  .then((row) => {
    console.log("도착:", row.id, row.value);
    return row.value > 100 ? "HIGH" : "PASS";
  })
  .then((status) => {
    console.log("판정:", status);
  })
  .catch((error) => {
    console.log("실패:", error.name, error.message);
  });

fetchMeasurement("W02", 10, null)
  .then((row) => {
    console.log("도착:", row.id);
  })
  .catch((error) => {
    console.log("실패:", error.name, error.message);
  });

console.log("요청 두 건을 보냈습니다");
