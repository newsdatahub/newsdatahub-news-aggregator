/**
 * Loading skeleton component
 */

import React from 'react';

const SKELETON_COUNT: number = 9;

export function LoadingState(): React.ReactElement {
  return (
    <div className="loading-grid">
      {Array.from({ length: SKELETON_COUNT }).map((_: unknown, i: number) => (
        <div key={i} className="article-card skeleton">
          <div className="skeleton-image"></div>
          <div className="article-card-content">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-source"></div>
            <div className="skeleton-text skeleton-description"></div>
            <div className="skeleton-text skeleton-description"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
