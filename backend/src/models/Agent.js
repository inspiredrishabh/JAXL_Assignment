const { v4: uuid } = require("uuid");
const AGENT_STATES = require("../constants/agentStates");

class Agent {
  constructor(name) {
    this.agentId = uuid();
    this.name = name;
    this.state = AGENT_STATES.AVAILABLE;
    this.currentCallId = null;
  }

  assignCall(callId) {
    this.state = AGENT_STATES.BUSY;
    this.currentCallId = callId;
  }

  freeAgent() {
    this.state = AGENT_STATES.AVAILABLE;
    this.currentCallId = null;
  }
}

module.exports = Agent;
