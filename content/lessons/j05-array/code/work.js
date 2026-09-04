const wafers = ["W01", "W02", "W03"];

wafers.push("W04");
wafers[1] = "W02-R";
console.log(wafers);
console.log(wafers.length, wafers[wafers.length - 1]);

const firstTwo = wafers.slice(0, 2);
console.log(firstTwo);
console.log(wafers);
