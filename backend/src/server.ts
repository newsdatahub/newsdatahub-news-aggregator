import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import { config } from './config/env';
import logger from './utils/logger';
import healthRouter from './routes/health';
import newsRouter from './routes/news';

const app = express();

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
app.use((req: Request, _res: Response, next: NextFunction) => {
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
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint was not found.',
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', { error: err });
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Oops! Something went wrong. Please try again later.',
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, {
    nodeEnv: config.NODE_ENV,
    demoMode: config.ENABLE_DEMO_MODE,
  });
});

export default app;
