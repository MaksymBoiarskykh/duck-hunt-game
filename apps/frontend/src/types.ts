import { ROUND_STATES } from "./constants";

export type Score = {
  rounds: number;
  winRounds: number;
};

export type RoundState = (typeof ROUND_STATES)[keyof typeof ROUND_STATES];

export type RoundStartPayload = {
  score: Score;
  durationMs: number;
  id: string;
  startedAt: number;
  variant: number;
};

export type RoundScorePayload = {
  score: Score;
};

export type RoundWinActionPayload = {
  roundId: string | null;
};
