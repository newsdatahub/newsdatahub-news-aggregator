/**
 * Integration Tests for Health Endpoint
 *
 * This file demonstrates integration testing for HTTP endpoints.
 * Unlike unit tests that test functions in isolation, integration tests
 * verify that multiple components work together correctly.
 *
 * Key testing patterns:
 * - Use supertest to make HTTP requests to your Express server
 * - Test full request/response cycle
 * - Verify HTTP status codes and response headers
 * - Check response body structure and data types
 * - No need to mock - test against actual server
 */

import request from 'supertest';
import { server } from '../../server';

describe('GET /api/health', () => {
  // Integration test: verify entire health check endpoint works
  it('should return health check status', async () => {
    const response = await request(server)
      .get('/api/health')
      .expect('Content-Type', /json/)  // Verify Content-Type header
      .expect(200);  // Verify HTTP 200 OK status

    // Verify response structure - all required fields present
    expect(response.body).toHaveProperty('ok');
    expect(response.body).toHaveProperty('demo_mode');
    expect(response.body).toHaveProperty('api_configured');

    // Verify response values and data types
    expect(response.body.ok).toBe(true);
    expect(typeof response.body.demo_mode).toBe('boolean');
    expect(typeof response.body.api_configured).toBe('boolean');
  });
});
