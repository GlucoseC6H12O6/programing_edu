function loadVirtualData(ms, text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (text === null) {
        reject(new Error("로더가 응답하지 않았습니다"));
      } else {
        resolve(text);
      }
    }, ms);
  });
}

function toMeasurement(raw) {
  if (raw === null || raw === undefined || raw === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function summarize(rows, lower = 90.0, upper = 100.0) {
  const values = rows
    .map((row) => toMeasurement(row.measurement))
    .filter((value) => value !== null);

  const passed = values.filter((value) => value >= lower && value <= upper);
  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    validCount: values.length,
    passCount: passed.length,
    average: values.length > 0 ? total / values.length : null,
    error: null,
  };
}

async function loadAndSummarize(ms, text) {
  try {
    const jsonText = await loadVirtualData(ms, text);
    const rows = JSON.parse(jsonText);
    return summarize(rows);
  } catch (error) {
    return { validCount: 0, passCount: 0, average: null, error: error.message };
  }
}

const GOOD =
  '[{"wafer":"W01","measurement":"94.2"},' +
  '{"wafer":"W02","measurement":"N/A"},' +
  '{"wafer":"W03","measurement":101.3}]';

async function main() {
  const ok = await loadAndSummarize(10, GOOD);
  console.log("정상:", ok.validCount, ok.passCount, ok.average, ok.error);

  const broken = await loadAndSummarize(10, "{망가진 JSON");
  console.log("파싱 실패:", broken.validCount, broken.average, broken.error !== null);

  const down = await loadAndSummarize(10, null);
  console.log("로더 실패:", down.validCount, down.error);

  const empty = await loadAndSummarize(10, "[]");
  console.log("빈 입력:", empty.validCount, empty.average);
}

main();
console.log("동기 부분 끝");
