/**
 * Empty state component when no results found
 */

import React from 'react';
import { Search } from 'lucide-react';

const ICON_SIZE: number = 48;
const HEADING: string = 'No articles found';
const MESSAGE: string = 'Try adjusting your filters or search query to find more articles.';
const SUGGESTION_1: string = 'Use broader search terms';
const SUGGESTION_2: string = 'Remove some filters';
const SUGGESTION_3: string = 'Try different date ranges';

export function EmptyState(): React.ReactElement {
  return (
    <div className="empty-state">
      <Search size={ICON_SIZE} className="empty-icon" />
      <h3>{HEADING}</h3>
      <p>{MESSAGE}</p>
      <ul className="empty-suggestions">
        <li>{SUGGESTION_1}</li>
        <li>{SUGGESTION_2}</li>
        <li>{SUGGESTION_3}</li>
      </ul>
    </div>
  );
}
