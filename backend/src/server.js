const http = require("http");
const WebSocket = require("ws");
const app = require("./app");
const { startClock } = require("./tick/clock");

const PORT = process.env.PORT || 4000;

// HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.send(
    JSON.stringify({
      type: "WELCOME",
      message: "Connected to Call Routing System"
    })
  );
});

// Start tick clock
startClock();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
