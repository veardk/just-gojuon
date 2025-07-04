import React from 'react';
import { KanaCategory } from '@/types/kana';
import { BaseComponentProps, Locale } from '@/types/common';
import { cn } from '@/utils/common-utils';
import { CATEGORY_LABELS, KANA_BY_CATEGORY } from '@/constants/kana';
import { useLanguage } from '@/stores/app-store';
import Button from '@/components/ui/Button';
interface CategorySelectorProps extends BaseComponentProps {
  selectedCategories: KanaCategory[];
  onCategoryChange: (categories: KanaCategory[]) => void;
  multiple?: boolean;
}
const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategoryChange,
  multiple = true,
  className,
  ...props
}) => {
  const language = useLanguage();
  const handleCategoryClick = (category: KanaCategory) => {
    if (multiple) {
      const isSelected = selectedCategories.includes(category);
      if (isSelected) {
        if (selectedCategories.length > 1) {
          onCategoryChange(selectedCategories.filter(c => c !== category));
        }
      } else {
        onCategoryChange([...selectedCategories, category]);
      }
    } else {
      onCategoryChange([category]);
    }
  };
  const getCategoryColor = (category: KanaCategory): string => {
    const colorMap = {
      [KanaCategory.SEION]: 'bg-japanese-hiragana text-white',
      [KanaCategory.DAKUON]: 'bg-japanese-katakana text-white',
      [KanaCategory.HANDAKUON]: 'bg-japanese-romaji text-white',
      [KanaCategory.YOON]: 'bg-japanese-accent text-white'
    };
    return colorMap[category];
  };
  const getCategoryCount = (category: KanaCategory): number => {
    return KANA_BY_CATEGORY[category]?.length || 0;
  };
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {language === 'zh' ? '选择练习内容' : 'Select Practice Content'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.values(KanaCategory).map((category) => {
          const isSelected = selectedCategories.includes(category);
          const label = CATEGORY_LABELS[category][language];
          const count = getCategoryCount(category);
          return (
            <div
              key={category}
              className={cn(
                'relative p-4 rounded-card border-2 cursor-pointer transition-all duration-200',
                'hover:shadow-card hover:-translate-y-0.5',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-card'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
              onClick={() => handleCategoryClick(category)}
            >
              {}
              <div className="absolute top-2 right-2">
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  isSelected
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                )}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              {}
              <div className="mb-2">
                <span className={cn(
                  'inline-block px-2 py-1 rounded-full text-xs font-medium',
                  getCategoryColor(category)
                )}>
                  {category.toUpperCase()}
                </span>
              </div>
              {}
              <h4 className="font-medium text-text-primary mb-1">
                {label}
              </h4>
              {}
              <p className="text-sm text-text-secondary">
                {count} {language === 'zh' ? '个字符' : 'characters'}
              </p>
            </div>
          );
        })}
      </div>
      {}
      {multiple && (
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange(Object.values(KanaCategory))}
          >
            {language === 'zh' ? '全选' : 'Select All'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategoryChange([KanaCategory.SEION])}
          >
            {language === 'zh' ? '重置' : 'Reset'}
          </Button>
        </div>
      )}
    </div>
  );
};
export default CategorySelector;
