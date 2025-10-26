/**
 * Color utility functions for political leanings
 */

import { POLITICAL_LEANINGS } from '../constants/filters';

/**
 * Gets the color for a political leaning based on theme
 *
 * @param leaning - Political leaning value
 * @param isDark - Whether dark mode is enabled
 * @returns Color hex code
 */
export function getPoliticalLeaningColor(leaning: string, isDark: boolean): string {
  const option = POLITICAL_LEANINGS.find((opt) => opt.value === leaning);
  if (!option) {
    return isDark ? '#94a3b8' : '#6b7280';
  }
  return isDark ? option.darkColor : option.color;
}

/**
 * Gets the label for a political leaning
 *
 * @param leaning - Political leaning value
 * @returns Human-readable label
 */
export function getPoliticalLeaningLabel(leaning: string): string {
  const option = POLITICAL_LEANINGS.find((opt) => opt.value === leaning);
  return option?.label || leaning;
}
