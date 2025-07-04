import { KanaCategory } from '@/types/kana';
export const SEION_LAYOUT = [
  ['a', 'i', 'u', 'e', 'o'],
  ['ka', 'ki', 'ku', 'ke', 'ko'],
  ['sa', 'si', 'su', 'se', 'so'],
  ['ta', 'chi', 'tsu', 'te', 'to'],
  ['na', 'ni', 'nu', 'ne', 'no'],
  ['ha', 'hi', 'hu', 'he', 'ho'],
  ['ma', 'mi', 'mu', 'me', 'mo'],
  ['ya', '', 'yu', '', 'yo'],
  ['ra', 'ri', 'ru', 're', 'ro'],
  ['wa', '', '', '', 'wo'],
  ['n', '', '', '', '']
];
export const DAKUON_LAYOUT = [
  ['ga', 'gi', 'gu', 'ge', 'go'],
  ['za', 'zi', 'zu', 'ze', 'zo'],
  ['da', 'di', 'du', 'de', 'do'],
  ['ba', 'bi', 'bu', 'be', 'bo']
];
export const HANDAKUON_LAYOUT = [
  ['pa', 'pi', 'pu', 'pe', 'po']
];
export const YOON_LAYOUT = [
  ['kya', 'kyu', 'kyo'],
  ['sya', 'syu', 'syo'],
  ['cya', 'cyu', 'cyo'],
  ['nya', 'nyu', 'nyo'],
  ['hya', 'hyu', 'hyo'],
  ['mya', 'myu', 'myo'],
  ['rya', 'ryu', 'ryo']
];
export const YOON_DAKUON_LAYOUT = [
  ['gya', 'gyu', 'gyo'],
  ['zya', 'zyu', 'zyo'],
  ['bya', 'byu', 'byo'],
  ['pya', 'pyu', 'pyo']
];
export const CATEGORY_LAYOUTS = {
  [KanaCategory.SEION]: SEION_LAYOUT,
  [KanaCategory.DAKUON]: DAKUON_LAYOUT,
  [KanaCategory.HANDAKUON]: HANDAKUON_LAYOUT,
  [KanaCategory.YOON]: [...YOON_LAYOUT, ...YOON_DAKUON_LAYOUT]
};
export const getLayoutDimensions = (category: KanaCategory) => {
  const layout = CATEGORY_LAYOUTS[category];
  const rows = layout.length;
  const cols = Math.max(...layout.map(row => row.length));
  return { rows, cols };
};
export const getCategoryLayout = (category: KanaCategory) => {
  return CATEGORY_LAYOUTS[category] || [];
};
