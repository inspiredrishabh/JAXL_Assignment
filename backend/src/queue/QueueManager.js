const eventBus = require("../events/EventBus");
const EVENTS = require("../events/eventTypes");
const CALL_STATES = require("../constants/callStates");

class QueueManager {
  constructor() {
    this.queue = [];
    this.registerListeners();
  }

  registerListeners() {
    // When a call must be queued
    eventBus.on(EVENTS.CALL_QUEUED, ({ call }) => {
      this.enqueue(call);
    });
  }

  enqueue(call) {
    call.setState(CALL_STATES.QUEUED);
    this.queue.push(call);
  }

  dequeue() {
    if (this.queue.length === 0) return null;

    const call = this.queue.shift();

    return call;
  }

  size() {
    return this.queue.length;
  }

  getAll() {
    return [...this.queue];
  }
}

module.exports = new QueueManager();
