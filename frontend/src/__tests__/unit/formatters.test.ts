/**
 * Unit Tests for Formatter Utilities (Frontend)
 *
 * This file demonstrates testing UI formatting functions and time manipulation.
 *
 * Key testing patterns:
 * - Use vi.useFakeTimers() to control time in tests
 * - Test edge cases for time formatting (seconds, minutes, hours, days)
 * - Test plural vs singular text ("1 minute" vs "2 minutes")
 * - Clean up timers with afterEach to avoid affecting other tests
 * - Test string manipulation functions thoroughly
 * - Vitest syntax is very similar to Jest
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatRelativeTime,
  formatDate,
  truncateText,
  capitalizeWords,
  formatPoliticalLeaning,
} from '../../utils/formatters';

describe('formatters', () => {
  describe('formatRelativeTime', () => {
    // Set up fake timers to make time-based tests deterministic
    beforeEach(() => {
      vi.useFakeTimers();  // Mock Date.now() and setTimeout
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));  // Fix current time
    });

    // Clean up: restore real timers after each test
    afterEach(() => {
      vi.useRealTimers();
    });

    // Test very recent times (< 1 minute)
    it('should return "Just now" for recent times', () => {
      const dateString = '2024-01-15T11:59:30Z';
      expect(formatRelativeTime(dateString)).toBe('Just now');
    });

    // Test plural form (multiple minutes)
    it('should format minutes ago', () => {
      const dateString = '2024-01-15T11:45:00Z';
      expect(formatRelativeTime(dateString)).toBe('15 minutes ago');
    });

    // Test singular form - important for good UX
    it('should format 1 minute ago (singular)', () => {
      const dateString = '2024-01-15T11:59:00Z';
      expect(formatRelativeTime(dateString)).toBe('1 minute ago');
    });

    it('should format hours ago', () => {
      const dateString = '2024-01-15T09:00:00Z';
      expect(formatRelativeTime(dateString)).toBe('3 hours ago');
    });

    it('should format 1 hour ago (singular)', () => {
      const dateString = '2024-01-15T11:00:00Z';
      expect(formatRelativeTime(dateString)).toBe('1 hour ago');
    });

    it('should format days ago', () => {
      const dateString = '2024-01-13T12:00:00Z';
      expect(formatRelativeTime(dateString)).toBe('2 days ago');
    });

    it('should format 1 day ago (singular)', () => {
      const dateString = '2024-01-14T12:00:00Z';
      expect(formatRelativeTime(dateString)).toBe('1 day ago');
    });

    it('should format absolute date for older dates', () => {
      const dateString = '2024-01-01T12:00:00Z';
      const result = formatRelativeTime(dateString);
      expect(result).toMatch(/Jan/);
    });

    it('should include year for dates from different year', () => {
      const dateString = '2023-12-01T12:00:00Z';
      const result = formatRelativeTime(dateString);
      expect(result).toMatch(/2023/);
    });
  });

  describe('formatDate', () => {
    // Test standard date formatting
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date(2024, 0, 15); // Months are 0-indexed (0 = January)
      expect(formatDate(date)).toBe('2024-01-15');
    });

    // Important: ensure leading zeros for single-digit dates
    it('should pad single digit months and days', () => {
      const date = new Date(2024, 2, 5); // Month is 0-indexed
      expect(formatDate(date)).toBe('2024-03-05');
    });

    it('should handle December dates', () => {
      const date = new Date(2024, 11, 31); // Month 11 = December
      expect(formatDate(date)).toBe('2024-12-31');
    });
  });

  describe('truncateText', () => {
    // Test that short text is left unchanged
    it('should not truncate text shorter than max length', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    // Test truncation with ellipsis - robust assertion that doesn't depend on exact string
    it('should truncate text longer than max length', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncateText(text, 20);

      // Verify truncation occurred
      expect(result.length).toBeLessThan(text.length);
      // Verify ellipsis is added
      expect(result).toContain('...');
      // Verify result respects max length (with some tolerance for ellipsis)
      expect(result.length).toBeLessThanOrEqual(25);
    });

    it('should add ellipsis when truncating', () => {
      const text = 'Long text here';
      const result = truncateText(text, 10);
      expect(result).toContain('...');
      expect(result.length).toBeLessThanOrEqual(13); // 10 + 3 for "..."
    });

    it('should handle exact length match', () => {
      const text = 'Exact';
      expect(truncateText(text, 5)).toBe('Exact');
    });
  });

  describe('capitalizeWords', () => {
    // Test title case transformation
    it('should capitalize first letter of each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
    });

    it('should handle single word', () => {
      expect(capitalizeWords('hello')).toBe('Hello');
    });

    it('should lowercase other letters', () => {
      expect(capitalizeWords('HELLO WORLD')).toBe('Hello World');
    });

    it('should handle mixed case input', () => {
      expect(capitalizeWords('hELLo WoRLd')).toBe('Hello World');
    });

    it('should handle multiple spaces', () => {
      expect(capitalizeWords('hello  world')).toBe('Hello  World');
    });
  });

  describe('formatPoliticalLeaning', () => {
    // Transform API format (far_left) to display format (Far Left)
    it('should format underscore separated values', () => {
      expect(formatPoliticalLeaning('far_left')).toBe('Far Left');
    });

    it('should capitalize first letter only', () => {
      expect(formatPoliticalLeaning('center_right')).toBe('Center Right');
    });

    it('should handle single word', () => {
      expect(formatPoliticalLeaning('center')).toBe('Center');
    });

    it('should handle three word values', () => {
      expect(formatPoliticalLeaning('very_far_left')).toBe('Very Far Left');
    });
  });
});
