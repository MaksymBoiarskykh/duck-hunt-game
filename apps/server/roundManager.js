const crypto = require("crypto");

const ROUND_DURATION_MS = 5000;
const ROUND_WIN_DURATION_MS = 3000;
const ROUND_INTERVAL_MS = 10000;

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function createRoundManager(io) {
  const score = {
    rounds: 0,
    winRounds: 0,
  };

  let activeRound = null;

  let startRoundTimeout = null;
  let finishRoundTimeout = null;

  const hasConnectedClients = () => io.engine.clientsCount > 0;

  const createRound = () => {
    return {
      score,
      id: crypto.randomUUID(),
      startedAt: Date.now(),
      variant: randomBetween(0, 4),
      status: "running",
      durationMs: ROUND_DURATION_MS,
    };
  };

  const startRound = () => {
    if (activeRound || !hasConnectedClients()) return;

    score.rounds += 1;
    activeRound = createRound();

    io.emit("round:start", activeRound);

    startRoundTimeout = setTimeout(() => {
      startRoundTimeout = null;
      startRound();
    }, ROUND_INTERVAL_MS);

    finishRoundTimeout = setTimeout(() => {
      finishRound();
      finishRoundTimeout = null;
    }, ROUND_DURATION_MS);
  };

  const finishRound = () => {
    if (!activeRound) return;

    io.emit("round:end", { score });

    activeRound = null;
  };

  const handleWinAction = (payload) => {
    if (!activeRound || activeRound.id !== payload?.roundId) return;
    if (activeRound.status === "win") return;

    activeRound.status = "win";
    score.winRounds += 1;

    io.emit("round:win", { score });

    clearTimeout(finishRoundTimeout);

    finishRoundTimeout = setTimeout(() => {
      finishRound();
      finishRoundTimeout = null;
    }, ROUND_WIN_DURATION_MS);
  };

  const handleClientConnected = (socket) => {
    if (!activeRound && !startRoundTimeout) {
      startRound();

      return;
    }

    if (!activeRound || activeRound.status === "win") {
      socket.emit("round:end", { score });

      return;
    }

    socket.emit("round:start", activeRound);
  };

  const clearTimers = () => {
    clearTimeout(startRoundTimeout);
    clearTimeout(finishRoundTimeout);
    startRoundTimeout = null;
    finishRoundTimeout = null;
  };

  return {
    clearTimers,
    handleClientConnected,
    handleWinAction,
    startRound,
  };
}

module.exports = {
  createRoundManager,
};
