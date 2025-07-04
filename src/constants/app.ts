import { Locale, UserSettings } from '@/types/common';
import { KanaCategory } from '@/types/kana';

export const APP_INFO = {
  name: 'Just Gojuon',
  version: '1.0.0',
  description: {
    en: 'Learn Japanese Hiragana and Katakana with fun and interactive exercises',
    zh: '通过有趣的互动练习学习50音'
  },
  author: 'Levon',
  repository: 'https://github.com/veardk/just-gojuon'
} as const;

export const DEFAULT_SETTINGS: UserSettings = {
  language: 'en' as Locale,
  theme: 'light',
  soundEnabled: true,
  animationsEnabled: true,
  autoPlay: false,
  practiceMode: 'recognition',
  selectedCategories: [KanaCategory.SEION]
};

export const STORAGE_KEYS = {
  USER_SETTINGS: 'just-gojuon-settings',
  PRACTICE_CONFIG: 'just-gojuon-practice'
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  CARD_FLIP: 600,
  PAGE_TRANSITION: 400
} as const;

export const PRACTICE_CONFIG = {
  OPTIONS_COUNT: 4,
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 20,
  TIME_LIMIT: 30,
  STREAK_THRESHOLD: 5
} as const;

export const KANA_COUNTS = {
  SEION: 46,
  DAKUON: 20,
  HANDAKUON: 5,
  YOON: 33
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080
} as const;
