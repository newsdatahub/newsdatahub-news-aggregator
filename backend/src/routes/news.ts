import { Router, Request, Response } from 'express';
import { config } from '../config/env';
import { NewsSearchParams, NewsSearchResponse } from '../types/news';
import { newsService } from '../services/newsService';
import { demoDataService } from '../services/demoDataService';
import logger from '../utils/logger';

const router = Router();

/**
 * GET /api/news/search
 * Search and filter news articles
 */
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const params: NewsSearchParams = {
      q: req.query.q as string | undefined,
      country: req.query.country as string | undefined,
      language: req.query.language as string | undefined,
      political_leaning: req.query.political_leaning as string | undefined,
      topic: req.query.topic as string | undefined,
      exclude_topic: req.query.exclude_topic as string | undefined,
      source_type: req.query.source_type as string | undefined,
      start_date: req.query.start_date as string | undefined,
      end_date: req.query.end_date as string | undefined,
      per_page: req.query.per_page ? parseInt(req.query.per_page as string, 10) : undefined,
      cursor: req.query.cursor as string | undefined,
    };

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
  } catch (error) {
    logger.error('Error in news search', { error });

    // Handle API errors
    const httpError = error as { statusCode?: number; body?: { message?: string } };

    if (httpError.statusCode === 429) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Daily API quota exceeded. Please try again tomorrow or enable demo mode.',
      });
      return;
    }

    if (httpError.statusCode === 401) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'API key is invalid or expired. Please check your configuration.',
      });
      return;
    }

    if (httpError.statusCode === 400) {
      res.status(400).json({
        error: 'Bad Request',
        message: httpError.body?.message || 'Invalid search parameters. Please adjust your filters.',
      });
      return;
    }

    // Generic error
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Oops! Something went wrong. Please try again later.',
    });
  }
});

/**
 * GET /api/news/related/:articleId
 * Get related articles for a given article
 */
router.get('/related/:articleId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { articleId } = req.params;
    const perPage = req.query.per_page ? parseInt(req.query.per_page as string, 10) : 10;

    logger.info('Related articles request', { articleId, perPage });

    // Use demo mode if enabled
    if (config.ENABLE_DEMO_MODE) {
      // In demo mode, return a subset of demo articles with related structure
      const demoResult = demoDataService.getArticles({ per_page: perPage });
      res.json({
        related_to: {
          id: articleId,
          title: 'Demo Article',
          source_title: 'Demo Source',
          article_link: 'https://example.com',
          pub_date: new Date().toISOString(),
        },
        count: demoResult.data.length,
        data: demoResult.data,
      });
      logger.info('Returning demo related articles', { count: demoResult.data.length });
    } else {
      // Use real API
      const apiResult = await newsService.getRelatedArticles(articleId, perPage);
      res.json(apiResult);
    }
  } catch (error) {
    logger.error('Error fetching related articles', { error });

    // Handle API errors
    const httpError = error as { statusCode?: number; body?: { message?: string } };

    if (httpError.statusCode === 429) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Daily API quota exceeded. Please try again tomorrow or enable demo mode.',
      });
      return;
    }

    if (httpError.statusCode === 401) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'API key is invalid or expired. Please check your configuration.',
      });
      return;
    }

    if (httpError.statusCode === 404) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Article not found or no related articles available.',
      });
      return;
    }

    // Generic error
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Oops! Something went wrong. Please try again later.',
    });
  }
});

export default router;
