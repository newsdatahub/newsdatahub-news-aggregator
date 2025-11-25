import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import compression from 'compression';
import { config } from './config/env';
import logger from './utils/logger';
import { healthRouter } from './routes/health';
import { newsRouter } from './routes/news';
import { AppError } from './utils/errors';

const app: Application = express();

// Middleware
app.use(compression());
app.use(
  cors({
    origin: config.ALLOWED_ORIGINS.split(','),
    credentials: true,
  })
);
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction): void => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    ip: req.ip,
  });
  next();
});

// Routes
app.use('/api/health', healthRouter);
app.use('/api/news', newsRouter);

// 404 handler
app.use((_req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint was not found.',
  });
});

/**
 * Centralized error handling middleware
 * Handles both operational errors (AppError) and unexpected errors
 */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  // Handle custom application errors
  if (err instanceof AppError) {
    const statusCode: number = err.statusCode;
    const message: string = err.message;

    if (err.isOperational) {
      logger.warn('Operational error', { error: err, statusCode });
    } else {
      logger.error('Non-operational error', { error: err, statusCode });
    }

    res.status(statusCode).json({
      error: err.name,
      message: message,
    });
    return;
  }

  // Handle unexpected errors
  logger.error('Unhandled error', { error: err, stack: err.stack });
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Oops! Something went wrong. Please try again later.',
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT: number = config.PORT;
  app.listen(PORT, (): void => {
    logger.info(`Server started on port ${PORT}`, {
      nodeEnv: config.NODE_ENV,
      demoMode: config.ENABLE_DEMO_MODE,
    });
  });
}

export const server = app;
