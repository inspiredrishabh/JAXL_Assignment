const { v4: uuid } = require("uuid");
const CALL_STATES = require("../constants/callStates");

class Call {
  constructor(customerId, createdAtTick) {
    this.callId = uuid();
    this.customerId = customerId;

    this.state = CALL_STATES.DIALING;
    this.createdAtTick = createdAtTick;

    // time-related (tick based)
    this.pickupAtTick = null;
    this.endAtTick = null;

    // agent assignment
    this.agentId = null;
  }

  setState(newState) {
    this.state = newState;
  }

  assignAgent(agentId) {
    this.agentId = agentId;
  }

  clearAgent() {
    this.agentId = null;
  }
}

module.exports = Call;
