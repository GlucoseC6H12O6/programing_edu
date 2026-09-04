const values = [0, "0", "false", "", null];

for (const value of values) {
  if (value) {
    console.log(value, "→ truthy");
  } else {
    console.log(value, "→ falsy");
  }
}
