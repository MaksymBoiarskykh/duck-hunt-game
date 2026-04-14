function registerSocketHandlers(io, roundManager) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    roundManager.handleClientConnected(socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    socket.on("round:win-action", roundManager.handleWinAction);
  });
}

module.exports = {
  registerSocketHandlers,
};
