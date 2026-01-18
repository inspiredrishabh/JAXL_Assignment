const QueueManager = require("../queue/QueueManager");

class StateCollector {
  constructor(callEngine, agentManager, getCurrentTick) {
    this.callEngine = callEngine;
    this.agentManager = agentManager;
    this.getCurrentTick = getCurrentTick;
  }

  collect() {
    return {
      tick: this.getCurrentTick(),
      agents: this.agentManager.getAllAgents(),
      calls: this.callEngine.getAllCalls(),
      queueLength: QueueManager.size()
    };
  }
}

module.exports = StateCollector;
