/**
 * API client for news search
 */

import { NewsSearchParams, NewsSearchResponse } from '../types/news';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Builds query string from parameters
 *
 * @param params - Query parameters
 * @returns URL-encoded query string
 */
function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Searches for news articles
 *
 * @param params - Search parameters
 * @returns News search response
 */
export async function searchArticles(params: NewsSearchParams): Promise<NewsSearchResponse> {
  const queryString = buildQueryString(params as Record<string, string | number | undefined>);
  const url = `${API_BASE_URL}/api/news/search${queryString}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Failed to fetch news');
  }

  return response.json();
}

/**
 * Fetches related articles for a given article ID
 *
 * @param articleId - The ID of the article to find related articles for
 * @param limit - Number of related articles to fetch (default: 10)
 * @returns Related articles response with metadata
 */
export async function getRelatedArticles(
  articleId: string,
  limit: number = 10
): Promise<{ related_to: any; count: number; data: any[] }> {
  const queryString = buildQueryString({ per_page: limit });
  const url = `${API_BASE_URL}/api/news/related/${articleId}${queryString}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Failed to fetch related articles');
  }

  return response.json();
}

/**
 * Health check endpoint
 *
 * @returns Health status
 */
export async function checkHealth(): Promise<{
  ok: boolean;
  demo_mode: boolean;
  api_configured: boolean;
}> {
  const url = `${API_BASE_URL}/api/health`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
}
