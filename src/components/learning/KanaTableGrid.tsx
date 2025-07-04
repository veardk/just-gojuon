import React from 'react';
import { KanaType, KanaCategory, KanaCharacter } from '@/types/kana';
import { KANA_BY_CATEGORY } from '@/constants/kana';
import { getCategoryLayout } from '@/constants/kana-layout';
import { cn } from '@/utils/common-utils';
import KanaCard from './KanaCard';
interface KanaTableGridProps {
  category: KanaCategory;
  displayType: KanaType;
  showRomaji?: boolean;
  showBoth?: boolean;
  playAudio?: boolean;
  className?: string;
}
const KanaTableGrid: React.FC<KanaTableGridProps> = ({
  category,
  displayType,
  showRomaji = false,
  showBoth = false,
  playAudio = false,
  className = ''
}) => {
  const kanaList = KANA_BY_CATEGORY[category] || [];
  const layout = getCategoryLayout(category);
  const kanaMap = new Map<string, KanaCharacter>();
  kanaList.forEach(kana => {
    kanaMap.set(kana.romaji, kana);
  });
  const getCardWidth = (row: string[]) => {
    if (category === KanaCategory.YOON) {
      const validCards = row.filter(romaji => romaji && kanaMap.has(romaji)).length;
      if (validCards === 3) {
        return '194px';
      }
    }
    return '110px';
  };
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div className="bg-transparent">
        {layout.map((row, rowIndex) => {
          const validCards = row.filter(romaji => romaji && kanaMap.has(romaji));
          const isYoonRow = category === KanaCategory.YOON && validCards.length === 3;
          return (
            <div key={rowIndex} className={`flex gap-4 mb-4 last:mb-0 ${isYoonRow ? 'justify-start' : 'justify-center'}`}>
              {row.map((romaji, colIndex) => {
                if (category !== KanaCategory.YOON) {
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="flex-shrink-0"
                      style={{
                        width: getCardWidth(row),
                        height: '110px'
                      }}
                    >
                      {romaji && kanaMap.has(romaji) ? (
                        <KanaCard
                          character={kanaMap.get(romaji)!}
                          displayType={displayType}
                          showRomaji={showRomaji}
                          showBoth={showBoth}
                          playAudio={playAudio}
                          compact
                          className="w-full h-full shadow-sm hover:shadow-md transition-all duration-200"
                        />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                  );
                }
                if (!romaji || !kanaMap.has(romaji)) {
                  return null;
                }
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="flex-shrink-0"
                    style={{
                      width: getCardWidth(row),
                      height: '110px'
                    }}
                  >
                    <KanaCard
                      character={kanaMap.get(romaji)!}
                      displayType={displayType}
                      showRomaji={showRomaji}
                      showBoth={showBoth}
                      playAudio={playAudio}
                      compact
                      className="w-full h-full shadow-sm hover:shadow-md transition-all duration-200"
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default KanaTableGrid;
