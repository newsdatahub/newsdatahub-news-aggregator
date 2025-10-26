/**
 * Empty state component when no results found
 */

import { Search } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="empty-state">
      <Search size={48} className="empty-icon" />
      <h3>No articles found</h3>
      <p>Try adjusting your filters or search query to find more articles.</p>
      <ul className="empty-suggestions">
        <li>Use broader search terms</li>
        <li>Remove some filters</li>
        <li>Try different date ranges</li>
      </ul>
    </div>
  );
}
