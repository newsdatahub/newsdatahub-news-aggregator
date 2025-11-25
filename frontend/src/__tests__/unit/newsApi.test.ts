/**
 * Unit Tests for API Client (Frontend)
 *
 * This file demonstrates testing API calls and HTTP requests in the frontend.
 *
 * Key testing patterns:
 * - Mock the global fetch API using vi.fn()
 * - Test successful responses (happy path)
 * - Test error responses (network errors, HTTP errors)
 * - Verify correct URLs and query parameters are used
 * - Use vi.clearAllMocks() to reset mocks between tests
 * - Mock resolved and rejected promises
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchArticles, checkHealth } from '../../services/newsApi';

// Mock the global fetch function for testing
globalThis.fetch = vi.fn() as any;

describe('newsApi', () => {
  // Clear mocks before each test to avoid interference
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchArticles', () => {
    // Test that API calls are made with correct parameters
    it('should fetch articles with query parameters', async () => {
      const mockResponse = {
        data: [{ id: '1', title: 'Test Article' }],
        is_demo: true,
      };

      // Mock successful fetch response
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchArticles({ q: 'climate' });

      // Verify fetch was called with correct URL
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/news/search?q=climate')
      );
      // Verify result matches mock data
      expect(result).toEqual(mockResponse);
    });

    // Test query string building with multiple parameters
    it('should build query string with multiple parameters', async () => {
      const mockResponse = {
        data: [],
        is_demo: true,
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchArticles({
        q: 'climate',
        country: 'us',
        language: 'en',
      });

      // Verify all parameters appear in the URL
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=climate')
      );
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('country=us')
      );
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('language=en')
      );
    });

    // Test that undefined parameters are not included in URL
    it('should omit undefined parameters from query string', async () => {
      const mockResponse = {
        data: [],
        is_demo: true,
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchArticles({
        q: 'climate',
        country: undefined,
      });

      // Extract the URL that was called
      const callUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callUrl).toContain('q=climate');
      expect(callUrl).not.toContain('country');  // Undefined params excluded
    });

    // Test error handling: HTTP error responses
    it('should throw error on failed response', async () => {
      // Mock failed HTTP response (e.g., 404, 500)
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'API error' }),
      });

      // Function should throw an error for failed responses
      await expect(searchArticles({ q: 'test' })).rejects.toThrow();
    });

    // Test error handling: network failures
    it('should handle network errors', async () => {
      // Mock network failure (e.g., no internet, DNS error)
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      // Function should propagate the network error
      await expect(searchArticles({ q: 'test' })).rejects.toThrow('Network error');
    });
  });

  describe('checkHealth', () => {
    // Test health check endpoint
    it('should fetch health status', async () => {
      const mockResponse = {
        ok: true,
        demo_mode: true,
        api_configured: false,
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await checkHealth();

      // Verify correct endpoint was called
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/health')
      );
      expect(result).toEqual(mockResponse);
    });

    // Test health check error handling
    it('should throw error on failed health check', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await expect(checkHealth()).rejects.toThrow('Health check failed');
    });
  });
});
