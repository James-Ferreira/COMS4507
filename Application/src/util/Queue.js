/**
 * Queue class based on the one found at
 * ehttps://www.javascripttutorial.net/javascript-queue/
 */

export default class Queue {
  constructor() {
    this.elements = [];
  }

  enqueue(e) {
    this.elements.push(e);
  }

  dequeue() {
    return this.elements.shift();
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  peek() {
    return !this.isEmpty() ? this.elements[0] : undefined;
  }

  length() {
    return this.elements.length;
  }
}
