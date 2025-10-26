/**
 * Article grid component with load more
 */

import { NewsArticle } from '../types/news';
import { ArticleCard } from './ArticleCard';
import { ArticleListItem } from './ArticleListItem';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface ArticleGridProps {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  isDark: boolean;
  onLoadMore: () => void;
  onRetry?: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ArticleGrid({
  articles,
  loading,
  error,
  hasMore,
  isDark,
  onLoadMore,
  onRetry,
  viewMode,
}: ArticleGridProps) {

  if (loading && articles.length === 0) {
    return <LoadingState />;
  }

  if (error && articles.length === 0) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (articles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className={viewMode === 'grid' ? 'article-grid' : 'article-list'}>
        {articles.map((article) =>
          viewMode === 'grid' ? (
            <ArticleCard key={article.id} article={article} isDark={isDark} />
          ) : (
            <ArticleListItem key={article.id} article={article} isDark={isDark} />
          )
        )}
      </div>
      {hasMore && !loading && (
        <div className="load-more-section">
          <button onClick={onLoadMore} className="load-more-button">
            Load More
          </button>
        </div>
      )}
      {loading && articles.length > 0 && (
        <div className="load-more-section">
          <div className="spinner"></div>
        </div>
      )}
      {error && articles.length > 0 && (
        <div className="load-more-error">
          <p>{error}</p>
          <button onClick={onRetry} className="retry-button-small">
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
