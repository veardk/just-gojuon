import { KanaCharacter, KanaCategory, KanaType, PracticeOption } from '@/types/kana';
import { KANA_DATA, KANA_BY_CATEGORY } from '@/constants/kana';
export const getKanaByCategory = (category?: KanaCategory): KanaCharacter[] => {
  if (!category) return KANA_DATA;
  return KANA_BY_CATEGORY[category] || [];
};
export const getKanaById = (id: string): KanaCharacter | undefined => {
  return KANA_DATA.find(kana => kana.id === id);
};
export const getKanaByDifficulty = (difficulty: number): KanaCharacter[] => {
  return KANA_DATA.filter(kana => kana.difficulty === difficulty);
};
export const getRandomItem = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error('数组不能为空');
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};
export const getRandomItems = <T>(array: T[], count: number): T[] => {
  if (count >= array.length) return [...array];
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
export const generatePracticeOptions = (
  correctAnswer: KanaCharacter,
  allKana: KanaCharacter[],
  optionsCount: number = 4
): PracticeOption[] => {
  const otherKana = allKana.filter(kana => kana.id !== correctAnswer.id);
  const wrongOptions = getRandomItems(otherKana, optionsCount - 1);
  const options: PracticeOption[] = [
    {
      id: `option-${correctAnswer.id}`,
      character: correctAnswer,
      isCorrect: true
    },
    ...wrongOptions.map((kana, index) => ({
      id: `option-${kana.id}-${index}`,
      character: kana,
      isCorrect: false
    }))
  ];
  return shuffleArray(options);
};
export const validateAnswer = (
  userAnswer: string,
  correctAnswer: KanaCharacter,
  displayType: KanaType
): boolean => {
  const correctText = displayType === KanaType.HIRAGANA 
    ? correctAnswer.hiragana 
    : correctAnswer.katakana;
  return userAnswer.trim().toLowerCase() === correctText.toLowerCase();
};
export const getKanaDisplayText = (
  character: KanaCharacter,
  type: KanaType
): string => {
  return type === KanaType.HIRAGANA ? character.hiragana : character.katakana;
};
export const getKanaCategoryColor = (category: KanaCategory): string => {
  const colorMap = {
    [KanaCategory.SEION]: 'text-japanese-hiragana',
    [KanaCategory.DAKUON]: 'text-japanese-katakana',
    [KanaCategory.HANDAKUON]: 'text-japanese-romaji',
    [KanaCategory.YOON]: 'text-japanese-accent'
  };
  return colorMap[category] || 'text-gray-600';
};
export const getDifficultyColor = (difficulty: number): string => {
  const colorMap = {
    1: 'text-semantic-success',
    2: 'text-semantic-warning',
    3: 'text-semantic-error'
  };
  return colorMap[difficulty as keyof typeof colorMap] || 'text-gray-600';
};
export const formatStudyTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}小时`;
  }
  return `${hours}小时${remainingMinutes}分钟`;
};
export const getKanaAudioUrl = (character: KanaCharacter): string => {
  const categoryPath = {
    [KanaCategory.SEION]: 'seion',
    [KanaCategory.DAKUON]: 'dakuon',
    [KanaCategory.HANDAKUON]: 'handakuon',
    [KanaCategory.YOON]: 'yoon'
  };
  const categoryFolder = categoryPath[character.category];
  return `/sounds/${categoryFolder}/${character.romaji}.mp3`;
};
export const isValidKanaCharacter = (char: string): boolean => {
  const hiraganaRegex = /[\u3040-\u309F]/;
  const katakanaRegex = /[\u30A0-\u30FF]/;
  return hiraganaRegex.test(char) || katakanaRegex.test(char);
};
