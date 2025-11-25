/**
 * Hook for managing dark mode state
 */

import { useState, useEffect, useCallback } from 'react';

const DARK_MODE_KEY: string = 'news-aggregator-dark-mode';
const DARK_MODE_VALUE_TRUE: string = 'true';
const DARK_CLASS_NAME: string = 'dark';
const PREFERS_DARK_MEDIA_QUERY: string = '(prefers-color-scheme: dark)';

/**
 * Custom hook for dark mode state management
 *
 * @returns Dark mode state and toggle function
 */
export function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState<boolean>((): boolean => {
    const stored: string | null = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) {
      return stored === DARK_MODE_VALUE_TRUE;
    }
    // Default to system preference
    return window.matchMedia(PREFERS_DARK_MEDIA_QUERY).matches;
  });

  useEffect((): void => {
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
    if (isDark) {
      document.documentElement.classList.add(DARK_CLASS_NAME);
    } else {
      document.documentElement.classList.remove(DARK_CLASS_NAME);
    }
  }, [isDark]);

  const toggle = useCallback((): void => {
    setIsDark((prev: boolean): boolean => !prev);
  }, []);

  return [isDark, toggle];
}
