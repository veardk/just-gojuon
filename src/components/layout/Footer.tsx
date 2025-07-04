import React from 'react';
import { BaseComponentProps } from '@/types/common';
import { cn } from '@/utils/common-utils';
import { useLanguage } from '@/stores/app-store';
import Container from '@/components/ui/Container';
interface FooterProps extends BaseComponentProps {}
const Footer: React.FC<FooterProps> = ({ className, ...props }) => {
  const language = useLanguage();
  return (
    <footer className={cn(
      'bg-background-secondary border-t border-gray-200 mt-auto',
      className
    )} {...props}>
      <Container>
        <div className="py-6">
          <div className="text-center text-text-secondary text-sm">
            © 2025 Levon. {language === 'zh' ? '版权所有。' : 'All rights reserved.'}
          </div>
        </div>
      </Container>
    </footer>
  );
};
export default Footer;
