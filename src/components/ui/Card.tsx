import React from 'react';
import { CardState, BaseComponentProps } from '@/types/common';
import { cn } from '@/utils/common-utils';
interface CardProps extends BaseComponentProps {
  state?: CardState;
  hover?: boolean;
  clickable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}
const Card: React.FC<CardProps> = ({
  children,
  className,
  state = 'default',
  hover = false,
  clickable = false,
  padding = 'md',
  onClick,
  ...props
}) => {
  const baseClasses = [
    'bg-white rounded-card border transition-all duration-200'
  ];
  const stateClasses = {
    default: 'border-gray-200 shadow-soft',
    selected: 'border-primary-500 shadow-card ring-2 ring-primary-200',
    correct: 'border-semantic-success shadow-card ring-2 ring-green-200 bg-green-50',
    incorrect: 'border-semantic-error shadow-card ring-2 ring-red-200 bg-red-50',
    disabled: 'border-gray-100 bg-gray-50 opacity-60'
  };
  const hoverClasses = hover && state === 'default' ? [
    'hover:shadow-card hover:border-gray-300 hover:-translate-y-1'
  ] : [];
  const clickableClasses = clickable ? [
    'cursor-pointer select-none',
    'active:scale-95 active:shadow-soft'
  ] : [];
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  const classes = cn(
    baseClasses,
    stateClasses[state],
    hoverClasses,
    clickableClasses,
    paddingClasses[padding],
    className
  );
  return (
    <div
      className={classes}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
