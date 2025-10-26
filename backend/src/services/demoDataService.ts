import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NewsArticle, NewsSearchParams } from '../types/news';
import logger from '../utils/logger';

/**
 * Service for loading and filtering demo data
 */
class DemoDataService {
  private demoArticles: NewsArticle[];

  constructor() {
    this.demoArticles = [];
    this.loadDemoData();
  }

  /**
   * Loads demo data from JSON files
   */
  private loadDemoData(): void {
    try {
      // Try multiple possible paths (for dev vs production)
      const possiblePaths = [
        join(__dirname, '../../demo-data'), // From dist/services
        join(__dirname, '../../../demo-data'), // From src/services (ts-node)
        join(process.cwd(), 'demo-data'), // From project root
      ];

      let demoDataPath = '';
      for (const path of possiblePaths) {
        if (existsSync(path)) {
          demoDataPath = path;
          logger.info(`Found demo data at: ${path}`);
          break;
        }
      }

      if (!demoDataPath) {
        throw new Error('Demo data directory not found');
      }

      const files = ['data-1.json', 'data-2.json', 'data-3.json', 'data-4.json'];
      const allArticles: NewsArticle[] = [];

      files.forEach((file) => {
        try {
          const filePath = join(demoDataPath, file);
          if (!existsSync(filePath)) {
            logger.warn(`Demo data file not found: ${filePath}`);
            return;
          }
          const data = readFileSync(filePath, 'utf-8');
          const response = JSON.parse(data);
          // Extract the data array from the API response format
          const articles = response.data as NewsArticle[];
          allArticles.push(...articles);
          logger.info(`Loaded demo data from ${file}`, { count: articles.length });
        } catch (error) {
          logger.warn(`Failed to load demo data from ${file}`, { error });
        }
      });

      this.demoArticles = allArticles;
      logger.info('Demo data loaded successfully', { total: allArticles.length });
    } catch (error) {
      logger.error('Failed to load demo data', { error });
      this.demoArticles = [];
    }
  }

  /**
   * Filters demo articles based on search parameters
   *
   * @param params - Search parameters
   * @returns Filtered articles
   */
  filterArticles(params: NewsSearchParams): NewsArticle[] {
    let filtered = [...this.demoArticles];

    // Search query filter
    if (params.q) {
      const query = params.q.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query)
      );
    }

    // Country filter
    if (params.country) {
      const countries = params.country.split(',').map((c) => c.trim().toUpperCase());
      filtered = filtered.filter(
        (article) => article.source?.country && countries.includes(article.source.country)
      );
    }

    // Language filter
    if (params.language) {
      filtered = filtered.filter((article) => article.language === params.language);
    }

    // Political leaning filter
    if (params.political_leaning) {
      const leanings = params.political_leaning.split(',').map((l) => l.trim());
      filtered = filtered.filter(
        (article) => article.source?.political_leaning && leanings.includes(article.source.political_leaning)
      );
    }

    // Topic filter
    if (params.topic) {
      const topics = params.topic.split(',').map((t) => t.trim().toLowerCase());
      filtered = filtered.filter((article) =>
        article.topics?.some((topic) => topics.includes(topic.toLowerCase()))
      );
    }

    // Exclude topic filter
    if (params.exclude_topic) {
      const excludeTopics = params.exclude_topic.split(',').map((t) => t.trim().toLowerCase());
      filtered = filtered.filter((article) =>
        !article.topics?.some((topic) => excludeTopics.includes(topic.toLowerCase()))
      );
    }

    // Source type filter
    if (params.source_type) {
      const types = params.source_type.split(',').map((t) => t.trim());
      filtered = filtered.filter(
        (article) => article.source?.type && types.includes(article.source.type)
      );
    }

    // Date range filter
    if (params.start_date) {
      const startDate = new Date(params.start_date);
      filtered = filtered.filter((article) => new Date(article.pub_date) >= startDate);
    }

    if (params.end_date) {
      const endDate = new Date(params.end_date);
      endDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter((article) => new Date(article.pub_date) <= endDate);
    }

    return filtered;
  }

  /**
   * Deduplicates articles by title
   *
   * @param articles - Array of articles
   * @returns Deduplicated articles
   */
  private deduplicateByTitle(articles: NewsArticle[]): NewsArticle[] {
    const seen = new Set<string>();
    return articles.filter((article) => {
      const normalizedTitle = article.title.toLowerCase().trim();
      if (seen.has(normalizedTitle)) {
        return false;
      }
      seen.add(normalizedTitle);
      return true;
    });
  }

  /**
   * Gets demo articles with pagination
   *
   * @param params - Search parameters
   * @returns Paginated articles
   */
  getArticles(params: NewsSearchParams): {
    data: NewsArticle[];
    total_results: number;
    per_page: number;
    next_cursor: string | null;
  } {
    const filtered = this.filterArticles(params);
    const deduplicated = this.deduplicateByTitle(filtered);
    const perPage = params.per_page || 100;
    const offset = params.cursor ? parseInt(params.cursor, 10) : 0;

    const data = deduplicated.slice(offset, offset + perPage);
    const hasMore = offset + perPage < deduplicated.length;

    return {
      data,
      total_results: deduplicated.length,
      per_page: perPage,
      next_cursor: hasMore ? String(offset + perPage) : null,
    };
  }

  /**
   * Checks if demo data is available
   *
   * @returns True if demo data is loaded
   */
  isAvailable(): boolean {
    return this.demoArticles.length > 0;
  }
}

// Export singleton instance
export const demoDataService = new DemoDataService();
