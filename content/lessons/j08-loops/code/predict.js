const wafers = ["W01", "W02", "W03"];
let bodyRuns = 0;
let lastIndex = -1;

for (let index = 0; index < wafers.length; index += 1) {
  bodyRuns = bodyRuns + 1;
  lastIndex = index;
  console.log(index, wafers[index]);
}

console.log("본문", bodyRuns, "회 / 마지막 index", lastIndex);
