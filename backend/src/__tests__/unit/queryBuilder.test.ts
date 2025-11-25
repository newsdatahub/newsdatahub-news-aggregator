/**
 * Unit Tests for Query Builder Utilities
 *
 * This file demonstrates unit testing for pure utility functions.
 * These functions take input and return output without side effects,
 * making them ideal for unit testing.
 *
 * Key testing patterns:
 * - Test happy path with all parameters
 * - Test edge cases (empty, undefined, special characters)
 * - Test data transformations (trimming, sorting)
 * - Use descriptive test names that explain the expected behavior
 */

import { buildNewsQuery, buildCacheKey } from '../../utils/queryBuilder';
import { NewsSearchParams } from '../../types/news';

describe('queryBuilder', () => {
  describe('buildNewsQuery', () => {
    // Test the happy path: all parameters provided and valid
    it('should build query with all parameters', () => {
      const params: NewsSearchParams = {
        q: 'climate change',
        country: 'us,uk',
        language: 'en',
        political_leaning: 'center',
        topic: 'politics,environment',
        exclude_topic: 'sports',
        source_type: 'newspaper',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        per_page: 20,
        cursor: 'abc123',
        sort_by: 'pub_date',
      };

      const result = buildNewsQuery(params);

      // Assert that all parameters are passed through correctly
      expect(result).toEqual({
        q: 'climate change',
        country: 'us,uk',
        language: 'en',
        political_leaning: 'center',
        topic: 'politics,environment',
        exclude_topic: 'sports',
        source_type: 'newspaper',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        per_page: 20,
        cursor: 'abc123',
        sort_by: 'pub_date',
      });
    });

    // Edge case: empty object should return empty object
    it('should handle empty parameters', () => {
      const params: NewsSearchParams = {};

      const result = buildNewsQuery(params);

      expect(result).toEqual({});
    });

    // Important: test string sanitization to prevent extra whitespace
    it('should trim query string', () => {
      const params: NewsSearchParams = {
        q: '  climate change  ',
      };

      const result = buildNewsQuery(params);

      expect(result.q).toBe('climate change');
    });

    // Verify that undefined values are not included in the query object
    it('should omit undefined parameters', () => {
      const params: NewsSearchParams = {
        q: 'test',
        country: undefined,
        language: undefined,
      };

      const result = buildNewsQuery(params);

      // Only defined parameters should be present
      expect(result).toEqual({ q: 'test' });
      expect(result.country).toBeUndefined();
      expect(result.language).toBeUndefined();
    });
  });

  describe('buildCacheKey', () => {
    // Cache keys must be deterministic: same input = same key
    it('should create consistent cache keys', () => {
      const params: NewsSearchParams = {
        q: 'test',
        country: 'us',
        language: 'en',
      };

      const key1 = buildCacheKey(params);
      const key2 = buildCacheKey(params);

      // Multiple calls with same params should produce identical keys
      expect(key1).toBe(key2);
    });

    // Critical: parameter order shouldn't matter for caching
    // {q: 'test', country: 'us'} should have same key as {country: 'us', q: 'test'}
    it('should sort parameters alphabetically', () => {
      const params1: NewsSearchParams = {
        q: 'test',
        country: 'us',
        language: 'en',
      };

      const params2: NewsSearchParams = {
        language: 'en',
        country: 'us',
        q: 'test',
      };

      const key1 = buildCacheKey(params1);
      const key2 = buildCacheKey(params2);

      // Different parameter order should produce the same key
      expect(key1).toBe(key2);
      // Verify the keys are alphabetically sorted
      expect(key1).toBe('country=us&language=en&q=test');
    });

    // Edge case: empty params should produce empty key
    it('should handle empty parameters', () => {
      const params: NewsSearchParams = {};

      const key = buildCacheKey(params);

      expect(key).toBe('');
    });
  });
});
