import React from 'react';
import { ButtonVariant, ButtonSize, BaseComponentProps } from '@/types/common';
import { cn } from '@/utils/common-utils';
interface ButtonProps extends BaseComponentProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  fullWidth = false,
  onClick,
  ...props
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none'
  ];
  const variantClasses = {
    primary: [
      'bg-primary-500 hover:bg-primary-600 active:bg-primary-700',
      'text-white shadow-md hover:shadow-lg',
      'focus:ring-primary-500'
    ],
    secondary: [
      'bg-background-secondary hover:bg-gray-100 active:bg-gray-200',
      'text-text-primary border border-gray-200',
      'focus:ring-gray-500'
    ],
    outline: [
      'border-2 border-primary-500 hover:border-primary-600',
      'text-primary-500 hover:text-primary-600 hover:bg-primary-50',
      'focus:ring-primary-500'
    ],
    ghost: [
      'text-text-primary hover:bg-gray-100 active:bg-gray-200',
      'focus:ring-gray-500'
    ]
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-button',
    md: 'px-4 py-2 text-base rounded-button',
    lg: 'px-6 py-3 text-lg rounded-button'
  };
  const widthClasses = fullWidth ? 'w-full' : '';
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    className
  );
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
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
      )}
      {children}
    </button>
  );
};
export default Button;
