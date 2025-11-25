/**
 * Unit Tests for Cache Service
 *
 * This file demonstrates testing a stateful service that manages data in memory.
 *
 * Key testing patterns:
 * - Use beforeEach to reset state between tests (ensures test isolation)
 * - Test CRUD operations (Create, Read, Update, Delete)
 * - Test edge cases (expired entries, non-existent keys, different data types)
 * - Test async behavior (TTL expiration with setTimeout)
 * - Verify error handling (deleting non-existent keys should not throw)
 */

import { cacheService } from '../../services/cacheService';

describe('cacheService', () => {
  // Reset state before each test to ensure tests don't affect each other
  beforeEach(() => {
    // Clear cache before each test
    cacheService.clear();
  });

  describe('set and get', () => {
    // Basic functionality: store and retrieve data
    it('should store and retrieve a value', () => {
      const key = 'test-key';
      const data = { message: 'test data' };

      cacheService.set(key, data, 60);
      const result = cacheService.get(key);

      expect(result).toEqual(data);
    });

    // Edge case: accessing a key that doesn't exist
    it('should return null for non-existent key', () => {
      const result = cacheService.get('non-existent');

      expect(result).toBeNull();
    });

    // Important: test TTL (Time To Live) expiration
    // This demonstrates testing async behavior with setTimeout
    it('should return null for expired entry', async () => {
      const key = 'test-key';
      const data = { message: 'test data' };

      // Set with 1 second TTL
      cacheService.set(key, data, 1);

      // Wait for expiration (1100ms to ensure it's definitely expired)
      await new Promise(resolve => setTimeout(resolve, 1100));

      const result = cacheService.get(key);

      // Expired entry should return null
      expect(result).toBeNull();
    });

    // Verify cache works with various data types (not just objects)
    it('should handle different data types', () => {
      cacheService.set('string', 'test', 60);
      cacheService.set('number', 42, 60);
      cacheService.set('boolean', true, 60);
      cacheService.set('object', { key: 'value' }, 60);
      cacheService.set('array', [1, 2, 3], 60);

      expect(cacheService.get('string')).toBe('test');
      expect(cacheService.get('number')).toBe(42);
      expect(cacheService.get('boolean')).toBe(true);
      expect(cacheService.get('object')).toEqual({ key: 'value' });
      expect(cacheService.get('array')).toEqual([1, 2, 3]);
    });
  });

  describe('delete', () => {
    // Test the Delete operation in CRUD
    it('should delete a cache entry', () => {
      const key = 'test-key';
      cacheService.set(key, 'test data', 60);

      cacheService.delete(key);
      const result = cacheService.get(key);

      expect(result).toBeNull();
    });

    // Edge case: deleting a non-existent key should not throw an error
    it('should handle deleting non-existent key', () => {
      expect(() => cacheService.delete('non-existent')).not.toThrow();
    });
  });

  describe('clear', () => {
    // Test bulk delete operation
    it('should clear all entries', () => {
      cacheService.set('key1', 'data1', 60);
      cacheService.set('key2', 'data2', 60);
      cacheService.set('key3', 'data3', 60);

      cacheService.clear();

      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
      expect(cacheService.get('key3')).toBeNull();
      expect(cacheService.size()).toBe(0);
    });
  });

  describe('size', () => {
    // Test that size tracking is accurate across operations
    it('should return correct cache size', () => {
      expect(cacheService.size()).toBe(0);

      cacheService.set('key1', 'data1', 60);
      expect(cacheService.size()).toBe(1);

      cacheService.set('key2', 'data2', 60);
      expect(cacheService.size()).toBe(2);

      cacheService.delete('key1');
      expect(cacheService.size()).toBe(1);

      cacheService.clear();
      expect(cacheService.size()).toBe(0);
    });
  });
});
