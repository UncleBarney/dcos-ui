import Item from "./Item";

export default class Service extends Item {
  getNodeIDs() {
    return this.get("slave_ids");
  }
}