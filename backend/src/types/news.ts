/**
 * Type definitions for news articles and API responses
 */

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source_title: string;
  article_link: string;
  pub_date: string;
  media_url?: string | null;
  political_leaning?: string;
  reliability_score?: number;
  source?: SourceMetadata;
  language: string;
  keywords?: string[];
  topics?: string[];
  creator?: string | null;
  content?: string;
}

export interface SourceMetadata {
  id: string;
  country: string;
  political_leaning?: string;
  reliability_score?: number;
  type?: string;
}

export interface NewsApiResponse {
  data: NewsArticle[];
  total_results: number;
  per_page: number;
  next_cursor?: string | null;
}

export interface NewsSearchParams {
  q?: string;
  country?: string;
  language?: string;
  political_leaning?: string;
  topic?: string;
  exclude_topic?: string;
  source_type?: string;
  start_date?: string;
  end_date?: string;
  per_page?: number;
  cursor?: string;
}

export interface NewsSearchResponse {
  data: NewsArticle[];
  total_results: number;
  per_page: number;
  next_cursor?: string | null;
  is_demo: boolean;
}

export interface HealthCheckResponse {
  ok: boolean;
  demo_mode: boolean;
  api_configured: boolean;
}

export type PoliticalLeaning =
  | 'far_left'
  | 'left'
  | 'center_left'
  | 'center'
  | 'center_right'
  | 'right'
  | 'far_right';

export type SourceType =
  | 'newspaper'
  | 'magazine'
  | 'digital_native'
  | 'mainstream_news'
  | 'blog'
  | 'specialty_news'
  | 'press_release';
