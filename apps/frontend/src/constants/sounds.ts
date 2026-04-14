import type { HowlOptions } from "howler";
import awpSound from "../assets/sounds/awp.mp3";
import quackSound from "../assets/sounds/quack.mp3";

export const SOUND_CONFIG: Record<string, HowlOptions> = {
  quack: {
    src: [quackSound],
  },
  awp: {
    src: [awpSound],
  },
};
