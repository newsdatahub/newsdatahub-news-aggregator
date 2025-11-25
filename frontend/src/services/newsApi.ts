/**
 * API client for news search
 */

import { NewsSearchParams, NewsSearchResponse } from '../types/news';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '';
const API_ENDPOINT_NEWS_SEARCH: string = '/api/news/search';
const API_ENDPOINT_HEALTH: string = '/api/health';
const QUERY_STRING_PREFIX: string = '?';
const EMPTY_STRING: string = '';
const ERROR_MESSAGE_REQUEST_FAILED: string = 'Request failed';
const ERROR_MESSAGE_FETCH_FAILED: string = 'Failed to fetch news';
const ERROR_MESSAGE_HEALTH_CHECK_FAILED: string = 'Health check failed';

interface HealthCheckResponse {
  ok: boolean;
  demo_mode: boolean;
  api_configured: boolean;
}

interface ErrorResponse {
  message: string;
}

/**
 * Builds query string from parameters
 *
 * @param params - Query parameters
 * @returns URL-encoded query string
 */
function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams: URLSearchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]: [string, string | number | undefined]): void => {
    if (value !== undefined && value !== null && value !== EMPTY_STRING) {
      searchParams.append(key, String(value));
    }
  });

  const queryString: string = searchParams.toString();
  return queryString ? `${QUERY_STRING_PREFIX}${queryString}` : EMPTY_STRING;
}

/**
 * Searches for news articles
 *
 * @param params - Search parameters
 * @returns News search response
 */
export async function searchArticles(params: NewsSearchParams): Promise<NewsSearchResponse> {
  const queryString: string = buildQueryString(params as Record<string, string | number | undefined>);
  const url: string = `${API_BASE_URL}${API_ENDPOINT_NEWS_SEARCH}${queryString}`;

  const response: Response = await fetch(url);

  if (!response.ok) {
    const error: ErrorResponse = await response.json().catch((): ErrorResponse => ({ message: ERROR_MESSAGE_REQUEST_FAILED }));
    throw new Error(error.message || ERROR_MESSAGE_FETCH_FAILED);
  }

  return response.json();
}

/**
 * Health check endpoint
 *
 * @returns Health status
 */
export async function checkHealth(): Promise<HealthCheckResponse> {
  const url: string = `${API_BASE_URL}${API_ENDPOINT_HEALTH}`;
  const response: Response = await fetch(url);

  if (!response.ok) {
    throw new Error(ERROR_MESSAGE_HEALTH_CHECK_FAILED);
  }

  return response.json();
}
