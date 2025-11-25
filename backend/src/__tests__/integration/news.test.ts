/**
 * Integration Tests for News Search Endpoint
 *
 * This file demonstrates comprehensive integration testing for a REST API endpoint.
 *
 * Key testing patterns:
 * - Test happy path with valid inputs
 * - Test various filter combinations
 * - Test error handling (400 Bad Request responses)
 * - Test query parameter handling
 * - Verify both successful and error responses
 * - Test 404 handler for unknown routes
 */

import request from 'supertest';
import { server } from '../../server';

describe('GET /api/news/search', () => {
  // Happy path: basic search should return results
  it('should return news articles in demo mode', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ q: 'climate' })  // Pass query parameters via .query()
      .expect('Content-Type', /json/)
      .expect(200);

    // Verify response structure
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('is_demo');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(typeof response.body.is_demo).toBe('boolean');
  });

  // Test filtering functionality
  it('should filter articles by country', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ country: 'us' })
      .expect(200);

    // Basic verification that filtering doesn't break the response
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // Test pagination support
  it('should handle pagination parameters', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ per_page: '5' })
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // Error handling: invalid inputs should return 400 Bad Request
  it('should return 400 for invalid per_page', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ per_page: 'invalid' })
      .expect(400);  // Expect 400 Bad Request for validation errors

    // Verify error response structure
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
  });

  // Boundary test: exceeding max value
  it('should return 400 for per_page exceeding maximum', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ per_page: '200' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 for invalid date format', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ start_date: 'not-a-date' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 when start_date is after end_date', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ start_date: '2024-12-31', end_date: '2024-01-01' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
  });

  it('should handle political_leaning filter', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ political_leaning: 'center' })
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });

  it('should return 400 for invalid political_leaning', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ political_leaning: 'invalid' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
  });

  it('should handle source_type filter', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ source_type: 'newspaper' })
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });

  it('should return 400 for invalid source_type', async () => {
    const response = await request(server)
      .get('/api/news/search')
      .query({ source_type: 'invalid_type' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
  });
});

// Test global 404 error handler
describe('404 handler', () => {
  // Verify that requests to non-existent routes are handled properly
  it('should return 404 for unknown endpoints', async () => {
    const response = await request(server)
      .get('/api/unknown')
      .expect('Content-Type', /json/)
      .expect(404);  // Expect 404 Not Found

    // Verify error response format
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.error).toBe('Not Found');
  });
});
