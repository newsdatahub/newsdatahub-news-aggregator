/**
 * Component Tests for ArticleCard (Frontend)
 *
 * This file demonstrates testing React components with Vitest and React Testing Library.
 *
 * Key testing patterns:
 * - Use render() to mount React components in tests
 * - Use screen.getByRole() and other queries to find elements
 * - Test component rendering with different props
 * - Test conditional rendering (topics, placeholder images)
 * - Test user interactions (image error handling)
 * - Use fireEvent to simulate browser events
 * - Verify correct DOM structure and accessibility
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleCard } from '../../components/ArticleCard';
import type { NewsArticle } from '../../types/news';

describe('ArticleCard', () => {
  // Create a mock article with all required fields for testing
  const mockArticle: NewsArticle = {
    id: '1',
    title: 'Test Article Title',
    description: 'This is a test article description',
    article_link: 'https://example.com/article',
    pub_date: '2024-01-15T12:00:00Z',
    source_title: 'Test Source',
    media_url: 'https://example.com/image.jpg',
    topics: ['politics', 'environment', 'technology'],
    country: 'us',
    language: 'en',
  };

  // Test basic rendering - verify essential elements are present
  it('should render article with title, description, and source', () => {
    render(<ArticleCard article={mockArticle} />);

    // Use accessible queries - getByRole is preferred for accessibility testing
    const heading = screen.getByRole('heading', { name: /test article title/i });
    expect(heading).toBeInTheDocument();

    // Verify description is displayed
    expect(screen.getByText(/test article description/i)).toBeInTheDocument();

    // Verify source is displayed
    expect(screen.getByText(/test source/i)).toBeInTheDocument();
  });

  // Test that links are properly rendered with correct href attributes
  it('should render article link with correct href', () => {
    render(<ArticleCard article={mockArticle} />);

    // Find all links (title link and "Read More" link)
    const links = screen.getAllByRole('link');

    // Both links should point to the article URL
    expect(links[0]).toHaveAttribute('href', 'https://example.com/article');
    expect(links[1]).toHaveAttribute('href', 'https://example.com/article');

    // Verify links open in new tab for security
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // Test image rendering with valid media URL
  it('should render article image when media_url is provided', () => {
    render(<ArticleCard article={mockArticle} />);

    const image = screen.getByRole('img', { name: /test article title/i });

    // Verify image has correct src attribute
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');

    // Verify lazy loading is enabled for performance
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  // Test placeholder image fallback when no media URL is provided
  it('should show placeholder image when media_url is not provided', () => {
    const articleNoImage: NewsArticle = {
      ...mockArticle,
      media_url: undefined,
    };

    render(<ArticleCard article={articleNoImage} />);

    const image = screen.getByRole('img');

    // Placeholder image should be one of the predefined placeholders
    expect(image.getAttribute('src')).toMatch(/placeholder-images/);

    // Verify placeholder label is shown
    expect(screen.getByText(/placeholder image/i)).toBeInTheDocument();
  });

  // Test error handling: switch to placeholder when image fails to load
  it('should show placeholder when image fails to load', () => {
    render(<ArticleCard article={mockArticle} />);

    const image = screen.getByRole('img');

    // Initially shows the real image
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');

    // Simulate image load error (e.g., 404, network failure)
    fireEvent.error(image);

    // After error, should switch to placeholder
    expect(image.getAttribute('src')).toMatch(/placeholder-images/);
    expect(screen.getByText(/placeholder image/i)).toBeInTheDocument();
  });

  // Test conditional rendering: topics should be displayed when present
  it('should render topics when available', () => {
    render(<ArticleCard article={mockArticle} />);

    // Verify all topics are rendered as pills
    expect(screen.getByText(/Politics/i)).toBeInTheDocument();
    expect(screen.getByText(/Environment/i)).toBeInTheDocument();
    expect(screen.getByText(/Technology/i)).toBeInTheDocument();
  });

  // Test topic limit: only first 3 topics should be displayed
  it('should limit displayed topics to maximum of 3', () => {
    const articleManyTopics: NewsArticle = {
      ...mockArticle,
      topics: ['politics', 'environment', 'technology', 'business', 'sports'],
    };

    render(<ArticleCard article={articleManyTopics} />);

    // First 3 topics should be present
    expect(screen.getByText(/Politics/i)).toBeInTheDocument();
    expect(screen.getByText(/Environment/i)).toBeInTheDocument();
    expect(screen.getByText(/Technology/i)).toBeInTheDocument();

    // Topics 4 and 5 should not be displayed
    expect(screen.queryByText(/Business/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sports/i)).not.toBeInTheDocument();
  });

  // Test conditional rendering: no topics section when topics are empty
  it('should not render topics section when topics are empty', () => {
    const articleNoTopics: NewsArticle = {
      ...mockArticle,
      topics: [],
    };

    render(<ArticleCard article={articleNoTopics} />);

    // Topic pills should not be in the DOM
    const topicPills = screen.queryByText(/Politics/i);
    expect(topicPills).not.toBeInTheDocument();
  });

  // Test that invalid topics are filtered out
  it('should filter out invalid topic entries', () => {
    const articleInvalidTopics: NewsArticle = {
      ...mockArticle,
      topics: ['politics', 'Available on Developer plan', 'environment'],
    };

    render(<ArticleCard article={articleInvalidTopics} />);

    // Valid topics should be displayed
    expect(screen.getByText(/Politics/i)).toBeInTheDocument();
    expect(screen.getByText(/Environment/i)).toBeInTheDocument();

    // Invalid topic should be filtered out
    expect(screen.queryByText(/Available on Developer plan/i)).not.toBeInTheDocument();
  });

  // Test the "Read More" button is present
  it('should render Read More link', () => {
    render(<ArticleCard article={mockArticle} />);

    const readMoreLink = screen.getByText(/read more/i);

    expect(readMoreLink).toBeInTheDocument();
    expect(readMoreLink.closest('a')).toHaveAttribute('href', mockArticle.article_link);
  });

  // Test that published date is formatted and displayed
  it('should display formatted publication date', () => {
    render(<ArticleCard article={mockArticle} />);

    // Date should be formatted by formatRelativeTime utility
    // We don't test exact output here as it depends on current time
    // Just verify some date-related text is present
    const dateElement = screen.getByText(/ago|Just now|Jan|Feb|Mar/i);
    expect(dateElement).toBeInTheDocument();
  });
});
