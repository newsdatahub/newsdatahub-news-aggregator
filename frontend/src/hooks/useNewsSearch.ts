/**
 * Hook for news search functionality
 */

import { useState, useCallback } from 'react';
import { NewsArticle, NewsSearchParams } from '../types/news';
import { searchArticles } from '../services/newsApi';

/**
 * Deduplicates articles by title
 */
function deduplicateByTitle(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const normalizedTitle = article.title.toLowerCase().trim();
    if (seen.has(normalizedTitle)) {
      return false;
    }
    seen.add(normalizedTitle);
    return true;
  });
}

interface UseNewsSearchResult {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  nextCursor: string | null;
  isDemo: boolean;
  search: (params: NewsSearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for news search with pagination
 *
 * @returns News search state and methods
 */
export function useNewsSearch(): UseNewsSearchResult {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [currentParams, setCurrentParams] = useState<NewsSearchParams>({});

  const search = useCallback(async (params: NewsSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchArticles(params);
      const deduplicated = deduplicateByTitle(response.data);
      setArticles(deduplicated);
      setTotalResults(response.total_results);
      setNextCursor(response.next_cursor || null);
      setIsDemo(response.is_demo);
      setCurrentParams(params);
    } catch (err) {
      // Provide user-friendly error messages
      let errorMessage = 'Unable to load news articles. Please try again later.';

      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
          errorMessage = 'Unable to connect to the server. Please check your connection and try again.';
        } else if (err.message.includes('401')) {
          errorMessage = 'API authentication failed. Please check your API key configuration.';
        } else if (err.message.includes('429')) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        } else if (err.message.includes('400')) {
          errorMessage = 'Invalid search parameters. Please adjust your filters and try again.';
        }
      }

      setError(errorMessage);
      setArticles([]);
      setTotalResults(0);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchArticles({
        ...currentParams,
        cursor: nextCursor,
      });
      const deduplicated = deduplicateByTitle(response.data);
      setArticles((prev) => deduplicateByTitle([...prev, ...deduplicated]));
      setNextCursor(response.next_cursor || null);
    } catch (err) {
      // Provide user-friendly error messages
      let errorMessage = 'Unable to load more articles. Please try again.';

      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
          errorMessage = 'Unable to connect to the server. Please check your connection and try again.';
        } else if (err.message.includes('429')) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, currentParams]);

  const reset = useCallback(() => {
    setArticles([]);
    setLoading(false);
    setError(null);
    setTotalResults(0);
    setNextCursor(null);
    setIsDemo(false);
    setCurrentParams({});
  }, []);

  return {
    articles,
    loading,
    error,
    totalResults,
    nextCursor,
    isDemo,
    search,
    loadMore,
    reset,
  };
}
