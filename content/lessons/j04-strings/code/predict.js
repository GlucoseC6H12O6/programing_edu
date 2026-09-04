const waferId = "WAFER-07";
console.log(waferId.slice(1, 4));
console.log(waferId.slice(-2));
const measurement = 94.234;
const shown = measurement.toFixed(1);
console.log(shown, typeof shown);
console.log(`${waferId} → ${shown}`);
