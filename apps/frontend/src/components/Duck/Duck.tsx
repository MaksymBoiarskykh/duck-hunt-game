import { useEffect, useState, type CSSProperties } from "react";
import styles from "./Duck.module.scss";
import { sound } from "../../utils/soundManager";
import { FLIGHT_VARIANTS } from "../../constants";

type DuckProps = {
  onClick: () => void;
  isHitted: boolean;
  flightVariant: number;
  flightDuration: number;
  startedAt: number;
};

const Duck = ({
  onClick,
  isHitted,
  flightDuration,
  flightVariant,
  startedAt,
}: DuckProps) => {
  const variant = FLIGHT_VARIANTS[flightVariant] || FLIGHT_VARIANTS[0];
  const [animationDelay, setAnimationDelay] = useState(0);

  useEffect(() => {
    setAnimationDelay(Date.now() - startedAt);
  }, [startedAt]);

  useEffect(() => {
    const soundKey = isHitted ? "awp" : "quack";

    sound.play(soundKey);

    return () => {
      sound.stop(soundKey);
    };
  }, [isHitted]);

  const duckStyle = {
    "--start-x": `${variant.startX}%`,
    "--start-y": `${variant.startY}%`,
    "--mid-x": `${variant.midX}%`,
    "--mid-y": `${variant.midY}%`,
    "--end-x": `${variant.endX}%`,
    "--end-y": `${variant.endY}%`,
    "--flight-duration": `${flightDuration}ms`,
    "--animation-delay": `-${animationDelay}ms`,
    "--scale-x": `${variant.reversed ? -1 : 1}`,
  } as CSSProperties;

  return (
    <div
      className={`${styles.duck} ${isHitted ? styles["duck--hitted"] : ""} ${variant.reversed ? styles["duck--reversed"] : ""}`}
      onClick={onClick}
      style={duckStyle}
    >
      <div className={styles.duck__image} />
    </div>
  );
};

export default Duck;
