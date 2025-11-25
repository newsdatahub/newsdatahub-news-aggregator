/**
 * Utility functions for formatting data
 */

const MS_PER_SECOND: number = 1000;
const SECONDS_PER_MINUTE: number = 60;
const MINUTES_PER_HOUR: number = 60;
const HOURS_PER_DAY: number = 24;
const DAYS_PER_WEEK: number = 7;

const TEXT_JUST_NOW: string = 'Just now';
const TEXT_MINUTE_SINGULAR: string = 'minute';
const TEXT_MINUTE_PLURAL: string = 'minutes';
const TEXT_HOUR_SINGULAR: string = 'hour';
const TEXT_HOUR_PLURAL: string = 'hours';
const TEXT_DAY_SINGULAR: string = 'day';
const TEXT_DAY_PLURAL: string = 'days';
const TEXT_AGO_SUFFIX: string = 'ago';

const LOCALE_EN_US: string = 'en-US';
const DATE_FORMAT_MONTH: 'short' = 'short';
const DATE_FORMAT_DAY: 'numeric' = 'numeric';
const DATE_FORMAT_YEAR: 'numeric' = 'numeric';

const PAD_LENGTH: number = 2;
const PAD_CHAR: string = '0';
const DATE_SEPARATOR: string = '-';
const WORD_SEPARATOR: string = ' ';
const UNDERSCORE_SEPARATOR: string = '_';
const ELLIPSIS: string = '...';

const MONTH_OFFSET: number = 1;
const SINGULAR_COUNT: number = 1;
const FIRST_CHAR_INDEX: number = 0;
const SECOND_CHAR_INDEX: number = 1;

/**
 * Formats a date string to relative time (e.g., "2 hours ago", "3 days ago")
 *
 * @param dateString - ISO date string
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date: Date = new Date(dateString);
  const now: Date = new Date();
  const diffMs: number = now.getTime() - date.getTime();
  const diffSeconds: number = Math.floor(diffMs / MS_PER_SECOND);
  const diffMinutes: number = Math.floor(diffSeconds / SECONDS_PER_MINUTE);
  const diffHours: number = Math.floor(diffMinutes / MINUTES_PER_HOUR);
  const diffDays: number = Math.floor(diffHours / HOURS_PER_DAY);

  if (diffSeconds < SECONDS_PER_MINUTE) {
    return TEXT_JUST_NOW;
  } else if (diffMinutes < MINUTES_PER_HOUR) {
    const unit: string = diffMinutes === SINGULAR_COUNT ? TEXT_MINUTE_SINGULAR : TEXT_MINUTE_PLURAL;
    return `${diffMinutes} ${unit} ${TEXT_AGO_SUFFIX}`;
  } else if (diffHours < HOURS_PER_DAY) {
    const unit: string = diffHours === SINGULAR_COUNT ? TEXT_HOUR_SINGULAR : TEXT_HOUR_PLURAL;
    return `${diffHours} ${unit} ${TEXT_AGO_SUFFIX}`;
  } else if (diffDays < DAYS_PER_WEEK) {
    const unit: string = diffDays === SINGULAR_COUNT ? TEXT_DAY_SINGULAR : TEXT_DAY_PLURAL;
    return `${diffDays} ${unit} ${TEXT_AGO_SUFFIX}`;
  } else {
    const yearValue: 'numeric' | undefined = date.getFullYear() !== now.getFullYear() ? DATE_FORMAT_YEAR : undefined;
    return date.toLocaleDateString(LOCALE_EN_US, {
      month: DATE_FORMAT_MONTH,
      day: DATE_FORMAT_DAY,
      year: yearValue,
    });
  }
}

/**
 * Formats a Date object to YYYY-MM-DD string format
 *
 * @param date - Date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDate(date: Date): string {
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + MONTH_OFFSET).padStart(PAD_LENGTH, PAD_CHAR);
  const day: string = String(date.getDate()).padStart(PAD_LENGTH, PAD_CHAR);
  return `${year}${DATE_SEPARATOR}${month}${DATE_SEPARATOR}${day}`;
}

/**
 * Truncates text to a maximum length with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated: string = text.slice(0, maxLength).trim();
  return `${truncated}${ELLIPSIS}`;
}

/**
 * Capitalizes the first letter of each word
 *
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalizeWords(text: string): string {
  const words: string[] = text.split(WORD_SEPARATOR);
  const capitalizedWords: string[] = words.map((word: string): string => {
    const firstChar: string = word.charAt(FIRST_CHAR_INDEX).toUpperCase();
    const restOfWord: string = word.slice(SECOND_CHAR_INDEX).toLowerCase();
    return `${firstChar}${restOfWord}`;
  });
  return capitalizedWords.join(WORD_SEPARATOR);
}

/**
 * Formats political leaning for display
 *
 * @param leaning - Political leaning value
 * @returns Formatted label
 */
export function formatPoliticalLeaning(leaning: string): string {
  const words: string[] = leaning.split(UNDERSCORE_SEPARATOR);
  const capitalizedWords: string[] = words.map((word: string): string => {
    const firstChar: string = word.charAt(FIRST_CHAR_INDEX).toUpperCase();
    const restOfWord: string = word.slice(SECOND_CHAR_INDEX);
    return `${firstChar}${restOfWord}`;
  });
  return capitalizedWords.join(WORD_SEPARATOR);
}
