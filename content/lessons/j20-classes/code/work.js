class Lot {
  constructor(id) {
    this.id = id;
    this.wafers = [];
  }

  record(waferId, measurement) {
    this.wafers.push({ id: waferId, measurement });
    return this.wafers.length;
  }

  summary(limit) {
    const high = this.wafers.filter((wafer) => wafer.measurement > limit);
    return `${this.id}: ${this.wafers.length}장 중 초과 ${high.length}장`;
  }
}

const lot = new Lot("L01");
console.log(lot.record("W01", 94.2));
console.log(lot.record("W02", 101.3));
console.log(lot.record("W03", 96.0));
console.log(lot.summary(100.0));
