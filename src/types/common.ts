import React from 'react';
import { KanaCategory } from './kana';
export type Locale = 'en' | 'zh';
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  success: boolean;
}
export interface UserSettings {
  language: Locale;
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  animationsEnabled: boolean;
  autoPlay: boolean;
  practiceMode: 'recognition' | 'writing' | 'mixed';
  selectedCategories: KanaCategory[];
}
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type CardState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';
