import React from 'react';
import { BaseComponentProps } from '@/types/common';
import { cn } from '@/utils/common-utils';
interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  text?: string;
}
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 'md',
  color = 'primary',
  text,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  const colorClasses = {
    primary: 'text-primary-500',
    white: 'text-white',
    gray: 'text-gray-500'
  };
  const spinnerClasses = cn(
    'animate-spin',
    sizeClasses[size],
    colorClasses[color],
    className
  );
  return (
    <div className="flex flex-col items-center justify-center space-y-2" {...props}>
      <svg
        className={spinnerClasses}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className={cn('text-sm', colorClasses[color])}>
          {text}
        </p>
      )}
    </div>
  );
};
export default LoadingSpinner;
