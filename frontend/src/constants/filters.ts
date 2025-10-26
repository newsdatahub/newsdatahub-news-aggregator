/**
 * Filter options constants
 */

import { PoliticalLeaning, SourceType } from '../types/news';

export interface PoliticalLeaningOption {
  value: PoliticalLeaning;
  label: string;
  color: string;
  darkColor: string;
}

export const POLITICAL_LEANINGS: PoliticalLeaningOption[] = [
  {
    value: 'far_left',
    label: 'Far Left',
    color: '#1e3a8a',
    darkColor: '#3b82f6',
  },
  {
    value: 'left',
    label: 'Left',
    color: '#3b82f6',
    darkColor: '#60a5fa',
  },
  {
    value: 'center_left',
    label: 'Center Left',
    color: '#60a5fa',
    darkColor: '#7dd3fc',
  },
  {
    value: 'center',
    label: 'Center',
    color: '#6b7280',
    darkColor: '#94a3b8',
  },
  {
    value: 'center_right',
    label: 'Center Right',
    color: '#f87171',
    darkColor: '#fca5a5',
  },
  {
    value: 'right',
    label: 'Right',
    color: '#dc2626',
    darkColor: '#f87171',
  },
  {
    value: 'far_right',
    label: 'Far Right',
    color: '#991b1b',
    darkColor: '#fca5a5',
  },
];

export interface SourceTypeOption {
  value: SourceType;
  label: string;
}

export const SOURCE_TYPES: SourceTypeOption[] = [
  { value: 'newspaper', label: 'Newspaper' },
  { value: 'magazine', label: 'Magazine' },
  { value: 'digital_native', label: 'Digital Native' },
  { value: 'mainstream_news', label: 'Mainstream News' },
  { value: 'blog', label: 'Blog' },
  { value: 'specialty_news', label: 'Specialty News' },
  { value: 'press_release', label: 'Press Release' },
];
