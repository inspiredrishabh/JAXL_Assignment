import { useEffect, useState } from "react";

function App() {
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "STATE_UPDATE") {
        setState(data.payload);
      }
    };

    return () => ws.close();
  }, []);

  if (!state || !connected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-700 mx-auto mb-4"></div>
          <p className="text-gray-700 text-sm font-medium">
            {connected ? "Loading..." : "Connecting..."}
          </p>
        </div>
      </div>
    );
  }

  const agentStats = {
    total: state.agents.length,
    available: state.agents.filter((a) => a.state === "AVAILABLE").length,
    busy: state.agents.filter((a) => a.state === "BUSY").length,
  };

  const callStats = {
    dialing: state.calls.filter((c) => c.state === "DIALING").length,
    queued: state.calls.filter((c) => c.state === "QUEUED").length,
    connected: state.calls.filter((c) => c.state === "CONNECTED").length,
    completed: state.calls.filter((c) => c.state === "COMPLETED").length,
  };

  // Sort calls: DIALING > CONNECTED > QUEUED > COMPLETED
  const sortedCalls = [...state.calls].sort((a, b) => {
    const stateOrder = { DIALING: 0, CONNECTED: 1, QUEUED: 2, COMPLETED: 3 };
    return (stateOrder[a.state] || 999) - (stateOrder[b.state] || 999);
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Title */}
        <div className="mb-8 sm:mb-10 pb-4 sm:pb-6 border-b border-gray-300">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Assignment for JAXL Innovations
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-3">
            System Clock :{" "}
            <span className="font-semibold text-gray-800">
              {String(state.tick).padStart(5, "0")}
            </span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10">
          <div className="bg-gray-800 text-white rounded-lg p-4 sm:p-6 border border-gray-700 shadow-lg">
            <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
              Available
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 sm:mt-4">
              {agentStats.available}
            </p>
            <p className="text-gray-400 text-xs mt-2 sm:mt-3">
              of {agentStats.total}
            </p>
          </div>

          <div className="bg-white border-2 border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg">
            <p className="text-gray-800 text-xs font-semibold uppercase tracking-wider">
              Busy
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mt-3 sm:mt-4">
              {agentStats.busy}
            </p>
          </div>

          <div className="bg-white border-2 border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg">
            <p className="text-gray-800 text-xs font-semibold uppercase tracking-wider">
              Queue
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mt-3 sm:mt-4">
              {state.queueLength}
            </p>
          </div>

          <div className="bg-gray-800 text-white rounded-lg p-4 sm:p-6 border border-gray-700 shadow-lg">
            <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
              Connected
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 sm:mt-4">
              {callStats.connected}
            </p>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Agents Section */}
          <section className="border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 sm:p-6 bg-gray-800 text-white">
              <h2 className="text-base sm:text-lg font-bold">
                Agents ({agentStats.total})
              </h2>
            </div>

            <div className="p-3 sm:p-4 space-y-2 max-h-96 overflow-y-auto bg-white">
              {state.agents.length === 0 ? (
                <p className="text-gray-500 text-sm py-6 text-center">
                  No agents
                </p>
              ) : (
                state.agents.map((agent) => (
                  <div
                    key={agent.agentId}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                        {agent.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {agent.agentId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-2 sm:ml-3 shrink-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          agent.state === "AVAILABLE"
                            ? "bg-gray-700"
                            : "bg-gray-400"
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded whitespace-nowrap text-center ${
                          agent.state === "AVAILABLE"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-300 text-gray-800"
                        }`}
                      >
                        {agent.state === "AVAILABLE" ? "Available" : "Busy"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Dialing Calls */}
          <section className="border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 sm:p-6 bg-gray-800 text-white">
              <h2 className="text-base sm:text-lg font-bold">
                Dialing ({callStats.dialing})
              </h2>
            </div>

            <div className="p-3 sm:p-4 space-y-2 max-h-96 overflow-y-auto bg-white">
              {sortedCalls.filter((c) => c.state === "DIALING").length === 0 ? (
                <p className="text-gray-500 text-sm py-6 text-center">—</p>
              ) : (
                sortedCalls
                  .filter((c) => c.state === "DIALING")
                  .map((call) => (
                    <div
                      key={call.callId}
                      className="flex items-center justify-between p-2 sm:p-3 bg-gray-100 border-l-4 border-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">
                        {call.callId}
                      </p>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-700 ml-2 animate-pulse"></div>
                    </div>
                  ))
              )}
            </div>
          </section>

          {/* Active Calls */}
          <section className="border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 sm:p-6 bg-gray-800 text-white">
              <h2 className="text-base sm:text-lg font-bold">
                Connected ({callStats.connected})
              </h2>
            </div>

            <div className="p-3 sm:p-4 space-y-2 max-h-96 overflow-y-auto bg-white">
              {sortedCalls.filter((c) => c.state === "CONNECTED").length ===
              0 ? (
                <p className="text-gray-500 text-sm py-6 text-center">—</p>
              ) : (
                sortedCalls
                  .filter((c) => c.state === "CONNECTED")
                  .map((call) => (
                    <div
                      key={call.callId}
                      className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 border border-gray-700 rounded hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">
                          {call.callId}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Agent: {call.agentId}
                        </p>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-700 ml-2 shrink-0"></div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>

        {/* Queued & Completed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <section className="border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 sm:p-6 bg-gray-800 text-white">
              <h2 className="text-base sm:text-lg font-bold">
                Queued ({callStats.queued})
              </h2>
            </div>

            <div className="p-3 sm:p-4 space-y-2 max-h-56 overflow-y-auto bg-white">
              {sortedCalls.filter((c) => c.state === "QUEUED").length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">—</p>
              ) : (
                sortedCalls
                  .filter((c) => c.state === "QUEUED")
                  .map((call) => (
                    <div
                      key={call.callId}
                      className="flex items-center justify-between p-2 sm:p-3 bg-gray-100 border-l-4 border-gray-600 rounded hover:bg-gray-200 transition-colors"
                    >
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">
                        {call.callId}
                      </p>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-600 ml-2"></div>
                    </div>
                  ))
              )}
            </div>
          </section>

          <section className="border-2 border-gray-500 rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 sm:p-6 bg-gray-700 text-white">
              <h2 className="text-base sm:text-lg font-bold">
                Completed ({callStats.completed})
              </h2>
            </div>

            <div className="p-3 sm:p-4 space-y-2 max-h-56 overflow-y-auto bg-gray-50">
              {sortedCalls.filter((c) => c.state === "COMPLETED").length ===
              0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">—</p>
              ) : (
                sortedCalls
                  .filter((c) => c.state === "COMPLETED")
                  .map((call) => (
                    <div
                      key={call.callId}
                      className="flex items-center justify-between p-2 sm:p-3 bg-gray-200 border border-gray-400 rounded opacity-70"
                    >
                      <p className="text-xs sm:text-sm text-gray-700">
                        {call.callId}
                      </p>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-600 ml-2"></div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
