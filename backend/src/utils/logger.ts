import winston from 'winston';
import { config } from '../config/env';

/**
 * Winston logger configuration
 */
const logger: winston.Logger = winston.createLogger({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'news-aggregator-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info: winston.Logform.TransformableInfo): string => {
          const { level, message, timestamp, ...meta } = info;
          let msg: string = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(meta).length > 0 && meta.service) {
            delete meta.service;
            if (Object.keys(meta).length > 0) {
              msg += ` ${JSON.stringify(meta)}`;
            }
          }
          return msg;
        })
      ),
    }),
  ],
});

export default logger;
