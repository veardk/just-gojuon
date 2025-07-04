import React from 'react';
import { useRouter } from 'next/router';
import { BaseComponentProps } from '@/types/common';
import { cn } from '@/utils/common-utils';
import { useAppStore, useLanguage } from '@/stores/app-store';
import { APP_INFO } from '@/constants/app';
import Button from '@/components/ui/Button';
import { X } from 'lucide-react';
interface SidebarProps extends BaseComponentProps {}
const Sidebar: React.FC<SidebarProps> = ({ className, ...props }) => {
  const router = useRouter();
  const language = useLanguage();
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const navigationItems = [
    {
      key: 'home',
      label: { en: 'Home', zh: '首页' },
      href: '/'
    },
    {
      key: 'recognition',
      label: { en: 'Recognition', zh: '识别训练' },
      href: '/practice/recognition'
    },
    {
      key: 'dictation',
      label: { en: 'Listening', zh: '听力训练' },
      href: '/practice/dictation'
    },
    {
      key: 'typing',
      label: { en: 'Typing', zh: '打字训练' },
      href: '/practice/typing'
    }
  ];
  const isActivePage = (href: string): boolean => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };
  const handleNavigation = (href: string) => {
    router.push(href);
    toggleSidebar(); 
  };
  if (!isSidebarOpen) return null;
  return (
    <>
      {}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={toggleSidebar}
      />
      {}
      <div className={cn(
        'fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden',
        'transform transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )} {...props}>
        {}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={`${router.basePath || ''}/logo.png`}
              alt={APP_INFO.name}
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-semibold text-text-primary">
              {APP_INFO.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        {}
        <nav className="p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActivePage(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                )}
              >
                {item.label[language]}
              </button>
            ))}
          </div>
        </nav>
        {}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="space-y-2">
            {}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(APP_INFO.repository, '_blank')}
              className="w-full justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
