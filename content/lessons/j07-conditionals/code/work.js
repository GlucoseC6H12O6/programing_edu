const measurement = 104.3;
let status;

if (measurement < 90.0) {
  status = "LOW";
} else if (measurement <= 100.0) {
  status = "PASS";
} else {
  status = "HIGH";
}

const label = status === "PASS" ? "OK" : "REVIEW";
console.log(measurement, status, label);
