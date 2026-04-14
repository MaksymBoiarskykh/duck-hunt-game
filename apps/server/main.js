const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createRoundManager } = require("./roundManager");
const { registerSocketHandlers } = require("./socketHandlers");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
      : true,
  },
});

const PORT = Number(process.env.PORT) || 3001;
const roundManager = createRoundManager(io);

registerSocketHandlers(io, roundManager);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const shutdown = (signal) => {
  console.log(`Received ${signal}, shutting down...`);

  roundManager.clearTimers();

  io.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });

  setTimeout(() => {
    process.exit(0);
  }, 1000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
