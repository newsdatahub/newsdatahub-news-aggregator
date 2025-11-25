/**
 * Hook for news search functionality
 */

import { useState, useCallback } from 'react';
import { NewsArticle, NewsSearchParams } from '../types/news';
import { searchArticles } from '../services/newsApi';

const ERROR_MESSAGE_DEFAULT: string = 'Unable to load news articles. Please try again later.';
const ERROR_MESSAGE_NETWORK: string = 'Unable to connect to the server. Please check your connection and try again.';
const ERROR_MESSAGE_AUTH: string = 'API authentication failed. Please check your API key configuration.';
const ERROR_MESSAGE_RATE_LIMIT: string = 'Too many requests. Please wait a moment before trying again.';
const ERROR_MESSAGE_BAD_REQUEST: string = 'Invalid search parameters. Please adjust your filters and try again.';
const ERROR_MESSAGE_LOAD_MORE: string = 'Unable to load more articles. Please try again.';
const WARNING_MESSAGE_INVALID_ARTICLE: string = 'Skipping invalid article:';
const LOG_MESSAGE_API_RESPONSE: string = 'API Response:';
const LOG_MESSAGE_DEDUPLICATED: string = 'Deduplicated articles:';
const LOG_MESSAGE_SEARCH_ERROR: string = 'Search error:';

const ERROR_KEYWORD_FETCH: string = 'Failed to fetch';
const ERROR_KEYWORD_NETWORK: string = 'Network';
const ERROR_CODE_UNAUTHORIZED: string = '401';
const ERROR_CODE_RATE_LIMIT: string = '429';
const ERROR_CODE_BAD_REQUEST: string = '400';

/**
 * Deduplicates articles by title
 */
function deduplicateByTitle(articles: NewsArticle[]): NewsArticle[] {
  const seen: Set<string> = new Set<string>();
  return articles.filter((article: NewsArticle): boolean => {
    // Skip articles without required fields
    if (!article || !article.title || !article.id) {
      console.warn(WARNING_MESSAGE_INVALID_ARTICLE, article);
      return false;
    }
    const normalizedTitle: string = article.title.toLowerCase().trim();
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [currentParams, setCurrentParams] = useState<NewsSearchParams>({});

  const search = useCallback(async (params: NewsSearchParams): Promise<void> => {
    setLoading(true);
    setError(null);
    setArticles([]); // Clear articles to show loading state

    try {
      const response = await searchArticles(params);
      console.log(LOG_MESSAGE_API_RESPONSE, response);
      const deduplicated: NewsArticle[] = deduplicateByTitle(response.data);
      console.log(LOG_MESSAGE_DEDUPLICATED, deduplicated);
      setArticles(deduplicated);
      setTotalResults(response.total_results);
      setNextCursor(response.next_cursor || null);
      setIsDemo(response.is_demo);
      setCurrentParams(params);
    } catch (err) {
      // Provide user-friendly error messages
      console.error(LOG_MESSAGE_SEARCH_ERROR, err);
      let errorMessage: string = ERROR_MESSAGE_DEFAULT;

      if (err instanceof Error) {
        if (err.message.includes(ERROR_KEYWORD_FETCH) || err.message.includes(ERROR_KEYWORD_NETWORK)) {
          errorMessage = ERROR_MESSAGE_NETWORK;
        } else if (err.message.includes(ERROR_CODE_UNAUTHORIZED)) {
          errorMessage = ERROR_MESSAGE_AUTH;
        } else if (err.message.includes(ERROR_CODE_RATE_LIMIT)) {
          errorMessage = ERROR_MESSAGE_RATE_LIMIT;
        } else if (err.message.includes(ERROR_CODE_BAD_REQUEST)) {
          errorMessage = ERROR_MESSAGE_BAD_REQUEST;
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

  const loadMore = useCallback(async (): Promise<void> => {
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
      const deduplicated: NewsArticle[] = deduplicateByTitle(response.data);
      setArticles((prev: NewsArticle[]): NewsArticle[] => deduplicateByTitle([...prev, ...deduplicated]));
      setNextCursor(response.next_cursor || null);
    } catch (err) {
      // Provide user-friendly error messages
      let errorMessage: string = ERROR_MESSAGE_LOAD_MORE;

      if (err instanceof Error) {
        if (err.message.includes(ERROR_KEYWORD_FETCH) || err.message.includes(ERROR_KEYWORD_NETWORK)) {
          errorMessage = ERROR_MESSAGE_NETWORK;
        } else if (err.message.includes(ERROR_CODE_RATE_LIMIT)) {
          errorMessage = ERROR_MESSAGE_RATE_LIMIT;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, currentParams]);

  const reset = useCallback((): void => {
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
