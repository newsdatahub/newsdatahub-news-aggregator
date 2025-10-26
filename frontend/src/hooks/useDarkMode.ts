/**
 * Hook for managing dark mode state
 */

import { useState, useEffect } from 'react';

const DARK_MODE_KEY = 'news-aggregator-dark-mode';

/**
 * Custom hook for dark mode state management
 *
 * @returns Dark mode state and toggle function
 */
export function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return [isDark, toggle];
}
