import { config } from '../config/env';
import { API_BASE_URL, API_ENDPOINTS, CACHE_TTL, DEFAULT_PAGE_SIZE } from '../config/constants';
import { NewsSearchParams, NewsApiResponse } from '../types/news';
import { makeGetRequest, buildQueryString } from '../utils/httpUtils';
import { buildNewsQuery, buildCacheKey } from '../utils/queryBuilder';
import { cacheService } from './cacheService';
import logger from '../utils/logger';

/**
 * Service for interacting with NewsDataHub API
 */
class NewsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Searches for news articles with caching
   *
   * @param params - Search parameters
   * @returns News articles response
   */
  async searchArticles(params: NewsSearchParams): Promise<NewsApiResponse> {
    // Build cache key
    const cacheKey = buildCacheKey(params);

    // Check cache first
    const cached = cacheService.get<NewsApiResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build query parameters
    const queryParams = buildNewsQuery(params);

    // Set default page size if not specified
    if (!queryParams.per_page) {
      queryParams.per_page = DEFAULT_PAGE_SIZE;
    }

    // Make API request
    const queryString = buildQueryString(queryParams);
    const url = `${API_BASE_URL}${API_ENDPOINTS.NEWS}${queryString}`;

    logger.info('Fetching news from API', { url: API_ENDPOINTS.NEWS, params: queryParams });

    try {
      const response = await makeGetRequest<NewsApiResponse>(url, {
        'X-API-Key': this.apiKey,
      });

      // Determine cache TTL based on date range
      const ttl = this.getCacheTTL(params.start_date, params.end_date);

      // Cache the response
      cacheService.set(cacheKey, response, ttl);

      logger.info('News fetched successfully', {
        total: response.total_results,
        returned: response.data.length,
      });

      return response;
    } catch (error) {
      logger.error('Failed to fetch news', { error });
      throw error;
    }
  }

  /**
   * Fetches related articles for a given article ID
   *
   * @param articleId - The article ID
   * @param perPage - Number of results to return
   * @returns Related articles response
   */
  async getRelatedArticles(
    articleId: string,
    perPage: number = 10
  ): Promise<{ related_to: any; count: number; data: any[] }> {
    // Build cache key
    const cacheKey = `related:${articleId}:${perPage}`;

    // Check cache first
    const cached = cacheService.get<{ related_to: any; count: number; data: any[] }>(cacheKey);
    if (cached) {
      return cached;
    }

    // Make API request - endpoint is /v1/news/{article_id}/related
    const queryString = buildQueryString({ per_page: perPage });
    const url = `${API_BASE_URL}${API_ENDPOINTS.NEWS}/${articleId}/related${queryString}`;

    logger.info('Fetching related articles from API', { articleId, perPage });

    try {
      const response = await makeGetRequest<{ related_to: any; count: number; data: any[] }>(url, {
        'X-API-Key': this.apiKey,
      });

      // Cache the response with shorter TTL
      cacheService.set(cacheKey, response, CACHE_TTL.CURRENT_DAY);

      logger.info('Related articles fetched successfully', {
        count: response.count,
        returned: response.data.length,
      });

      return response;
    } catch (error) {
      logger.error('Failed to fetch related articles', { error });
      throw error;
    }
  }

  /**
   * Determines cache TTL based on date range
   *
   * @param _startDate - Start date filter (unused)
   * @param endDate - End date filter
   * @returns TTL in seconds
   */
  private getCacheTTL(_startDate?: string, endDate?: string): number {
    // If querying current day, use shorter TTL
    const today = new Date().toISOString().split('T')[0];

    if (!endDate || endDate >= today) {
      return CACHE_TTL.CURRENT_DAY;
    }

    // Historical data - longer TTL
    return CACHE_TTL.HISTORICAL;
  }
}

// Export singleton instance
export const newsService = new NewsService(config.NEWSDATAHUB_API_KEY);
