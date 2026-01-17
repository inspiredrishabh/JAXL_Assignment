const eventBus = require("./EventBus");
const EVENTS = require("./eventTypes");

Object.values(EVENTS).forEach((eventName) => {
  eventBus.on(eventName, (payload) => {
    console.log(`[EVENT] ${eventName}`, payload?.call?.callId || "");
  });
});
