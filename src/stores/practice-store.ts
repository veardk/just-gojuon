import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { KanaCharacter, KanaCategory, KanaType, PracticeQuestion } from '@/types/kana';
import { STORAGE_KEYS } from '@/constants/app';
import { getKanaByCategory, generatePracticeOptions, shuffleArray } from '@/utils/kana-utils';
interface PracticeState {
  isActive: boolean;
  isPaused: boolean;
  currentQuestion: PracticeQuestion | null;
  questionIndex: number;
  totalQuestions: number;
  selectedCategories: KanaCategory[];
  practiceType: KanaType;
  questionCount: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  maxStreak: number;
  timeSpent: number; 
  startPractice: (config: {
    categories: KanaCategory[];
    type: KanaType;
    questionCount: number;
  }) => void;
  pausePractice: () => void;
  resumePractice: () => void;
  endPractice: () => void;
  submitAnswer: (answer: string) => boolean;
  nextQuestion: () => void;
  getPracticeQuestions: () => PracticeQuestion[];
}
export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      isActive: false,
      isPaused: false,
      currentQuestion: null,
      questionIndex: 0,
      totalQuestions: 0,
      selectedCategories: [KanaCategory.SEION],
      practiceType: KanaType.HIRAGANA,
      questionCount: 10,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      streak: 0,
      maxStreak: 0,
      timeSpent: 0,
      getPracticeQuestions: (): PracticeQuestion[] => {
        const { selectedCategories, questionCount } = get();
        const allKana = selectedCategories.flatMap(category => 
          getKanaByCategory(category)
        );
        if (allKana.length === 0) return [];
        const selectedKana = shuffleArray(allKana).slice(0, questionCount);
        return selectedKana.map((kana, index) => ({
          id: `question-${index}`,
          targetCharacter: kana,
          options: generatePracticeOptions(kana, allKana),
          questionType: 'recognition' as const,
          displayType: get().practiceType
        }));
      },
      startPractice: (config) => {
        const questions = get().getPracticeQuestions();
        set({
          isActive: true,
          isPaused: false,
          selectedCategories: config.categories,
          practiceType: config.type,
          questionCount: config.questionCount,
          totalQuestions: questions.length,
          questionIndex: 0,
          currentQuestion: questions[0] || null,
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          streak: 0,
          timeSpent: 0
        });
      },
      pausePractice: () => {
        set({ isPaused: true });
      },
      resumePractice: () => {
        set({ isPaused: false });
      },
      endPractice: () => {
        set({
          isActive: false,
          isPaused: false,
          currentQuestion: null
        });
      },
      submitAnswer: (answer: string): boolean => {
        const state = get();
        if (!state.currentQuestion || !state.isActive || state.isPaused) {
          return false;
        }
        const isCorrect = answer === (
          state.practiceType === KanaType.HIRAGANA 
            ? state.currentQuestion.targetCharacter.hiragana
            : state.currentQuestion.targetCharacter.katakana
        );
        set(prevState => ({
          score: isCorrect ? prevState.score + 10 : prevState.score,
          correctAnswers: isCorrect ? prevState.correctAnswers + 1 : prevState.correctAnswers,
          wrongAnswers: isCorrect ? prevState.wrongAnswers : prevState.wrongAnswers + 1,
          streak: isCorrect ? prevState.streak + 1 : 0,
          maxStreak: isCorrect 
            ? Math.max(prevState.maxStreak, prevState.streak + 1)
            : prevState.maxStreak
        }));
        return isCorrect;
      },
      nextQuestion: () => {
        const state = get();
        const nextIndex = state.questionIndex + 1;
        if (nextIndex >= state.totalQuestions) {
          get().endPractice();
          return;
        }
        const questions = get().getPracticeQuestions();
        set({
          questionIndex: nextIndex,
          currentQuestion: questions[nextIndex] || null
        });
      },
    }),
    {
      name: STORAGE_KEYS.PRACTICE_CONFIG
    }
  )
);
export const usePracticeState = () => usePracticeStore(state => ({
  isActive: state.isActive,
  isPaused: state.isPaused,
  currentQuestion: state.currentQuestion,
  questionIndex: state.questionIndex,
  totalQuestions: state.totalQuestions
}));
export const usePracticeStats = () => usePracticeStore(state => ({
  score: state.score,
  correctAnswers: state.correctAnswers,
  wrongAnswers: state.wrongAnswers,
  streak: state.streak,
  maxStreak: state.maxStreak,
  timeSpent: state.timeSpent
}));
