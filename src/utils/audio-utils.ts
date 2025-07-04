import { KanaCharacter } from '@/types/kana';
export const getAudioUrl = (character: KanaCharacter): string => {
  return `/sounds/${character.romaji}.mp3`;
};
export const checkAudioExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
export const preloadAudio = (url: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener('canplaythrough', () => {
      resolve(audio);
    });
    audio.addEventListener('error', () => {
      reject(new Error(`Failed to load audio: ${url}`));
    });
    audio.src = url;
    audio.load();
  });
};
export const playAudio = async (
  audio: HTMLAudioElement,
  volume: number = 1,
  playbackRate: number = 1
): Promise<void> => {
  audio.volume = Math.max(0, Math.min(1, volume));
  audio.playbackRate = Math.max(0.25, Math.min(4, playbackRate));
  try {
    await audio.play();
  } catch (error) {
    console.error('Audio play failed:', error);
    throw error;
  }
};
export const stopAudio = (audio: HTMLAudioElement): void => {
  audio.pause();
  audio.currentTime = 0;
};
export class AudioPlayer {
  private audio: HTMLAudioElement;
  private isLoaded: boolean = false;
  constructor(src: string) {
    this.audio = new Audio(src);
    this.audio.preload = 'auto';
  }
  async load(): Promise<void> {
    if (this.isLoaded) return;
    return new Promise((resolve, reject) => {
      this.audio.addEventListener('canplaythrough', () => {
        this.isLoaded = true;
        resolve();
      }, { once: true });
      this.audio.addEventListener('error', () => {
        reject(new Error(`Failed to load audio: ${this.audio.src}`));
      }, { once: true });
      this.audio.load();
    });
  }
  async play(volume: number = 1, playbackRate: number = 1): Promise<void> {
    if (!this.isLoaded) {
      await this.load();
    }
    this.audio.volume = Math.max(0, Math.min(1, volume));
    this.audio.playbackRate = Math.max(0.25, Math.min(4, playbackRate));
    return this.audio.play();
  }
  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
  pause(): void {
    this.audio.pause();
  }
  resume(): void {
    if (this.audio.paused) {
      this.audio.play();
    }
  }
  get duration(): number {
    return this.audio.duration || 0;
  }
  get currentTime(): number {
    return this.audio.currentTime;
  }
  set currentTime(time: number) {
    this.audio.currentTime = time;
  }
  get paused(): boolean {
    return this.audio.paused;
  }
  get ended(): boolean {
    return this.audio.ended;
  }
  addEventListener(event: string, handler: EventListener): void {
    this.audio.addEventListener(event, handler);
  }
  removeEventListener(event: string, handler: EventListener): void {
    this.audio.removeEventListener(event, handler);
  }
}
export const preloadAudioBatch = async (urls: string[]): Promise<AudioPlayer[]> => {
  const players = urls.map(url => new AudioPlayer(url));
  await Promise.all(players.map(player => player.load()));
  return players;
};
export const generateTTSAudio = async (text: string, language: string = 'ja-JP'): Promise<string> => {
  console.log(`Generating TTS audio for: ${text} in ${language}`);
  return `/sounds/generated/${text}.mp3`;
};
export const convertAudioFormat = async (
  inputUrl: string, 
  outputFormat: 'mp3' | 'wav' | 'ogg'
): Promise<string> => {
  console.log(`Converting ${inputUrl} to ${outputFormat}`);
  return inputUrl.replace(/\.[^.]+$/, `.${outputFormat}`);
};
