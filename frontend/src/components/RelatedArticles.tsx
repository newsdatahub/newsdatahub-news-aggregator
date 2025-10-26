/**
 * Related articles component with expand/collapse functionality
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types/news';
import { getRelatedArticles } from '../services/newsApi';
import { formatRelativeTime } from '../utils/formatters';
import { PoliticalBadge } from './PoliticalBadge';

interface RelatedArticlesProps {
  articleId: string;
  isDark: boolean;
}

interface RelatedArticlesPropsExtended extends RelatedArticlesProps {
  currentArticleTitle?: string;
}

export function RelatedArticles({ articleId, isDark, currentArticleTitle }: RelatedArticlesPropsExtended) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const deduplicateArticles = (articles: NewsArticle[], originalTitle?: string): NewsArticle[] => {
    const seen = new Set<string>();

    // Add the current article title to seen set if provided
    if (originalTitle) {
      seen.add(originalTitle.toLowerCase().trim());
    }

    return articles.filter((article) => {
      const normalizedTitle = article.title.toLowerCase().trim();
      if (seen.has(normalizedTitle)) {
        return false;
      }
      seen.add(normalizedTitle);
      return true;
    });
  };

  const handleToggle = async () => {
    if (!isExpanded && !hasLoaded) {
      // Expand first, then fetch related articles
      setIsExpanded(true);
      setLoading(true);
      setError(null);
      try {
        const response = await getRelatedArticles(articleId, 5);
        const deduplicated = deduplicateArticles(response.data, currentArticleTitle);
        setRelatedArticles(deduplicated);
        setHasLoaded(true);
      } catch (err) {
        // Provide user-friendly error messages
        let errorMessage = 'Unable to load related articles. Please try again later.';

        if (err instanceof Error) {
          if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
            errorMessage = 'Unable to connect to the server. Please check your connection and try again.';
          } else if (err.message.includes('404')) {
            errorMessage = 'No related articles found for this story.';
          } else if (err.message.includes('429')) {
            errorMessage = 'Too many requests. Please wait a moment and try again.';
          }
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="related-articles">
      <button onClick={handleToggle} className="related-articles-toggle" aria-expanded={isExpanded}>
        <span className="related-articles-label">Related Stories</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isExpanded && (
        <div className="related-articles-content">
          {loading && (
            <div className="related-articles-loading">
              <div className="spinner-small"></div>
            </div>
          )}

          {error && (
            <div className="related-articles-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && relatedArticles.length === 0 && (
            <div className="related-articles-empty">
              <p>No related articles found.</p>
            </div>
          )}

          {!loading && !error && relatedArticles.length > 0 && (
            <div className="related-articles-list">
              {relatedArticles.map((article) => (
                <article key={article.id} className="related-article-item">
                  <div className="related-article-header">
                    <div className="related-article-meta">
                      <span className="related-article-source">{article.source_title}</span>
                      {article.source?.political_leaning && (
                        <PoliticalBadge leaning={article.source.political_leaning} isDark={isDark} />
                      )}
                    </div>
                    <span className="related-article-date">{formatRelativeTime(article.pub_date)}</span>
                  </div>
                  <h4 className="related-article-title">
                    <a href={article.article_link} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h4>
                  <a
                    href={article.article_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="related-article-link"
                  >
                    Read Article <ExternalLink size={12} />
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
