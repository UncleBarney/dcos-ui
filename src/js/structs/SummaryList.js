const _ = require("underscore");

let StateSummary = require("./StateSummary");

export default class SummaryList {
  constructor(options = {}) {
    this.list = [];
    this.maxLength = null;

    if (options.items) {
      if (toString.call(options.items) !== "[object Array]") {
        throw "Expected an array.";
      }

      this.list = options.items;
    }

    this.maxLength = options.maxLength || this.maxLength;
  }

  add(item) {
    this.list.push(item);

    if (this.maxLength && this.list.length > this.maxLength) {
      this.list.shift();
    }
  }

  addSnapshot(snapshot, date) {
    this.add(new StateSummary({snapshot, date}));
  }

  getItems() {
    return this.list;
  }

  last() {
    return _.last(this.list);
  }
}