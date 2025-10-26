import { Router, Request, Response } from 'express';
import { config } from '../config/env';
import { HealthCheckResponse } from '../types/news';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (_req: Request, res: Response<HealthCheckResponse>) => {
  res.json({
    ok: true,
    demo_mode: config.ENABLE_DEMO_MODE,
    api_configured: !!config.NEWSDATAHUB_API_KEY,
  });
});

export default router;
