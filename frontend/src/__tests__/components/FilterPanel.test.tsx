/**
 * Component Tests for FilterPanel (Frontend)
 *
 * This file demonstrates testing complex interactive components with state management.
 *
 * Key testing patterns:
 * - Test user interactions (button clicks)
 * - Use mock functions (vi.fn()) to verify callbacks are called
 * - Test conditional rendering (isOpen prop affects visibility)
 * - Verify component integration with child components
 * - Test state updates through onChange handlers
 * - Use accessible queries (getByRole, getByLabelText)
 * - Verify correct props are passed to child components
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '../../components/FilterPanel';
import type { FilterState } from '../../components/FilterPanel';

describe('FilterPanel', () => {
  // Create default filter state for testing
  const defaultFilters: FilterState = {
    countries: [],
    language: '',
    politicalLeanings: [],
    topics: [],
    excludeTopics: [],
    sourceTypes: [],
    startDate: '',
    endDate: '',
  };

  // Create mock callback functions to track user interactions
  const mockOnChange = vi.fn();
  const mockOnApply = vi.fn();
  const mockOnClose = vi.fn();

  // Test basic rendering when panel is open
  it('should render filter panel when isOpen is true', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        isDark={false}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Verify panel has the 'open' class for visibility
    const panel = document.querySelector('.filter-panel');
    expect(panel).toHaveClass('open');

    // Verify action buttons are present
    expect(screen.getByText(/clear all/i)).toBeInTheDocument();
    expect(screen.getByText(/apply filters/i)).toBeInTheDocument();
  });

  // Test conditional rendering: panel should not have 'open' class when closed
  it('should not have open class when isOpen is false', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        isDark={false}
        isOpen={false}
        onClose={mockOnClose}
      />
    );

    const panel = document.querySelector('.filter-panel');
    expect(panel).not.toHaveClass('open');
  });

  // Test close button functionality
  it('should call onClose when close button is clicked', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        isDark={false}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Find close button by accessible label
    const closeButton = screen.getByLabelText(/close filters/i);

    // Simulate user clicking close button
    fireEvent.click(closeButton);

    // Verify callback was invoked exactly once
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test overlay functionality: clicking overlay should close panel
  it('should call onClose when overlay is clicked', () => {
    // Clear previous mock calls to ensure clean state
    mockOnClose.mockClear();

    render(
      <FilterPanel
        filters={defaultFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        isDark={false}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Find overlay element (only rendered when isOpen is true)
    const overlay = document.querySelector('.filter-overlay');
    expect(overlay).toBeInTheDocument();

    // Simulate clicking outside the panel (on overlay)
    fireEvent.click(overlay!);

    // Verify close callback was triggered
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test that overlay is not rendered when panel is closed
  it('should not render overlay when isOpen is false', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        isDark={false}
        isOpen={false}
        onClose={mockOnClose}
      />
    );

    const overlay = document.querySelector('.filter-overlay');
    expect(overlay).not.toBeInTheDocument();
  });

  // Test "Apply Filters" button
  it('should call onApply when Apply Filters button is clicked', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        isDark={false}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const applyButton = screen.getByText(/apply filters/i);

    // User clicks the apply button
    fireEvent.click(applyButton);

    // Verify apply callback was invoked
    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });

  // Test "Clear All" button resets all filters to empty state
  it('should call onChange with empty filters when Clear All is clicked', () => {
    // Start with some filters selected
    const filtersWithData: FilterState = {
      countries: ['us', 'uk'],
      language: 'en',
      politicalLeanings: ['center'],
      topics: ['politics'],
      excludeTopics: ['sports'],
      sourceTypes: ['newspaper'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    };

    render(
      <FilterPanel
        filters={filtersWithData}
        onChange={mockOnChange}
        onApply={mockOnApply}
        isDark={false}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const clearButton = screen.getByText(/clear all/i);

    // User clicks clear all button
    fireEvent.click(clearButton);

    // Verify onChange was called with all filters cleared
    expect(mockOnChange).toHaveBeenCalledWith({
      countries: [],
      language: '',
      politicalLeanings: [],
      topics: [],
      excludeTopics: [],
      sourceTypes: [],
      startDate: '',
      endDate: '',
    });
  });

  // Test that all child filter components are rendered
  it('should render all filter sections', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        isDark={false}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Verify filter sections are present by checking for their labels
    // Use getAllByText since some labels appear multiple times (in label + placeholder text)
    expect(screen.getAllByText(/countries/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/language/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/political leaning/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/topics/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/source type/i)[0]).toBeInTheDocument();
  });

  // Test that dark mode prop is passed correctly
  it('should pass isDark prop to child components', () => {
    const { rerender } = render(
      <FilterPanel
        filters={defaultFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        isDark={false}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Verify component renders without errors in light mode
    expect(screen.getByText(/apply filters/i)).toBeInTheDocument();

    // Re-render with dark mode enabled
    rerender(
      <FilterPanel
        filters={defaultFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        isDark={true}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Component should still render correctly in dark mode
    expect(screen.getByText(/apply filters/i)).toBeInTheDocument();
  });
});
