import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppStore } from '@/stores/app-store';
import '@/styles/globals.css';
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { setCurrentPage, settings } = useAppStore();
  useEffect(() => {
    setCurrentPage(router.pathname);
  }, [router.pathname, setCurrentPage]);
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);
  useEffect(() => {
    const html = document.documentElement;
    html.lang = settings.language;
  }, [settings.language]);
  return <Component {...pageProps} />;
}
