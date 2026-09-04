export const LIMIT = 100.0;

export function parseValue(text) {
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

export function judge(value) {
  return value > LIMIT ? "HIGH" : "PASS";
}
