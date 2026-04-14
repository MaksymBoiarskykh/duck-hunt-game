import { useCallback, useContext, useEffect, useState } from "react";
import { ROUND_STATES, SOCKET_EVENTS } from "../constants";
import SocketContext from "../providers/SocketProvider/SocketContext";
import type {
  RoundScorePayload,
  RoundStartPayload,
  RoundState,
  Score,
} from "../types";

export type { RoundState } from "../types";

export function useGameRound() {
  const { socket } = useContext(SocketContext);
  const [roundId, setRoundId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [flightVariant, setFlightVariant] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [state, setState] = useState<RoundState>(ROUND_STATES.LOADING);
  const [score, setScore] = useState<Score | null>(null);

  const onHit = useCallback(() => {
    socket?.emit(SOCKET_EVENTS.ROUND_WIN_ACTION, { roundId });
  }, [roundId, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleRoundStart = (payload: RoundStartPayload) => {
      setRoundId(payload.id);
      setFlightVariant(payload.variant);
      setScore(payload.score);
      setDuration(payload.durationMs);
      setStartedAt(payload.startedAt);
      setState(ROUND_STATES.RUNNING);
    };

    const handleRoundWin = (payload: RoundScorePayload) => {
      setState(ROUND_STATES.WIN);
      setScore(payload.score);
    };

    const handleRoundEnd = (payload: RoundScorePayload) => {
      setRoundId(null);
      setStartedAt(null);
      setDuration(0);
      setState(ROUND_STATES.FINISHED);
      setScore(payload.score);
    };

    socket.on(SOCKET_EVENTS.ROUND_START, handleRoundStart);
    socket.on(SOCKET_EVENTS.ROUND_WIN, handleRoundWin);
    socket.on(SOCKET_EVENTS.ROUND_END, handleRoundEnd);

    return () => {
      socket.off(SOCKET_EVENTS.ROUND_START, handleRoundStart);
      socket.off(SOCKET_EVENTS.ROUND_WIN, handleRoundWin);
      socket.off(SOCKET_EVENTS.ROUND_END, handleRoundEnd);
    };
  }, [socket]);

  return {
    state,
    score,
    duration,
    flightVariant,
    startedAt,
    onHit,
  };
}
