/**
 * Demo mode indicator banner component
 */

import { AlertCircle } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="demo-banner">
      <AlertCircle size={18} />
      <span>
        Demo Mode Active - Using pre-cached data. Get a free API key at{' '}
        <a
          href="https://newsdatahub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="demo-banner-link"
        >
          newsdatahub.com
        </a>
      </span>
    </div>
  );
}
