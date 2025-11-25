# Testing Guide

This project includes comprehensive testing at multiple levels: unit tests, integration tests, and end-to-end tests.

## Test Coverage

The testing strategy covers **20-30% of essential functionality**:

### Backend Tests
- **Unit Tests** - Core utilities and business logic
  - `queryBuilder.test.ts` - Query string building and cache key generation
  - `validators.test.ts` - Input validation and sanitization
  - `cacheService.test.ts` - In-memory caching functionality

- **Integration Tests** - API endpoints
  - `health.test.ts` - Health check endpoint
  - `news.test.ts` - News search endpoint with various filters and error handling

### Frontend Tests
- **Unit Tests** - Pure functions and utilities
  - `formatters.test.ts` - Date formatting, text manipulation
  - `newsApi.test.ts` - API client with mocked fetch calls

### End-to-End Tests
- **E2E Tests** - Full user workflows
  - `news-aggregator.spec.ts` - Homepage loading, filtering, dark mode

## Running Tests

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report
```

### E2E Tests
```bash
# From project root
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run with Playwright UI
```

### Run All Tests
```bash
# From project root
npm test                 # Run backend + frontend tests
npm run test:all         # Run backend + frontend + E2E tests
```

## Test Structure

```
news-aggregator/
├── backend/
│   └── src/
│       └── __tests__/
│           ├── setup.ts              # Test environment setup
│           ├── unit/                 # Unit tests
│           │   ├── queryBuilder.test.ts
│           │   ├── validators.test.ts
│           │   └── cacheService.test.ts
│           └── integration/          # Integration tests
│               ├── health.test.ts
│               └── news.test.ts
├── frontend/
│   └── src/
│       └── __tests__/
│           ├── setup.ts              # Test environment setup
│           └── unit/                 # Unit tests
│               ├── formatters.test.ts
│               └── newsApi.test.ts
└── e2e/
    └── news-aggregator.spec.ts       # E2E tests
```

## Test Frameworks

- **Backend**: Jest + Supertest
- **Frontend**: Vitest + Testing Library
- **E2E**: Playwright

## Writing New Tests

### Backend Unit Test Example
```typescript
import { describe, it, expect } from '@jest/globals';
import { yourFunction } from '../../utils/yourModule';

describe('yourModule', () => {
  it('should do something', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### Frontend Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../../utils/yourModule';

describe('yourModule', () => {
  it('should do something', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading')).toBeVisible();
});
```

## CI/CD Integration

Tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: |
    npm run test           # Backend + Frontend
    npm run test:e2e       # E2E tests
```

## Notes

- Backend tests run in demo mode by default (no API key required)
- Frontend tests use mocked API responses
- E2E tests start both backend and frontend servers automatically
- All tests can run without external dependencies
