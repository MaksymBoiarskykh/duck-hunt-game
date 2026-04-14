import { Howl, Howler } from "howler";
import { SOUND_CONFIG } from "../constants";

type SoundKey = keyof typeof SOUND_CONFIG;

class SoundManager {
  private sounds: Record<SoundKey, Howl>;

  constructor() {
    this.sounds = Object.fromEntries(
      Object.entries(SOUND_CONFIG).map(([key, config]) => [
        key,
        new Howl({
          ...config,
          preload: true,
        }),
      ]),
    ) as Record<SoundKey, Howl>;
  }

  play(key: SoundKey) {
    this.sounds[key].play();
  }

  stop(key: SoundKey) {
    this.sounds[key].stop();
  }

  mute(isMuted: boolean) {
    Howler.mute(isMuted);
  }
}

export const sound = new SoundManager();
