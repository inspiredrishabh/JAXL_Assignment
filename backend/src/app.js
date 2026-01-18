const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

module.exports = app;
