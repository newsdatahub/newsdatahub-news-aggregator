/**
 * Main App component
 */

import React, { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchBar } from './components/SearchBar';
import { FilterPanel, FilterState } from './components/FilterPanel';
import { ArticleGrid } from './components/ArticleGrid';
import { useDarkMode } from './hooks/useDarkMode';
import { useNewsSearch } from './hooks/useNewsSearch';
import { checkHealth } from './services/newsApi';
import type { NewsSearchParams } from './types/news';

const INITIAL_FILTERS: FilterState = {
  countries: [],
  language: '',
  politicalLeanings: [],
  topics: [],
  excludeTopics: [],
  sourceTypes: [],
  startDate: '',
  endDate: '',
};

const ARRAY_SEPARATOR: string = ',';
const ARTICLES_PER_PAGE: number = 100;
const ICON_SIZE_VIEW_BUTTON: number = 20;
const VIEW_MODE_GRID: 'grid' = 'grid';
const VIEW_MODE_LIST: 'list' = 'list';
const ARIA_LABEL_GRID_VIEW: string = 'Grid view';
const ARIA_LABEL_LIST_VIEW: string = 'List view';
const CLASS_VIEW_BUTTON: string = 'view-button';
const CLASS_VIEW_BUTTON_ACTIVE: string = 'active';
const EMPTY_STRING: string = '';
const ARRAY_MIN_LENGTH: number = 0;

export function App(): React.ReactElement {
  const [isDark, toggleDarkMode]: [boolean, () => void] = useDarkMode();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [searchQuery, setSearchQuery] = useState<string>(EMPTY_STRING);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(VIEW_MODE_GRID);

  const { articles, loading, error, nextCursor, isDemo, search, loadMore } = useNewsSearch();

  // Check health on mount
  useEffect((): void => {
    checkHealth()
      .then((health): void => {
        setIsDemoMode(health.demo_mode);
      })
      .catch((): void => {
        // Ignore errors
      });
  }, []);

  const performSearch = useCallback((): void => {
    const params: NewsSearchParams = {
      q: searchQuery || undefined,
      country: appliedFilters.countries.length > ARRAY_MIN_LENGTH ? appliedFilters.countries.join(ARRAY_SEPARATOR) : undefined,
      language: appliedFilters.language || undefined,
      political_leaning:
        appliedFilters.politicalLeanings.length > ARRAY_MIN_LENGTH ? appliedFilters.politicalLeanings.join(ARRAY_SEPARATOR) : undefined,
      topic: appliedFilters.topics.length > ARRAY_MIN_LENGTH ? appliedFilters.topics.join(ARRAY_SEPARATOR) : undefined,
      exclude_topic: appliedFilters.excludeTopics.length > ARRAY_MIN_LENGTH ? appliedFilters.excludeTopics.join(ARRAY_SEPARATOR) : undefined,
      source_type: appliedFilters.sourceTypes.length > ARRAY_MIN_LENGTH ? appliedFilters.sourceTypes.join(ARRAY_SEPARATOR) : undefined,
      start_date: appliedFilters.startDate || undefined,
      end_date: appliedFilters.endDate || undefined,
      per_page: ARTICLES_PER_PAGE,
      sort_by: 'date',
    };

    search(params);
  }, [searchQuery, appliedFilters, search]);

  // Search when applied filters change
  useEffect((): void => {
    performSearch();
  }, [performSearch]);

  const handleSearch = useCallback((query: string): void => {
    setSearchQuery(query);
    // Trigger search immediately when search is executed
    const params: NewsSearchParams = {
      q: query || undefined,
      country: appliedFilters.countries.length > ARRAY_MIN_LENGTH ? appliedFilters.countries.join(ARRAY_SEPARATOR) : undefined,
      language: appliedFilters.language || undefined,
      political_leaning:
        appliedFilters.politicalLeanings.length > ARRAY_MIN_LENGTH ? appliedFilters.politicalLeanings.join(ARRAY_SEPARATOR) : undefined,
      topic: appliedFilters.topics.length > ARRAY_MIN_LENGTH ? appliedFilters.topics.join(ARRAY_SEPARATOR) : undefined,
      exclude_topic: appliedFilters.excludeTopics.length > ARRAY_MIN_LENGTH ? appliedFilters.excludeTopics.join(ARRAY_SEPARATOR) : undefined,
      source_type: appliedFilters.sourceTypes.length > ARRAY_MIN_LENGTH ? appliedFilters.sourceTypes.join(ARRAY_SEPARATOR) : undefined,
      start_date: appliedFilters.startDate || undefined,
      end_date: appliedFilters.endDate || undefined,
      per_page: ARTICLES_PER_PAGE,
      sort_by: 'date',
    };
    search(params);
  }, [appliedFilters, search]);

  const handleApplyFilters = useCallback((): void => {
    setAppliedFilters(filters);
    setFiltersOpen(false);
  }, [filters]);

  const handleRetry = useCallback((): void => {
    performSearch();
  }, [performSearch]);

  const handleDateChange = useCallback((start: string, end: string): void => {
    const updatedFilters = { ...filters, startDate: start, endDate: end };
    setFilters(updatedFilters);
    setAppliedFilters(updatedFilters);
  }, [filters]);

  const handleCloseFilters = useCallback((): void => {
    setFiltersOpen(false);
  }, []);

  const handleSetViewModeGrid = useCallback((): void => {
    setViewMode(VIEW_MODE_GRID);
  }, []);

  const handleSetViewModeList = useCallback((): void => {
    setViewMode(VIEW_MODE_LIST);
  }, []);

  const hasMore: boolean = !!nextCursor;
  const isDemoOrDemoMode: boolean = isDemoMode || isDemo;
  const isGridMode: boolean = viewMode === VIEW_MODE_GRID;
  const isListMode: boolean = viewMode === VIEW_MODE_LIST;
  const gridButtonClass: string = isGridMode ? `${CLASS_VIEW_BUTTON} ${CLASS_VIEW_BUTTON_ACTIVE}` : CLASS_VIEW_BUTTON;
  const listButtonClass: string = isListMode ? `${CLASS_VIEW_BUTTON} ${CLASS_VIEW_BUTTON_ACTIVE}` : CLASS_VIEW_BUTTON;

  return (
    <div className="app">
      <Header isDark={isDark} onToggleDarkMode={toggleDarkMode} isDemoMode={isDemoOrDemoMode} />

      <main className="main-content">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onApply={handleApplyFilters}
          isDark={isDark}
          isOpen={filtersOpen}
          onClose={handleCloseFilters}
        />

        <div className="content-area">
          <div className="sticky-search-controls">
            <div className="search-bar-container">
              <SearchBar
                onSearch={handleSearch}
                initialValue={searchQuery}
                startDate={appliedFilters.startDate}
                endDate={appliedFilters.endDate}
                onDateChange={handleDateChange}
              />
            </div>
            <div className="view-controls">
              <button
                className={gridButtonClass}
                onClick={handleSetViewModeGrid}
                aria-label={ARIA_LABEL_GRID_VIEW}
              >
                <LayoutGrid size={ICON_SIZE_VIEW_BUTTON} />
              </button>
              <button
                className={listButtonClass}
                onClick={handleSetViewModeList}
                aria-label={ARIA_LABEL_LIST_VIEW}
              >
                <List size={ICON_SIZE_VIEW_BUTTON} />
              </button>
            </div>
          </div>

          <ArticleGrid
            articles={articles}
            loading={loading}
            error={error}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onRetry={handleRetry}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
