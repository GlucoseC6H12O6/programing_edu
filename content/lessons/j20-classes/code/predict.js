class Wafer {
  constructor(id, measurement) {
    this.id = id;
    this.measurement = measurement;
    this.status = "UNKNOWN";
  }

  judge(limit) {
    this.status = this.measurement > limit ? "HIGH" : "PASS";
    return this.status;
  }

  label() {
    return `${this.id}:${this.status}`;
  }
}

const first = new Wafer("W01", 94.2);
const second = new Wafer("W02", 101.3);

console.log(first.judge(100.0), second.judge(100.0));
console.log(first.label(), second.label());
console.log(first === second, first.judge === second.judge);
