/**
 * Request validation utilities
 * Provides type-safe validation for API request parameters
 */

import { NewsSearchParams, PoliticalLeaning, SourceType } from '../types/news';
import { ValidationError } from './errors';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../config/constants';

/**
 * Valid political leaning values
 */
const VALID_POLITICAL_LEANINGS: readonly PoliticalLeaning[] = [
  'far_left',
  'left',
  'center_left',
  'center',
  'center_right',
  'right',
  'far_right',
] as const;

/**
 * Valid source type values
 */
const VALID_SOURCE_TYPES: readonly SourceType[] = [
  'newspaper',
  'magazine',
  'digital_native',
  'mainstream_news',
  'blog',
  'specialty_news',
  'press_release',
] as const;

/**
 * Valid sort field values
 */
const VALID_SORT_FIELDS: readonly string[] = [
  'publishedAt',
  'title',
  'source',
  'pub_date',
  'date',
] as const;

/**
 * Validates and parses a string parameter
 */
function validateString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }

  return value.trim();
}

/**
 * Validates and parses an integer parameter
 */
function validateInteger(
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number
): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed: number = typeof value === 'string' ? parseInt(value, 10) : Number(value);

  if (isNaN(parsed) || !Number.isInteger(parsed)) {
    throw new ValidationError(`${fieldName} must be an integer`);
  }

  if (min !== undefined && parsed < min) {
    throw new ValidationError(`${fieldName} must be at least ${min}`);
  }

  if (max !== undefined && parsed > max) {
    throw new ValidationError(`${fieldName} must be at most ${max}`);
  }

  return parsed;
}

/**
 * Validates a date string in ISO format
 */
function validateDate(value: unknown, fieldName: string): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a date string`);
  }

  const trimmed: string = value.trim();
  const date: Date = new Date(trimmed);

  if (isNaN(date.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date`);
  }

  return trimmed;
}

/**
 * Validates a value against an allowed list
 */
function validateEnum<T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[]
): T | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }

  const trimmed = value.trim() as T;

  if (!allowedValues.includes(trimmed)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`
    );
  }

  return trimmed;
}

/**
 * Validates and parses news search parameters from query string
 * @param query - Raw query parameters from request
 * @returns {NewsSearchParams} Validated and typed search parameters
 * @throws {ValidationError} If validation fails
 */
export function validateNewsSearchParams(query: Record<string, unknown>): NewsSearchParams {
  const params: NewsSearchParams = {};

  // Validate string fields
  params.q = validateString(query.q, 'q');
  params.country = validateString(query.country, 'country');
  params.language = validateString(query.language, 'language');
  params.topic = validateString(query.topic, 'topic');
  params.exclude_topic = validateString(query.exclude_topic, 'exclude_topic');
  params.cursor = validateString(query.cursor, 'cursor');

  // Validate enum fields with comma-separated support
  // political_leaning supports comma-separated values (e.g., "center,center_left")
  if (query.political_leaning) {
    const leanings = String(query.political_leaning)
      .split(',')
      .map((l) => l.trim());
    leanings.forEach((leaning) => {
      if (!VALID_POLITICAL_LEANINGS.includes(leaning as PoliticalLeaning)) {
        throw new ValidationError(
          `political_leaning must contain only valid values: ${VALID_POLITICAL_LEANINGS.join(', ')}`
        );
      }
    });
    params.political_leaning = query.political_leaning as string;
  }

  // source_type supports comma-separated values (e.g., "newspaper,magazine")
  if (query.source_type) {
    const types = String(query.source_type)
      .split(',')
      .map((t) => t.trim());
    types.forEach((type) => {
      if (!VALID_SOURCE_TYPES.includes(type as SourceType)) {
        throw new ValidationError(
          `source_type must contain only valid values: ${VALID_SOURCE_TYPES.join(', ')}`
        );
      }
    });
    params.source_type = query.source_type as string;
  }
  params.sort_by = validateEnum(
    query.sort_by,
    'sort_by',
    VALID_SORT_FIELDS
  );

  // Validate date fields
  params.start_date = validateDate(query.start_date, 'start_date');
  params.end_date = validateDate(query.end_date, 'end_date');

  // Validate date range
  if (params.start_date && params.end_date) {
    const startDate: Date = new Date(params.start_date);
    const endDate: Date = new Date(params.end_date);

    if (startDate > endDate) {
      throw new ValidationError('start_date must be before or equal to end_date');
    }
  }

  // Validate pagination
  params.per_page = validateInteger(query.per_page, 'per_page', 1, MAX_PAGE_SIZE);

  // Apply default per_page if not provided
  if (params.per_page === undefined) {
    params.per_page = DEFAULT_PAGE_SIZE;
  }

  return params;
}
