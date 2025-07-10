import { useEffect, useState } from 'react';
import { KanaCharacter } from '@/types/kana';
import { getKanaAudioUrl } from '@/utils/kana-utils';
import { audioCache } from '@/utils/audio-utils';

interface UseAudioPreloaderOptions {
  enabled?: boolean;
  characters?: KanaCharacter[];
  maxConcurrent?: number; // 最大并发数
  priority?: 'immediate' | 'lazy'; // 预加载优先级
}

export const useAudioPreloader = (options: UseAudioPreloaderOptions = {}) => {
  const { enabled = true, characters = [], maxConcurrent = 3, priority = 'lazy' } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!enabled || characters.length === 0) return;

    const preloadAudios = async () => {
      setIsLoading(true);
      setLoadedCount(0);
      setTotalCount(characters.length);

      const urls = characters.map(char => getKanaAudioUrl(char));

      try {
        if (priority === 'lazy') {
          // 延迟预加载，避免阻塞页面加载
          setTimeout(async () => {
            await audioCache.preloadAudios(urls, maxConcurrent);
            setIsLoading(false);
          }, 1000); // 延迟1秒开始预加载
        } else {
          // 立即预加载
          await audioCache.preloadAudios(urls, maxConcurrent);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Audio preloading failed:', error);
        setIsLoading(false);
      }
    };

    preloadAudios();
  }, [enabled, characters, maxConcurrent, priority]);

  const playAudio = async (character: KanaCharacter): Promise<void> => {
    const url = getKanaAudioUrl(character);
    return audioCache.playAudio(url);
  };

  return {
    isLoading,
    loadedCount,
    totalCount,
    progress: totalCount > 0 ? (loadedCount / totalCount) * 100 : 0,
    playAudio
  };
};
