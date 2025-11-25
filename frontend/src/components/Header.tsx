/**
 * Header component with branding and navigation
 */

import React from 'react';
import { DarkModeToggle } from './DarkModeToggle';

const TITLE: string = 'News Aggregator';
const DEMO_MODE_TEXT: string = 'Demo Mode Active - Using pre-cached data. ';
const DEMO_MODE_LINK_TEXT: string = 'Get a free API key at newsdatahub.com';
const DEMO_MODE_URL: string = 'https://newsdatahub.com';
const POWERED_BY_TEXT: string = 'Powered by NewsDataHub API';
const POWERED_BY_URL: string = 'https://newsdatahub.com';

interface HeaderProps {
  isDark: boolean;
  onToggleDarkMode: () => void;
  isDemoMode?: boolean;
}

export function Header({ isDark, onToggleDarkMode, isDemoMode }: HeaderProps): React.ReactElement {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">{TITLE}</h1>
          {isDemoMode ? (
            <div className="demo-mode-badge">
              {DEMO_MODE_TEXT}
              <a href={DEMO_MODE_URL} target="_blank" rel="noopener noreferrer" className="api-key-link">
                {DEMO_MODE_LINK_TEXT}
              </a>
            </div>
          ) : (
            <a
              href={POWERED_BY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="powered-by"
            >
              {POWERED_BY_TEXT}
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
