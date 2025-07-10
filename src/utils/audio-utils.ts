import { KanaCharacter } from '@/types/kana';
export const getAudioUrl = (character: KanaCharacter): string => {
  const basePath = process.env.NODE_ENV === 'production' ? '/just-gojuon' : '';
  return `${basePath}/sounds/${character.romaji}.mp3`;
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
  const basePath = process.env.NODE_ENV === 'production' ? '/just-gojuon' : '';
  return `${basePath}/sounds/generated/${text}.mp3`;
};

// 全局音频缓存
class AudioCache {
  private cache: Map<string, HTMLAudioElement> = new Map();
  private loadingPromises: Map<string, Promise<HTMLAudioElement>> = new Map();

  async getAudio(url: string): Promise<HTMLAudioElement> {
    // 如果已经缓存，直接返回
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // 如果正在加载，等待加载完成
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    // 开始加载音频
    const loadPromise = this.loadAudio(url);
    this.loadingPromises.set(url, loadPromise);

    try {
      const audio = await loadPromise;
      this.cache.set(url, audio);
      this.loadingPromises.delete(url);
      return audio;
    } catch (error) {
      this.loadingPromises.delete(url);
      throw error;
    }
  }

  private loadAudio(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';

      const onCanPlay = () => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('loadeddata', onLoadedData);
        resolve(audio);
      };

      const onLoadedData = () => {
        // 如果 canplaythrough 没有触发，但 loadeddata 触发了，也认为加载成功
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('loadeddata', onLoadedData);
        resolve(audio);
      };

      const onError = (e: Event) => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('loadeddata', onLoadedData);
        console.error(`Audio load error for ${url}:`, e);
        reject(new Error(`Failed to load audio: ${url}`));
      };

      audio.addEventListener('canplaythrough', onCanPlay);
      audio.addEventListener('loadeddata', onLoadedData);
      audio.addEventListener('error', onError);
      audio.src = url;
      audio.load();

      // 添加超时处理，避免无限等待
      setTimeout(() => {
        if (!this.cache.has(url)) {
          console.warn(`Audio loading timeout for: ${url}`);
          onError(new Event('timeout'));
        }
      }, 10000); // 10秒超时
    });
  }

  async preloadAudios(urls: string[]): Promise<void> {
    const promises = urls.map(async (url) => {
      try {
        await this.getAudio(url);
        console.log(`Successfully preloaded: ${url}`);
      } catch (error) {
        console.warn(`Failed to preload audio: ${url}`, error);
        // 不抛出错误，继续加载其他音频
      }
    });
    await Promise.all(promises);
  }

  async playAudio(url: string, onEnded?: () => void): Promise<void> {
    try {
      const audio = await this.getAudio(url);
      // 重置播放位置
      audio.currentTime = 0;

      // 如果提供了结束回调，添加事件监听器
      if (onEnded) {
        const handleEnded = () => {
          audio.removeEventListener('ended', handleEnded);
          onEnded();
        };
        audio.addEventListener('ended', handleEnded);
      }

      await audio.play();
    } catch (error) {
      console.error('Failed to play audio:', url, error);
      throw error;
    }
  }

  clear(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

// 全局音频缓存实例
export const audioCache = new AudioCache();
export const convertAudioFormat = async (
  inputUrl: string, 
  outputFormat: 'mp3' | 'wav' | 'ogg'
): Promise<string> => {
  console.log(`Converting ${inputUrl} to ${outputFormat}`);
  return inputUrl.replace(/\.[^.]+$/, `.${outputFormat}`);
};
