import React, { useState } from 'react';
import { KanaCharacter, KanaType } from '@/types/kana';
import { CardState, BaseComponentProps } from '@/types/common';
import { cn } from '@/utils/common-utils';
import { getKanaCategoryColor, getKanaDisplayText } from '@/utils/kana-utils';
import { audioService } from '@/services/audio-service';
import Card from '@/components/ui/Card';
interface KanaCardProps extends BaseComponentProps {
  character: KanaCharacter;
  displayType: KanaType;
  state?: CardState;
  showRomaji?: boolean;
  showBoth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  playAudio?: boolean;
  compact?: boolean;
  onClick?: (character: KanaCharacter) => void;
}
const KanaCard: React.FC<KanaCardProps> = ({
  character,
  displayType,
  state = 'default',
  showRomaji = false,
  showBoth = false,
  size = 'md',
  interactive = false,
  playAudio = false,
  compact = false,
  onClick,
  className,
  ...props
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const sizeClasses = {
    sm: {
      card: 'w-16 h-16',
      kana: 'text-kana-lg',
      romaji: 'text-xs'
    },
    md: {
      card: showBoth ? 'w-24 h-24' : 'w-20 h-20',
      kana: showBoth ? 'text-2xl' : 'text-kana-xl',
      romaji: 'text-sm'
    },
    lg: {
      card: showBoth ? 'w-28 h-28' : 'w-24 h-24',
      kana: showBoth ? 'text-3xl' : 'text-kana-xl',
      romaji: 'text-base'
    }
  };
  const compactClasses = {
    card: 'w-full h-full min-h-[100px]',
    kana: showBoth ? 'text-3xl' : 'text-kana-xl',
    romaji: 'text-base'
  };
  const handleClick = () => {
    if (interactive) {
      setIsFlipped(!isFlipped);
    }
    onClick?.(character);
  };
  const handleAudioPlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      await audioService.playAudio(character);
    } catch (error) {
      console.warn('音频播放失败:', error);
    } finally {
      setIsPlaying(false);
    }
  };
  const hiraganaText = getKanaDisplayText(character, KanaType.HIRAGANA);
  const katakanaText = getKanaDisplayText(character, KanaType.KATAKANA);
  const displayText = showBoth && isFlipped
    ? getKanaDisplayText(character, displayType === KanaType.HIRAGANA ? KanaType.KATAKANA : KanaType.HIRAGANA)
    : getKanaDisplayText(character, displayType);
  const categoryColor = getKanaCategoryColor(character.category);
  return (
    <Card
      state={state}
      hover={interactive}
      clickable={interactive || !!onClick}
      padding="none"
      onClick={handleClick}
      className={cn(
        compact ? compactClasses.card : sizeClasses[size].card,
        'flex flex-col items-center justify-center',
        'relative overflow-hidden group',
        compact ? 'p-1' : '',
        className
      )}
      {...props}
    >
      {}
      {showBoth ? (
        <div className="flex items-center justify-center space-x-1">
          <div className={cn(
            'font-japanese font-bold transition-all duration-300',
            compact ? compactClasses.kana : sizeClasses[size].kana,
            categoryColor,
            interactive && 'group-hover:scale-110'
          )}>
            {hiraganaText}
          </div>
          <div className={cn(
            'text-text-secondary font-medium',
            compact ? 'text-lg' : 'text-xl'
          )}>/</div>
          <div className={cn(
            'font-japanese font-bold transition-all duration-300',
            compact ? compactClasses.kana : sizeClasses[size].kana,
            categoryColor,
            interactive && 'group-hover:scale-110'
          )}>
            {katakanaText}
          </div>
        </div>
      ) : (
        <div className={cn(
          'font-japanese font-bold transition-all duration-300',
          compact ? compactClasses.kana : sizeClasses[size].kana,
          categoryColor,
          interactive && 'group-hover:scale-110'
        )}>
          {displayText}
        </div>
      )}
      {}
      {showRomaji && (
        <div className={cn(
          'font-sans font-medium text-text-secondary',
          compact ? 'mt-2' : 'mt-1',
          compact ? compactClasses.romaji : sizeClasses[size].romaji
        )}>
          {character.romaji}
        </div>
      )}
      {}
      {playAudio && (
        <button
          onClick={handleAudioPlay}
          disabled={isPlaying}
          className={cn(
            'absolute top-2 right-2 rounded-full',
            'flex items-center justify-center',
            'bg-white/80 hover:bg-white shadow-sm',
            'opacity-0 group-hover:opacity-100 transition-all duration-200',
            'hover:scale-110 active:scale-95',
            isPlaying && 'opacity-100 bg-primary-100',
            compact ? 'w-7 h-7' : 'w-6 h-6'
          )}
          aria-label={`播放 ${character.romaji} 发音`}
        >
          {isPlaying ? (
            <div className={cn(
              'bg-primary-500 rounded-full animate-pulse',
              compact ? 'w-2.5 h-2.5' : 'w-2 h-2'
            )} />
          ) : (
            <svg
              className={cn(
                'text-primary-600',
                compact ? 'w-4 h-4' : 'w-3 h-3'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}
      {}
      {showBoth && interactive && !playAudio && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={cn(
            'bg-primary-400 rounded-full',
            compact ? 'w-2.5 h-2.5' : 'w-2 h-2'
          )}></div>
        </div>
      )}
      {}
      {state === 'correct' && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-100 bg-opacity-80">
          <div className="text-green-600 text-xl">✓</div>
        </div>
      )}
      {state === 'incorrect' && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-80">
          <div className="text-red-600 text-xl">✗</div>
        </div>
      )}
    </Card>
  );
};
export default KanaCard;
