/**
 * Application constants
 */

export const API_BASE_URL = 'https://api.newsdatahub.com';

export const API_ENDPOINTS = {
  NEWS: '/v1/news',
} as const;

export const CACHE_TTL = {
  CURRENT_DAY: 3600, // 1 hour in seconds
  HISTORICAL: 86400, // 24 hours in seconds
} as const;

export const DEFAULT_PAGE_SIZE = 100;

export const MAX_PAGE_SIZE = 100;

export const RATE_LIMIT = {
  WINDOW_MS: 60000, // 1 minute
  MAX_REQUESTS: 10,
} as const;
