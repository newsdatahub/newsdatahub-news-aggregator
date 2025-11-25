/**
 * Custom error classes for the application
 * Provides type-safe error handling with appropriate HTTP status codes
 */

/**
 * Base class for all application errors
 */
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when a requested resource is not found
 * HTTP Status: 404
 */
export class NotFoundError extends AppError {
  readonly statusCode: number = 404;
  readonly isOperational: boolean = true;

  constructor(resource: string, id?: string) {
    const message: string = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message);
  }
}

/**
 * Error thrown when request validation fails
 * HTTP Status: 400
 */
export class ValidationError extends AppError {
  readonly statusCode: number = 400;
  readonly isOperational: boolean = true;

  constructor(
    message: string,
    public readonly fields?: Record<string, string>
  ) {
    super(message);
  }
}

/**
 * Error thrown when authentication fails
 * HTTP Status: 401
 */
export class UnauthorizedError extends AppError {
  readonly statusCode: number = 401;
  readonly isOperational: boolean = true;

  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

/**
 * Error thrown when a resource is forbidden
 * HTTP Status: 403
 */
export class ForbiddenError extends AppError {
  readonly statusCode: number = 403;
  readonly isOperational: boolean = true;

  constructor(message: string = 'Forbidden') {
    super(message);
  }
}

/**
 * Error thrown when rate limit is exceeded
 * HTTP Status: 429
 */
export class RateLimitError extends AppError {
  readonly statusCode: number = 429;
  readonly isOperational: boolean = true;

  constructor(message: string = 'Too many requests') {
    super(message);
  }
}

/**
 * Error thrown when an external API call fails
 * HTTP Status: 502
 */
export class ExternalApiError extends AppError {
  readonly statusCode: number = 502;
  readonly isOperational: boolean = true;

  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
  }
}

/**
 * Error thrown for generic bad requests
 * HTTP Status: 400
 */
export class BadRequestError extends AppError {
  readonly statusCode: number = 400;
  readonly isOperational: boolean = true;

  constructor(message: string = 'Bad request') {
    super(message);
  }
}

/**
 * Error thrown for internal server errors
 * HTTP Status: 500
 */
export class InternalServerError extends AppError {
  readonly statusCode: number = 500;
  readonly isOperational: boolean = false;

  constructor(message: string = 'Internal server error') {
    super(message);
  }
}
