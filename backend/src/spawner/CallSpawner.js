const { CALL_RATE_PER_TICK } = require("../config/config");

class CallSpawner {
  constructor(callEngine) {
    this.callEngine = callEngine;
  }

  processTick(currentTick) {
    const shouldSpawn = Math.random() < CALL_RATE_PER_TICK;

    if (shouldSpawn) {
      this.callEngine.createCall(currentTick);
    }
  }
}

module.exports = CallSpawner;
