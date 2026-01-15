module.exports = {
  TICK_INTERVAL_MS: 1000, // 1 tick = 1 second

  CALL_RATE_PER_TICK: 0.5, // average calls per tick

  PICKUP_DELAY_TICKS: {
    MIN: 2,
    MAX: 6
  },

  CALL_DURATION_TICKS: {
    MIN: 5,
    MAX: 15
  },

  PICKUP_PROBABILITY: 0.7,

  AGENT_COUNT: 3
};
