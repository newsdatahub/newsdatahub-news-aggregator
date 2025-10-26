/**
 * Header component with branding and navigation
 */

import { DarkModeToggle } from './DarkModeToggle';

interface HeaderProps {
  isDark: boolean;
  onToggleDarkMode: () => void;
  isDemoMode?: boolean;
}

export function Header({ isDark, onToggleDarkMode, isDemoMode }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">News Aggregator</h1>
          {isDemoMode ? (
            <div className="demo-mode-badge">
              Demo Mode Active - Using pre-cached data.{' '}
              <a href="https://newsdatahub.com" target="_blank" rel="noopener noreferrer" className="api-key-link">
                Get a free API key at newsdatahub.com
              </a>
            </div>
          ) : (
            <a
              href="https://newsdatahub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="powered-by"
            >
              Powered by NewsDataHub API
            </a>
          )}
        </div>
        <div className="header-right">
          <DarkModeToggle isDark={isDark} onToggle={onToggleDarkMode} />
        </div>
      </div>
    </header>
  );
}
