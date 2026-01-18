const WebSocket = require("ws");
const eventBus = require("../events/EventBus");
const EVENTS = require("../events/eventTypes");

class WebSocketBroadcaster {
  constructor(server, stateCollector) {
    this.wss = new WebSocket.Server({ server });
    this.stateCollector = stateCollector;

    this.registerConnectionHandler();
    this.registerEventListeners();
  }

  registerConnectionHandler() {
    this.wss.on("connection", (ws) => {
      console.log("WebSocket client connected");

      // Send initial snapshot
      ws.send(JSON.stringify({
        type: "STATE_UPDATE",
        payload: this.stateCollector.collect()
      }));
    });
  }

  registerEventListeners() {
    Object.values(EVENTS).forEach(eventName => {
      eventBus.on(eventName, () => {
        this.broadcastState();
      });
    });
  }

  broadcastState() {
    const snapshot = {
      type: "STATE_UPDATE",
      payload: this.stateCollector.collect()
    };

    const data = JSON.stringify(snapshot);

    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

module.exports = WebSocketBroadcaster;
