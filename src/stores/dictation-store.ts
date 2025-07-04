import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  DictationConfig,
  DictationState,
  DictationStats,
  AudioSettings,
  AudioPlayItem,
  DictationDuration,
  PlayedAudioRecord
} from '@/types/dictation';
import { KanaCategory } from '@/types/kana';
import { STORAGE_KEYS } from '@/constants/app';
import { getKanaByCategory, shuffleArray, getKanaAudioUrl } from '@/utils/kana-utils';
interface DictationStore {
  config: DictationConfig;
  state: DictationState;
  stats: DictationStats;
  playlist: AudioPlayItem[];
  currentItem: AudioPlayItem | null;
  updateConfig: (config: Partial<DictationConfig>) => void;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  startDictation: () => void;
  pauseDictation: () => void;
  resumeDictation: () => void;
  stopDictation: () => void;
  nextAudio: () => void;
  previousAudio: () => void;
  updateTimer: () => void;
  generatePlaylist: () => void;
  recordAudioPlayed: (audioItem: AudioPlayItem, repeatCount: number) => void;
  updateCurrentRepeat: (repeat: number) => void;
  resetConfig: () => void;
  resetStats: () => void;
}
const defaultAudioSettings: AudioSettings = {
  volume: 0.8,
  playbackRate: 1.0,
  intervalTime: 2,
  repeatCount: 3
};
const defaultConfig: DictationConfig = {
  selectedCategories: [KanaCategory.SEION],
  duration: 5,
  audioSettings: defaultAudioSettings
};
const defaultState: DictationState = {
  isActive: false,
  isPaused: false,
  currentAudioIndex: 0,
  totalAudios: 0,
  remainingTime: 0,
  playedCount: 0,
  currentRepeat: 0
};
const defaultStats: DictationStats = {
  totalPlayed: 0,
  sessionDuration: 0,
  categoriesUsed: [],
  startTime: new Date(),
  playedAudios: []
};
export const useDictationStore = create<DictationStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      state: defaultState,
      stats: defaultStats,
      playlist: [],
      currentItem: null,
      updateConfig: (newConfig) => {
        set(state => ({
          config: { ...state.config, ...newConfig }
        }));
      },
      updateAudioSettings: (settings) => {
        set(state => ({
          config: {
            ...state.config,
            audioSettings: { ...state.config.audioSettings, ...settings }
          }
        }));
      },
      generatePlaylist: () => {
        const { config } = get();
        const allKana = config.selectedCategories.flatMap(category => 
          getKanaByCategory(category)
        );
        const playlist: AudioPlayItem[] = shuffleArray(allKana).map((kana, index) => ({
          id: `audio-${index}`,
          kanaId: kana.id,
          audioUrl: getKanaAudioUrl(kana),
          category: kana.category,
          hiragana: kana.hiragana,
          katakana: kana.katakana,
          romaji: kana.romaji
        }));
        set({
          playlist,
          state: {
            ...get().state,
            totalAudios: playlist.length,
            currentAudioIndex: 0
          },
          currentItem: playlist[0] || null
        });
      },
      startDictation: () => {
        const { config } = get();
        get().generatePlaylist();
        set({
          state: {
            ...defaultState,
            isActive: true,
            remainingTime: config.duration * 60,
            totalAudios: get().playlist.length
          },
          stats: {
            ...defaultStats,
            startTime: new Date(),
            categoriesUsed: config.selectedCategories,
            playedAudios: []
          }
        });
      },
      pauseDictation: () => {
        set(state => ({
          state: { ...state.state, isPaused: true }
        }));
      },
      resumeDictation: () => {
        set(state => ({
          state: { ...state.state, isPaused: false }
        }));
      },
      stopDictation: () => {
        const currentStats = get().stats;
        const startTime = currentStats.startTime;
        const endTime = new Date();
        const sessionDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        set({
          state: defaultState,
          stats: {
            ...currentStats,
            endTime,
            sessionDuration
          },
          currentItem: null
        });
      },
      nextAudio: () => {
        const { state, playlist } = get();
        const nextIndex = state.currentAudioIndex + 1;
        console.log('nextAudio called, current index:', state.currentAudioIndex, 'next index:', nextIndex, 'playlist length:', playlist.length);
        if (nextIndex < playlist.length) {
          console.log('Moving to next audio:', playlist[nextIndex]?.romaji);
          set({
            state: {
              ...state,
              currentAudioIndex: nextIndex,
              playedCount: state.playedCount + 1,
              currentRepeat: 0
            },
            currentItem: playlist[nextIndex] || null
          });
        } else {
          console.log('All audios completed, stopping dictation');
          const currentStats = get().stats;
          const startTime = currentStats.startTime;
          const endTime = new Date();
          const sessionDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
          set({
            state: {
              ...get().state,
              isActive: false,
              remainingTime: 0
            },
            stats: {
              ...currentStats,
              endTime,
              sessionDuration
            }
          });
        }
      },
      previousAudio: () => {
        const { state, playlist } = get();
        const prevIndex = state.currentAudioIndex > 0 
          ? state.currentAudioIndex - 1 
          : playlist.length - 1;
        set({
          state: {
            ...state,
            currentAudioIndex: prevIndex,
            currentRepeat: 0
          },
          currentItem: playlist[prevIndex] || null
        });
      },
      updateTimer: () => {
        const { state } = get();
        if (state.isActive && !state.isPaused && state.remainingTime > 0) {
          set(prevState => ({
            state: {
              ...prevState.state,
              remainingTime: prevState.state.remainingTime - 1
            }
          }));
          if (state.remainingTime <= 1) {
            get().stopDictation();
          }
        }
      },
      resetConfig: () => {
        set({ config: defaultConfig });
      },
      recordAudioPlayed: (audioItem, repeatCount) => {
        const record: PlayedAudioRecord = {
          kanaId: audioItem.kanaId,
          hiragana: audioItem.hiragana,
          katakana: audioItem.katakana,
          romaji: audioItem.romaji,
          category: audioItem.category,
          playedAt: new Date(),
          repeatCount
        };
        set(state => ({
          stats: {
            ...state.stats,
            totalPlayed: state.stats.totalPlayed + 1,
            playedAudios: [...state.stats.playedAudios, record]
          }
        }));
      },
      updateCurrentRepeat: (repeat) => {
        set(state => ({
          state: {
            ...state.state,
            currentRepeat: repeat
          }
        }));
      },
      resetStats: () => {
        set({ stats: defaultStats });
      }
    }),
    {
      name: STORAGE_KEYS.USER_SETTINGS + '-dictation',
      partialize: (state) => ({ 
        config: state.config,
        stats: state.stats 
      })
    }
  )
);
export const useDictationConfig = () => useDictationStore(state => state.config);
export const useDictationState = () => useDictationStore(state => state.state);
export const useDictationStats = () => useDictationStore(state => state.stats);
export const useDictationPlaylist = () => useDictationStore(state => state.playlist);
export const useCurrentAudioItem = () => useDictationStore(state => state.currentItem);
