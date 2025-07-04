import React from 'react';
import { KanaCharacter, KanaType, KanaCategory } from '@/types/kana';
import { BaseComponentProps } from '@/types/common';
import { cn } from '@/utils/common-utils';
import KanaCard from './KanaCard';
import KanaTableGrid from './KanaTableGrid';
import { FileX } from 'lucide-react';
interface KanaGridProps extends BaseComponentProps {
  kanaList: KanaCharacter[];
  displayType: KanaType;
  showRomaji?: boolean;
  showBoth?: boolean;
  interactive?: boolean;
  playAudio?: boolean;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  useTraditionalLayout?: boolean;
  category?: KanaCategory;
  onKanaClick?: (character: KanaCharacter) => void;
}
const KanaGrid: React.FC<KanaGridProps> = ({
  kanaList,
  displayType,
  showRomaji = false,
  showBoth = false,
  interactive = false,
  playAudio = false,
  columns = 5,
  gap = 'md',
  useTraditionalLayout = false,
  category,
  onKanaClick,
  className,
  ...props
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };
  const getGridCols = (cols: number) => {
    if (cols <= 2) return 'grid-cols-2';
    if (cols <= 3) return 'grid-cols-3';
    if (cols <= 4) return 'grid-cols-4';
    if (cols <= 5) return 'grid-cols-5';
    if (cols <= 6) return 'grid-cols-6';
    if (cols <= 8) return 'grid-cols-8';
    return 'grid-cols-10';
  };
  const gridClasses = cn(
    'grid',
    getGridCols(columns),
    gapClasses[gap],
    'justify-items-center',
    className
  );
  if (useTraditionalLayout && category) {
    return (
      <KanaTableGrid
        category={category}
        displayType={displayType}
        showRomaji={showRomaji}
        showBoth={showBoth}
        playAudio={playAudio}
        className={className}
      />
    );
  }
  if (kanaList.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FileX className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">没有找到假名数据</p>
        </div>
      </div>
    );
  }
  return (
    <div className={gridClasses} {...props}>
      {kanaList.map((character) => (
        <KanaCard
          key={character.id}
          character={character}
          displayType={displayType}
          showRomaji={showRomaji}
          showBoth={showBoth}
          interactive={interactive}
          playAudio={playAudio}
          onClick={onKanaClick}
          size="md"
        />
      ))}
    </div>
  );
};
export default KanaGrid;
