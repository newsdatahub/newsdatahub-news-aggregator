/**
 * Main App component
 */

import { useState, useEffect } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchBar } from './components/SearchBar';
import { FilterPanel, FilterState } from './components/FilterPanel';
import { ArticleGrid } from './components/ArticleGrid';
import { useDarkMode } from './hooks/useDarkMode';
import { useNewsSearch } from './hooks/useNewsSearch';
import { checkHealth } from './services/newsApi';

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

export function App() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { articles, loading, error, nextCursor, isDemo, search, loadMore } = useNewsSearch();

  // Check health on mount
  useEffect(() => {
    checkHealth()
      .then((health) => {
        setIsDemoMode(health.demo_mode);
      })
      .catch(() => {
        // Ignore errors
      });
  }, []);

  // Initial search
  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performSearch = () => {
    const params = {
      q: searchQuery || undefined,
      country: filters.countries.length > 0 ? filters.countries.join(',') : undefined,
      language: filters.language || undefined,
      political_leaning:
        filters.politicalLeanings.length > 0 ? filters.politicalLeanings.join(',') : undefined,
      topic: filters.topics.length > 0 ? filters.topics.join(',') : undefined,
      exclude_topic: filters.excludeTopics.length > 0 ? filters.excludeTopics.join(',') : undefined,
      source_type: filters.sourceTypes.length > 0 ? filters.sourceTypes.join(',') : undefined,
      start_date: filters.startDate || undefined,
      end_date: filters.endDate || undefined,
      per_page: 100,
    };

    search(params);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Trigger search immediately when search is executed
    const params = {
      q: query || undefined,
      country: filters.countries.length > 0 ? filters.countries.join(',') : undefined,
      language: filters.language || undefined,
      political_leaning:
        filters.politicalLeanings.length > 0 ? filters.politicalLeanings.join(',') : undefined,
      topic: filters.topics.length > 0 ? filters.topics.join(',') : undefined,
      exclude_topic: filters.excludeTopics.length > 0 ? filters.excludeTopics.join(',') : undefined,
      source_type: filters.sourceTypes.length > 0 ? filters.sourceTypes.join(',') : undefined,
      start_date: filters.startDate || undefined,
      end_date: filters.endDate || undefined,
      per_page: 100,
    };
    search(params);
  };

  const handleApplyFilters = () => {
    performSearch();
    setFiltersOpen(false);
  };

  const handleRetry = () => {
    performSearch();
  };

  return (
    <div className="app">
      <Header isDark={isDark} onToggleDarkMode={toggleDarkMode} isDemoMode={isDemoMode || isDemo} />

      <main className="main-content">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onApply={handleApplyFilters}
          isDark={isDark}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        <div className="content-area">
          <div className="sticky-search-controls">
            <div className="search-bar-container">
              <SearchBar
                onSearch={handleSearch}
                initialValue={searchQuery}
                startDate={filters.startDate}
                endDate={filters.endDate}
                onDateChange={(start, end) => {
                  setFilters({ ...filters, startDate: start, endDate: end });
                }}
              />
            </div>
            <div className="view-controls">
              <button
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <ArticleGrid
            articles={articles}
            loading={loading}
            error={error}
            hasMore={!!nextCursor}
            isDark={isDark}
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
