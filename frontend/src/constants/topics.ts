/**
 * Topic list for filtering
 */

export const TOPICS = [
  'politics',
  'technology',
  'business',
  'finance',
  'health',
  'sports',
  'entertainment',
  'science',
  'environment',
  'crime',
  'education',
  'world',
  'local',
] as const;

export type Topic = (typeof TOPICS)[number];
