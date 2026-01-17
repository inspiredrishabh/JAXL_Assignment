const Agent = require("../models/Agent");
const eventBus = require("../events/EventBus");
const EVENTS = require("../events/eventTypes");
const QueueManager = require("../queue/QueueManager");
const CALL_STATES = require("../constants/callStates");

class AgentManager {
  constructor(agentCount = 0) {
    this.agents = [];
    this.registerListeners();

    for (let i = 1; i <= agentCount; i++) {
      this.agents.push(new Agent(`Agent-${i}`));
    }
  }

  registerListeners() {
    // When a call finishes, free the agent
    eventBus.on(EVENTS.CALL_COMPLETED, ({ call }) => {
      this.freeAgent(call.agentId);
    });
  }

  getAvailableAgent() {
    return this.agents.find(agent => agent.state === "AVAILABLE");
  }

  assignCall(call) {
    const agent = this.getAvailableAgent();

    if (!agent) return false;

    agent.assignCall(call.callId);
    call.assignAgent(agent.agentId);
    call.setState(CALL_STATES.CONNECTED);

    eventBus.emit(EVENTS.AGENT_ASSIGNED, { agent, call });
    eventBus.emit(EVENTS.CALL_CONNECTED, { call, agent });

    return true;
  }

  freeAgent(agentId) {
    const agent = this.agents.find(a => a.agentId === agentId);
    if (!agent) return;

    agent.freeAgent();

    eventBus.emit(EVENTS.AGENT_AVAILABLE, { agent });

    // Immediately check queue
    const nextCall = QueueManager.dequeue();
    if (nextCall) {
      this.assignCall(nextCall);
    }
  }

  getAllAgents() {
    return [...this.agents];
  }
}

module.exports = AgentManager;
