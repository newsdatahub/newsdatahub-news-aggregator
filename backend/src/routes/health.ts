import { Router, Request, Response } from 'express';
import { config } from '../config/env';
import { HealthCheckResponse } from '../types/news';

const router: Router = Router();

/**
 * GET /api/health
 * Health check endpoint to verify API status and configuration
 */
router.get('/', (_req: Request, res: Response<HealthCheckResponse>): void => {
  const response: HealthCheckResponse = {
    ok: true,
    demo_mode: config.ENABLE_DEMO_MODE,
    api_configured: !!config.NEWSDATAHUB_API_KEY,
  };

  res.json(response);
});

export const healthRouter = router;
