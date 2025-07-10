import { KanaCharacter } from '@/types/kana';
import { getKanaAudioUrl } from '@/utils/kana-utils';
import { perfMonitor } from '@/utils/performance-monitor';

/**
 * 音频服务 - 提供高效的音频管理和播放功能
 */
class AudioService {
  private cache = new Map<string, HTMLAudioElement>();
  private loadingPromises = new Map<string, Promise<HTMLAudioElement>>();
  private preloadQueue: string[] = [];
  private isPreloading = false;
  private maxCacheSize = 50; // 最大缓存数量
  private preloadConcurrency = 2; // 预加载并发数

  /**
   * 播放音频
   */
  async playAudio(character: KanaCharacter): Promise<void> {
    const url = getKanaAudioUrl(character);
    perfMonitor.start(`audio-play-${character.romaji}`);

    try {
      const audio = await this.getAudio(url);
      audio.currentTime = 0;
      await audio.play();
      perfMonitor.end(`audio-play-${character.romaji}`);
    } catch (error) {
      perfMonitor.end(`audio-play-${character.romaji}`);
      console.warn(`Failed to play audio for ${character.romaji}:`, error);
      // 静默失败，不影响用户体验
    }
  }

  /**
   * 预加载音频（智能队列管理）
   */
  preloadAudios(characters: KanaCharacter[]): void {
    const urls = characters.map(char => getKanaAudioUrl(char));
    
    // 过滤已缓存的音频
    const newUrls = urls.filter(url => !this.cache.has(url) && !this.loadingPromises.has(url));
    
    // 添加到预加载队列
    this.preloadQueue.push(...newUrls);
    
    // 开始预加载
    this.processPreloadQueue();
  }

  /**
   * 获取音频（带缓存）
   */
  private async getAudio(url: string): Promise<HTMLAudioElement> {
    // 检查缓存
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // 检查是否正在加载
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    // 开始加载
    const loadPromise = this.loadAudio(url);
    this.loadingPromises.set(url, loadPromise);

    try {
      const audio = await loadPromise;
      this.addToCache(url, audio);
      this.loadingPromises.delete(url);
      return audio;
    } catch (error) {
      this.loadingPromises.delete(url);
      throw error;
    }
  }

  /**
   * 加载单个音频文件
   */
  private loadAudio(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';

      const cleanup = () => {
        audio.removeEventListener('canplaythrough', onSuccess);
        audio.removeEventListener('loadeddata', onSuccess);
        audio.removeEventListener('error', onError);
      };

      const onSuccess = () => {
        cleanup();
        resolve(audio);
      };

      const onError = () => {
        cleanup();
        reject(new Error(`Failed to load audio: ${url}`));
      };

      // 监听多个事件以提高成功率
      audio.addEventListener('canplaythrough', onSuccess);
      audio.addEventListener('loadeddata', onSuccess);
      audio.addEventListener('error', onError);

      // 设置超时
      setTimeout(() => {
        cleanup();
        reject(new Error(`Audio loading timeout: ${url}`));
      }, 3000);

      audio.src = url;
      audio.load();
    });
  }

  /**
   * 添加到缓存（带LRU管理）
   */
  private addToCache(url: string, audio: HTMLAudioElement): void {
    // 如果缓存已满，移除最旧的项
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(url, audio);
  }

  /**
   * 处理预加载队列
   */
  private async processPreloadQueue(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }

    this.isPreloading = true;

    try {
      while (this.preloadQueue.length > 0) {
        // 取出一批URL进行并发加载
        const batch = this.preloadQueue.splice(0, this.preloadConcurrency);
        
        // 并发加载这一批
        const promises = batch.map(async (url) => {
          try {
            await this.getAudio(url);
          } catch (error) {
            // 预加载失败不影响整体流程
            console.warn(`Preload failed for: ${url}`);
          }
        });

        await Promise.all(promises);

        // 小延迟，避免阻塞主线程
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } finally {
      this.isPreloading = false;
    }
  }

  /**
   * 清理缓存
   */
  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
    this.preloadQueue.length = 0;
  }

  /**
   * 获取缓存状态
   */
  getCacheInfo(): { size: number; maxSize: number; queueLength: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      queueLength: this.preloadQueue.length
    };
  }
}

// 导出单例实例
export const audioService = new AudioService();
