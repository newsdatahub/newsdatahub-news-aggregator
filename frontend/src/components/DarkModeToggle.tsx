/**
 * Dark mode toggle button component
 */

import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ICON_SIZE: number = 20;
const ARIA_LABEL_DARK: string = 'Switch to light mode';
const ARIA_LABEL_LIGHT: string = 'Switch to dark mode';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function DarkModeToggle({ isDark, onToggle }: DarkModeToggleProps): React.ReactElement {
  const ariaLabel: string = isDark ? ARIA_LABEL_DARK : ARIA_LABEL_LIGHT;

  return (
    <button
      onClick={onToggle}
      className="dark-mode-toggle"
      aria-label={ariaLabel}
      type="button"
    >
      {isDark ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
    </button>
  );
}
