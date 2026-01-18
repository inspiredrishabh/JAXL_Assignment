const Call = require("../models/Call");
const CALL_STATES = require("../constants/callStates");
const eventBus = require("../events/EventBus");
const EVENTS = require("../events/eventTypes");
const QueueManager = require("../queue/QueueManager");
const AgentManager = require("../agents/AgentManager");
const {
  PICKUP_DELAY_TICKS,
  CALL_DURATION_TICKS,
  PICKUP_PROBABILITY
} = require("../config/config");

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class CallEngine {
  constructor(agentManager) {
    this.calls = new Map(); // callId -> Call
    this.agentManager = agentManager;
  }

  createCall(currentTick) {
    const call = new Call(`customer-${currentTick}`, currentTick);

    // schedule pickup decision
    call.pickupAtTick =
      currentTick +
      randomBetween(
        PICKUP_DELAY_TICKS.MIN,
        PICKUP_DELAY_TICKS.MAX
      );

    this.calls.set(call.callId, call);

    eventBus.emit(EVENTS.CALL_CREATED, { call });
  }

  processTick(currentTick) {
    for (const call of this.calls.values()) {
      switch (call.state) {
        case CALL_STATES.DIALING:
          this.processDialing(call, currentTick);
          break;

        case CALL_STATES.CONNECTED:
          this.processConnected(call, currentTick);
          break;

        default:
          break;
      }
    }
  }

  processDialing(call, currentTick) {
    if (currentTick < call.pickupAtTick) return;

    const pickedUp = Math.random() < PICKUP_PROBABILITY;

    if (!pickedUp) {
      call.setState(CALL_STATES.DROPPED);
      eventBus.emit(EVENTS.CALL_DROPPED, { call });
      return;
    }

    eventBus.emit(EVENTS.CALL_PICKED, { call });

    const assigned = this.agentManager.assignCall(call);

    if (!assigned) {
      eventBus.emit(EVENTS.CALL_QUEUED, { call });
    } else {
      this.scheduleCompletion(call, currentTick);
    }
  }

  processConnected(call, currentTick) {
    if (currentTick >= call.endAtTick) {
      call.setState(CALL_STATES.COMPLETED);
      eventBus.emit(EVENTS.CALL_COMPLETED, { call });
    }
  }

  scheduleCompletion(call, currentTick) {
    call.endAtTick =
      currentTick +
      randomBetween(
        CALL_DURATION_TICKS.MIN,
        CALL_DURATION_TICKS.MAX
      );
  }

  getAllCalls() {
    return Array.from(this.calls.values());
  }
}

module.exports = CallEngine;
