import React from 'react';
import { BaseComponentProps } from '@/types/common';
import { cn } from '@/utils/common-utils';
interface ContainerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  center?: boolean;
}
const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  padding = true,
  center = true,
  ...props
}) => {
  const baseClasses = ['w-full'];
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };
  const centerClasses = center ? 'mx-auto' : '';
  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';
  const classes = cn(
    baseClasses,
    sizeClasses[size],
    centerClasses,
    paddingClasses,
    className
  );
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
export default Container;
