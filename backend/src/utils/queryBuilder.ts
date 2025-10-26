import { NewsSearchParams } from '../types/news';

/**
 * Builds API query parameters from search filters
 *
 * @param params - Search parameters from client
 * @returns Normalized query parameters for NewsDataHub API
 */
export function buildNewsQuery(params: NewsSearchParams): Record<string, string | number> {
  const query: Record<string, string | number> = {};

  // Search query
  if (params.q) {
    query.q = params.q.trim();
  }

  // Country filter (comma-separated)
  if (params.country) {
    query.country = params.country;
  }

  // Language filter
  if (params.language) {
    query.language = params.language;
  }

  // Political leaning (comma-separated)
  if (params.political_leaning) {
    query.political_leaning = params.political_leaning;
  }

  // Topics (comma-separated)
  if (params.topic) {
    query.topic = params.topic;
  }

  // Exclude topics (comma-separated)
  if (params.exclude_topic) {
    query.exclude_topic = params.exclude_topic;
  }

  // Source type (comma-separated)
  if (params.source_type) {
    query.source_type = params.source_type;
  }

  // Date range
  if (params.start_date) {
    query.start_date = params.start_date;
  }

  if (params.end_date) {
    query.end_date = params.end_date;
  }

  // Pagination
  if (params.per_page) {
    query.per_page = params.per_page;
  }

  if (params.cursor) {
    query.cursor = params.cursor;
  }

  return query;
}

/**
 * Normalizes cache key from query parameters
 *
 * @param params - Search parameters
 * @returns Normalized cache key string
 */
export function buildCacheKey(params: NewsSearchParams): string {
  const normalized = buildNewsQuery(params);
  // Sort keys for consistent cache keys
  const sortedKeys = Object.keys(normalized).sort();
  const keyParts = sortedKeys.map((key) => `${key}=${normalized[key]}`);
  return keyParts.join('&');
}
