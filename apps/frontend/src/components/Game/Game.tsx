import { ROUND_STATES } from "../../constants";
import { useGameRound } from "../../hooks/useGameRound";
import Duck from "../Duck";
import styles from "./Game.module.scss";
import type { RoundState } from "../../types";

const stateDescription: Record<RoundState, string> = {
  [ROUND_STATES.LOADING]: "Loading...",
  [ROUND_STATES.RUNNING]: "Catch the duck",
  [ROUND_STATES.WIN]: "Win!",
  [ROUND_STATES.FINISHED]: "Wait for the beginning of a new round",
};

const Game = () => {
  const { onHit, state, duration, flightVariant, score, startedAt } =
    useGameRound();

  return (
    <section className={styles.game}>
      {score && (
        <div className={styles.game__score}>
          Score: {score.winRounds} / {score.rounds}
        </div>
      )}
      <div className={styles.game__description}>{stateDescription[state]}</div>
      {state !== ROUND_STATES.FINISHED && startedAt !== null && (
        <Duck
          flightVariant={flightVariant}
          flightDuration={duration}
          onClick={onHit}
          isHitted={state === ROUND_STATES.WIN}
          startedAt={startedAt}
        />
      )}
    </section>
  );
};

export default Game;
