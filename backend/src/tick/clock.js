const { TICK_INTERVAL_MS } = require("../config/config");

let currentTick = 0;
let intervalRef = null;

function tick() {
  currentTick++;
  console.log("TICK:", currentTick);

  // Phase 2+:
  // - spawn calls
  // - process dialing
  // - process completions
}

function startClock() {
  if (intervalRef) return;

  intervalRef = setInterval(tick, TICK_INTERVAL_MS);
}

function stopClock() {
  clearInterval(intervalRef);
  intervalRef = null;
}

function getCurrentTick() {
  return currentTick;
}

module.exports = {
  startClock,
  stopClock,
  getCurrentTick
};
