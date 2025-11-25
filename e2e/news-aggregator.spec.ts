/**
 * End-to-End (E2E) Tests with Playwright
 *
 * This file demonstrates E2E testing of the entire application in a real browser.
 * Unlike unit/integration tests, E2E tests simulate actual user interactions.
 *
 * Key testing patterns:
 * - Test complete user flows from start to finish
 * - Use page.goto() to navigate to pages
 * - Use page.locator() and getByRole() to find elements
 * - Use waitForSelector() for async operations (data loading)
 * - Test user interactions (clicking, typing)
 * - Verify visual elements are visible
 * - Test API endpoints directly with page.request
 * - Use timeouts for slow operations
 *
 * Playwright automatically starts your backend and frontend servers
 * (configured in playwright.config.ts)
 */

import { test, expect } from '@playwright/test';

test.describe('News Aggregator E2E', () => {
  // Test the main user flow: viewing articles
  test('should load homepage and display articles in demo mode', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check page title in browser tab
    await expect(page).toHaveTitle(/News Aggregator/i);

    // Check header is present using accessible role
    await expect(page.getByRole('heading', { name: /news aggregator/i })).toBeVisible();

    // Wait for articles to load (API call completes)
    await page.waitForSelector('article', { timeout: 10000 });

    // Verify articles are displayed
    const articles = page.locator('article');
    await expect(articles).not.toHaveCount(0);

    // Check that first article has required elements
    const firstArticle = articles.first();
    await expect(firstArticle.locator('h3')).toBeVisible(); // Article title
    await expect(firstArticle.locator('p')).toBeVisible(); // Article description
  });

  // Test filtering functionality - a key user interaction
  test('should apply country filter', async ({ page }) => {
    await page.goto('/');

    // Wait for initial articles to load
    await page.waitForSelector('article', { timeout: 10000 });

    // Simulate user clicking the filters button
    await page.getByRole('button', { name: /filters/i }).click();

    // Wait for filter panel to be visible (replaces arbitrary timeout)
    const countryFilter = page.locator('.filter-label-text', { hasText: 'Countries' }).locator('..');
    await expect(countryFilter).toBeVisible({ timeout: 5000 });

    // Find the multi-select trigger
    const multiSelect = countryFilter.locator('.multi-select-trigger');

    // Check if element is visible before interacting
    if (await multiSelect.isVisible({ timeout: 5000 })) {
      await multiSelect.click();

      // Wait for dropdown options to appear (replaces arbitrary timeout)
      const firstOption = page.locator('.multi-select-option').first();
      await expect(firstOption).toBeVisible({ timeout: 2000 });
      await firstOption.click();
    }

    // Apply the selected filters
    await page.getByRole('button', { name: /apply/i }).click();

    // Wait for filtered results to load - articles should reload
    await page.waitForLoadState('networkidle');

    // Verify filtered articles are displayed
    const articles = page.locator('article');
    await expect(articles).not.toHaveCount(0);
  });

  // Test API endpoint directly (without going through UI)
  test('should check health endpoint', async ({ page }) => {
    // Make a direct HTTP request to health endpoint (bypassing UI)
    const response = await page.request.get('http://localhost:3001/api/health');

    // Verify response is successful
    expect(response.ok()).toBeTruthy();

    // Verify response structure
    const data = await response.json();
    expect(data).toHaveProperty('ok', true);
    expect(data).toHaveProperty('demo_mode');
    expect(data).toHaveProperty('api_configured');
  });

  // Test theme switching functionality
  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');

    // Find dark mode toggle button
    const darkModeToggle = page.getByRole('button', { name: /dark mode|light mode/i });

    if (await darkModeToggle.isVisible()) {
      // Capture initial theme state
      const htmlElement = page.locator('html');
      const initialClass = await htmlElement.getAttribute('class');

      // User clicks dark mode toggle
      await darkModeToggle.click();

      // Wait for theme class to change on html element (replaces arbitrary timeout)
      await page.waitForFunction(
        (prevClass) => document.documentElement.className !== prevClass,
        initialClass,
        { timeout: 1000 }
      );

      // Verify theme changed (class on <html> element should be different)
      const newClass = await htmlElement.getAttribute('class');
      expect(newClass).not.toBe(initialClass);
    }
  });
});
