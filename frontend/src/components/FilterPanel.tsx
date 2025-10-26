/**
 * Main filter panel component
 */

import { X } from 'lucide-react';
import { CountryFilter } from './filters/CountryFilter';
import { LanguageFilter } from './filters/LanguageFilter';
import { PoliticalLeaningFilter } from './filters/PoliticalLeaningFilter';
import { DateRangeFilter } from './filters/DateRangeFilter';
import { TopicFilter } from './filters/TopicFilter';
import { SourceTypeFilter } from './filters/SourceTypeFilter';

export interface FilterState {
  countries: string[];
  language: string;
  politicalLeanings: string[];
  topics: string[];
  excludeTopics: string[];
  sourceTypes: string[];
  startDate: string;
  endDate: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onApply: () => void;
  isDark: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function FilterPanel({ filters, onChange, onApply, isDark, isOpen, onClose }: FilterPanelProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onChange({
      countries: [],
      language: '',
      politicalLeanings: [],
      topics: [],
      excludeTopics: [],
      sourceTypes: [],
      startDate: '',
      endDate: '',
    });
  };

  return (
    <>
      {isOpen && <div className="filter-overlay" onClick={onClose}></div>}
      <aside className={`filter-panel ${isOpen ? 'open' : ''}`}>
        <button onClick={onClose} className="filter-close" aria-label="Close filters">
          <X size={20} />
        </button>

        <div className="filter-content">
          <DateRangeFilter
            startDate={filters.startDate}
            endDate={filters.endDate}
            onChange={(start, end) => {
              updateFilter('startDate', start);
              updateFilter('endDate', end);
            }}
          />

          <CountryFilter
            selected={filters.countries}
            onChange={(countries) => updateFilter('countries', countries)}
          />

          <LanguageFilter
            selected={filters.language}
            onChange={(language) => updateFilter('language', language)}
          />

          <PoliticalLeaningFilter
            selected={filters.politicalLeanings}
            onChange={(leanings) => updateFilter('politicalLeanings', leanings)}
            isDark={isDark}
          />

          <TopicFilter
            selected={filters.topics}
            onChange={(topics) => updateFilter('topics', topics)}
          />

          <TopicFilter
            selected={filters.excludeTopics}
            onChange={(topics) => updateFilter('excludeTopics', topics)}
            isExclude={true}
          />

          <SourceTypeFilter
            selected={filters.sourceTypes}
            onChange={(types) => updateFilter('sourceTypes', types)}
          />
        </div>

        <div className="filter-actions">
          <button onClick={clearAll} className="clear-all-button">
            Clear All
          </button>
          <button onClick={onApply} className="apply-filters-button">
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
}
