/**
 * Unit Tests for Input Validation
 *
 * This file demonstrates testing validation logic with error handling.
 *
 * Key testing patterns:
 * - Test valid inputs (happy path)
 * - Test invalid inputs (error path) - use toThrow matcher
 * - Test boundary conditions (min/max values)
 * - Test data type conversions (string '20' -> number 20)
 * - Test enum validation (only specific values allowed)
 * - Test business logic (start_date must be before end_date)
 * - Test sanitization (trimming whitespace)
 */

import { validateNewsSearchParams } from '../../utils/validators';
import { ValidationError } from '../../utils/errors';

describe('validators', () => {
  describe('validateNewsSearchParams', () => {
    // Happy path: all parameters are valid
    it('should validate valid parameters', () => {
      const query = {
        q: 'climate',
        country: 'us',
        language: 'en',
        per_page: '20',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      };

      const result = validateNewsSearchParams(query);

      expect(result.q).toBe('climate');
      expect(result.country).toBe('us');
      expect(result.language).toBe('en');
      expect(result.per_page).toBe(20);
      expect(result.start_date).toBe('2024-01-01');
      expect(result.end_date).toBe('2024-12-31');
    });

    // Test default value application
    it('should apply default per_page when not provided', () => {
      const query = {};

      const result = validateNewsSearchParams(query);

      expect(result.per_page).toBe(100); // DEFAULT_PAGE_SIZE
    });

    // Error handling: invalid data type should throw ValidationError
    it('should throw ValidationError for invalid per_page', () => {
      const query = { per_page: 'invalid' };

      // Use toThrow() to test that a function throws an error
      expect(() => validateNewsSearchParams(query)).toThrow(ValidationError);
      expect(() => validateNewsSearchParams(query)).toThrow('per_page must be an integer');
    });

    // Boundary test: maximum value validation
    it('should throw ValidationError for per_page exceeding max', () => {
      const query = { per_page: '200' };

      expect(() => validateNewsSearchParams(query)).toThrow(ValidationError);
      expect(() => validateNewsSearchParams(query)).toThrow('per_page must be at most 100');
    });

    // Boundary test: minimum value validation
    it('should throw ValidationError for per_page less than 1', () => {
      const query = { per_page: '0' };

      expect(() => validateNewsSearchParams(query)).toThrow(ValidationError);
      expect(() => validateNewsSearchParams(query)).toThrow('per_page must be at least 1');
    });

    // Enum validation: only specific values are allowed
    it('should validate political_leaning enum', () => {
      const query = { political_leaning: 'center' };

      const result = validateNewsSearchParams(query);

      expect(result.political_leaning).toBe('center');
    });

    // Enum validation error: invalid enum value should be rejected
    it('should throw ValidationError for invalid political_leaning', () => {
      const query = { political_leaning: 'extreme' };

      expect(() => validateNewsSearchParams(query)).toThrow(ValidationError);
      expect(() => validateNewsSearchParams(query)).toThrow('political_leaning must contain only valid values');
    });

    it('should validate source_type enum', () => {
      const query = { source_type: 'newspaper' };

      const result = validateNewsSearchParams(query);

      expect(result.source_type).toBe('newspaper');
    });

    it('should throw ValidationError for invalid source_type', () => {
      const query = { source_type: 'invalid_type' };

      expect(() => validateNewsSearchParams(query)).toThrow(ValidationError);
      expect(() => validateNewsSearchParams(query)).toThrow('source_type must contain only valid values');
    });

    // Date validation: ensure dates are in correct format
    it('should throw ValidationError for invalid date format', () => {
      const query = { start_date: 'not-a-date' };

      expect(() => validateNewsSearchParams(query)).toThrow(ValidationError);
      expect(() => validateNewsSearchParams(query)).toThrow('start_date must be a valid date');
    });

    // Business logic validation: date range must make sense
    it('should throw ValidationError when start_date is after end_date', () => {
      const query = {
        start_date: '2024-12-31',
        end_date: '2024-01-01',
      };

      expect(() => validateNewsSearchParams(query)).toThrow(ValidationError);
      expect(() => validateNewsSearchParams(query)).toThrow('start_date must be before or equal to end_date');
    });

    // Data sanitization: whitespace should be trimmed
    it('should trim string parameters', () => {
      const query = {
        q: '  climate change  ',
        country: '  us  ',
      };

      const result = validateNewsSearchParams(query);

      expect(result.q).toBe('climate change');
      expect(result.country).toBe('us');
    });

    // Edge case: handle null, undefined, and empty string
    it('should handle undefined and empty string parameters', () => {
      const query = {
        q: '',
        country: undefined,
        language: null,
      };

      const result = validateNewsSearchParams(query);

      expect(result.q).toBeUndefined();
      expect(result.country).toBeUndefined();
      expect(result.language).toBeUndefined();
    });
  });
});
