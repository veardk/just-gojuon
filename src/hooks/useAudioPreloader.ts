import { useEffect, useState } from 'react';
import { KanaCharacter } from '@/types/kana';
import { getKanaAudioUrl } from '@/utils/kana-utils';
import { audioCache } from '@/utils/audio-utils';

interface UseAudioPreloaderOptions {
  enabled?: boolean;
  characters?: KanaCharacter[];
}

export const useAudioPreloader = (options: UseAudioPreloaderOptions = {}) => {
  const { enabled = true, characters = [] } = options;
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
        // 预加载所有音频，但不等待全部完成
        const promises = urls.map(async (url, index) => {
          try {
            await audioCache.getAudio(url);
            setLoadedCount(prev => prev + 1);
          } catch (error) {
            console.warn(`Failed to preload audio: ${url}`, error);
            setLoadedCount(prev => prev + 1); // 即使失败也要增加计数
          }
        });

        await Promise.all(promises);
        console.log(`Audio preloading completed: ${urls.length} files processed`);
      } catch (error) {
        console.error('Audio preloading failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadAudios();
  }, [enabled, characters]);

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
