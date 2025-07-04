import { KanaCategory } from './kana';
export type DictationDuration = 1 | 3 | 5 | 10 | 15 | 30 | 60;
export interface AudioSettings {
  volume: number;           
  playbackRate: number;     
  intervalTime: number;     
  repeatCount: number;      
}
export interface DictationConfig {
  selectedCategories: KanaCategory[];
  duration: DictationDuration;
  audioSettings: AudioSettings;
}
export interface DictationState {
  isActive: boolean;
  isPaused: boolean;
  currentAudioIndex: number;
  totalAudios: number;
  remainingTime: number;    
  playedCount: number;      
  currentRepeat: number;    
}
export interface PlayedAudioRecord {
  kanaId: string;
  hiragana: string;
  katakana: string;
  romaji: string;
  category: KanaCategory;
  playedAt: Date;
  repeatCount: number;
}
export interface DictationStats {
  totalPlayed: number;
  sessionDuration: number;  
  categoriesUsed: KanaCategory[];
  startTime: Date;
  endTime?: Date;
  playedAudios: PlayedAudioRecord[];  
}
export interface AudioPlayItem {
  id: string;
  kanaId: string;
  audioUrl: string;
  category: KanaCategory;
  hiragana: string;
  katakana: string;
  romaji: string;
}
