import React from 'react';
import { BaseComponentProps } from '@/types/common';
import { cn } from '@/utils/common-utils';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
interface LayoutProps extends BaseComponentProps {
  showHeader?: boolean;
  showFooter?: boolean;
  fullHeight?: boolean;
}
const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  showHeader = true,
  showFooter = true,
  fullHeight = false,
  ...props
}) => {
  return (
    <div className={cn(
      'min-h-screen bg-background-primary flex flex-col',
      fullHeight && 'h-screen',
      className
    )} {...props}>
      {showHeader && <Header />}
      <Sidebar />
      <main className={cn(
        'flex-1',
        fullHeight && 'overflow-hidden'
      )}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};
export default Layout;
