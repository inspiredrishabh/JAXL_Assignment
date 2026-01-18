let currentTick = 0;
let intervalRef = null;

let callEngine = null;
let callSpawner = null;

function initTickEngine({ callEngineInstance, callSpawnerInstance }) {
  callEngine = callEngineInstance;
  callSpawner = callSpawnerInstance;
}

function tick() {
  currentTick++;
//   console.log("TICK:", currentTick);

  callSpawner.processTick(currentTick);
  callEngine.processTick(currentTick);
}

function startClock() {
  if (intervalRef) return;
  intervalRef = setInterval(tick, 1000);
}

function getCurrentTick() {
  return currentTick;
}

module.exports = {
  initTickEngine,
  startClock,
  getCurrentTick
};
