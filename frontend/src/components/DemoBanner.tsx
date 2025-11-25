/**
 * Demo mode indicator banner component
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

const ICON_SIZE: number = 18;
const MESSAGE: string = 'Demo Mode Active - Using pre-cached data. Get a free API key at ';
const LINK_URL: string = 'https://newsdatahub.com';
const LINK_TEXT: string = 'newsdatahub.com';

export function DemoBanner(): React.ReactElement {
  return (
    <div className="demo-banner">
      <AlertCircle size={ICON_SIZE} />
      <span>
        {MESSAGE}
        <a
          href={LINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="demo-banner-link"
        >
          {LINK_TEXT}
        </a>
      </span>
    </div>
  );
}
