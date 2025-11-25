import { Router, Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { NewsSearchParams, NewsSearchResponse } from '../types/news';
import { newsService } from '../services/newsService';
import { demoDataService } from '../services/demoDataService';
import { validateNewsSearchParams } from '../utils/validators';
import {
  RateLimitError,
  UnauthorizedError,
  BadRequestError,
  ExternalApiError,
} from '../utils/errors';
import logger from '../utils/logger';

const router: Router = Router();

/**
 * GET /api/news/search
 * Search and filter news articles based on various parameters
 * @throws {ValidationError} If request parameters are invalid
 * @throws {RateLimitError} If API rate limit is exceeded
 * @throws {UnauthorizedError} If API authentication fails
 */
router.get('/search', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request parameters
    const params: NewsSearchParams = validateNewsSearchParams(req.query);

    logger.info('News search request', { params });

    let response: NewsSearchResponse;

    // Use demo mode if enabled
    if (config.ENABLE_DEMO_MODE) {
      const demoResult = demoDataService.getArticles(params);
      response = {
        ...demoResult,
        is_demo: true,
      };
      logger.info('Returning demo data', { count: demoResult.data.length });
    } else {
      // Use real API
      const apiResult = await newsService.searchArticles(params);
      response = {
        ...apiResult,
        is_demo: false,
      };
    }

    res.json(response);
  } catch (error: unknown) {
    // Map HTTP errors from external API to custom error classes
    const httpError = error as { statusCode?: number; body?: { message?: string } };

    if (httpError.statusCode === 429) {
      logger.warn('API rate limit exceeded');
      return next(new RateLimitError('Daily API quota exceeded. Please try again tomorrow or enable demo mode.'));
    }

    if (httpError.statusCode === 401) {
      logger.error('API authentication failed');
      return next(new UnauthorizedError('API key is invalid or expired. Please check your configuration.'));
    }

    if (httpError.statusCode === 400) {
      logger.warn('Invalid API request', { message: httpError.body?.message });
      return next(new BadRequestError(httpError.body?.message || 'Invalid search parameters. Please adjust your filters.'));
    }

    if (httpError.statusCode) {
      logger.error('External API error', { statusCode: httpError.statusCode, error });
      return next(new ExternalApiError('Failed to fetch news from external API', error));
    }

    // Pass other errors to error handling middleware
    logger.error('Error in news search', { error });
    next(error);
  }
});

export const newsRouter = router;
