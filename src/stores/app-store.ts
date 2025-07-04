import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Locale, UserSettings } from '@/types/common';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/constants/app';
import { KanaCategory } from '@/types/kana';
interface AppState {
  settings: UserSettings;
  isLoading: boolean;
  isSidebarOpen: boolean;
  currentPage: string;
  updateSettings: (settings: Partial<UserSettings>) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  toggleAnimations: () => void;
  updateSelectedCategories: (categories: KanaCategory[]) => void;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  resetSettings: () => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      isSidebarOpen: false,
      currentPage: 'home',
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      toggleLanguage: () => {
        set(state => ({
          settings: {
            ...state.settings,
            language: state.settings.language === 'en' ? 'zh' : 'en'
          }
        }));
      },
      toggleTheme: () => {
        set(state => ({
          settings: {
            ...state.settings,
            theme: state.settings.theme === 'light' ? 'dark' : 'light'
          }
        }));
      },
      toggleSound: () => {
        set(state => ({
          settings: {
            ...state.settings,
            soundEnabled: !state.settings.soundEnabled
          }
        }));
      },
      toggleAnimations: () => {
        set(state => ({
          settings: {
            ...state.settings,
            animationsEnabled: !state.settings.animationsEnabled
          }
        }));
      },
      updateSelectedCategories: (categories) => {
        set(state => ({
          settings: {
            ...state.settings,
            selectedCategories: categories
          }
        }));
      },
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      toggleSidebar: () => {
        set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
      setCurrentPage: (page) => {
        set({ currentPage: page });
      },
      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
      }
    }),
    {
      name: STORAGE_KEYS.USER_SETTINGS,
      partialize: (state) => ({ settings: state.settings })
    }
  )
);
export const useSettings = () => useAppStore(state => state.settings);
export const useLanguage = () => useAppStore(state => state.settings.language);
export const useTheme = () => useAppStore(state => state.settings.theme);
export const useIsLoading = () => useAppStore(state => state.isLoading);
export const useIsSidebarOpen = () => useAppStore(state => state.isSidebarOpen);
export const useCurrentPage = () => useAppStore(state => state.currentPage);
