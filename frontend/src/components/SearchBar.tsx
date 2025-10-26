/**
 * Search bar component
 */

import { useState } from 'react';
import { Search, X, HelpCircle } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  startDate?: string;
  endDate?: string;
  onDateChange?: (startDate: string, endDate: string) => void;
}

export function SearchBar({
  onSearch,
  initialValue = '',
  startDate = '',
  endDate = '',
  onDateChange,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-row">
        <form onSubmit={handleSubmit} className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news... (e.g., climate change, technology)"
            className="search-input"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="help-button"
            aria-label="Search help"
          >
            <HelpCircle size={18} />
          </button>
          <button type="submit" className="search-submit">
            Search
          </button>
        </form>
        {onDateChange && (
          <div className="search-date-filters">
            <div className="date-input-group">
              <label htmlFor="search-start-date">From</label>
              <input
                id="search-start-date"
                type="date"
                value={startDate}
                onChange={(e) => onDateChange(e.target.value, endDate)}
                className="date-input-compact"
              />
            </div>
            <div className="date-input-group">
              <label htmlFor="search-end-date">To</label>
              <input
                id="search-end-date"
                type="date"
                value={endDate}
                onChange={(e) => onDateChange(startDate, e.target.value)}
                className="date-input-compact"
              />
            </div>
          </div>
        )}
      </div>
      {showHelp && (
        <div className="search-help">
          <h4>Search Tips</h4>
          <p>Build complex queries using Boolean operators:</p>
          <ul>
            <li>
              <strong>AND:</strong> Both terms must appear
              <br />
              <code>climate AND change</code>
            </li>
            <li>
              <strong>OR:</strong> Either term can appear
              <br />
              <code>tesla OR spacex</code>
            </li>
            <li>
              <strong>NOT:</strong> Exclude specific terms
              <br />
              <code>apple NOT fruit</code>
            </li>
            <li>
              <strong>Phrases:</strong> Wrap exact phrases in quotes
              <br />
              <code>"artificial intelligence"</code>
            </li>
            <li>
              <strong>Complex:</strong> Combine multiple operators
              <br />
              <code>("machine learning" OR AI) AND ethics NOT weapons</code>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
