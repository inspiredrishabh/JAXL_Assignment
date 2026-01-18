require("dotenv").config();
const http = require("http");
const app = require("./app");

const { startClock, initTickEngine, getCurrentTick } = require("./tick/clock");

const AgentManager = require("./agents/AgentManager");
const CallEngine = require("./engine/CallEngine");
const CallSpawner = require("./spawner/CallSpawner");
const StateCollector = require("./websocket/stateCollector");
const WebSocketBroadcaster = require("./websocket/wsServer");

const { AGENT_COUNT } = require("./config/config");

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const agentManager = new AgentManager(AGENT_COUNT);
const callEngine = new CallEngine(agentManager);
const callSpawner = new CallSpawner(callEngine);

initTickEngine({
  callEngineInstance: callEngine,
  callSpawnerInstance: callSpawner,
});

const stateCollector = new StateCollector(
  callEngine,
  agentManager,
  getCurrentTick,
);

new WebSocketBroadcaster(server, stateCollector);

startClock();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
