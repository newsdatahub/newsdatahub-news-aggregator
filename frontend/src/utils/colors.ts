/**
 * Color utility functions for political leanings
 */

import { POLITICAL_LEANINGS, type PoliticalLeaningOption } from '../constants/filters';

const DEFAULT_COLOR_LIGHT: string = '#6b7280';
const DEFAULT_COLOR_DARK: string = '#94a3b8';

/**
 * Gets the color for a political leaning based on theme
 *
 * @param leaning - Political leaning value
 * @param isDark - Whether dark mode is enabled
 * @returns Color hex code
 */
export function getPoliticalLeaningColor(leaning: string, isDark: boolean): string {
  const option: PoliticalLeaningOption | undefined = POLITICAL_LEANINGS.find((opt: PoliticalLeaningOption): boolean => opt.value === leaning);
  if (!option) {
    return isDark ? DEFAULT_COLOR_DARK : DEFAULT_COLOR_LIGHT;
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
  const option: PoliticalLeaningOption | undefined = POLITICAL_LEANINGS.find((opt: PoliticalLeaningOption): boolean => opt.value === leaning);
  return option?.label || leaning;
}
