/**
 * Individual article card component
 */

import { ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types/news';
import { formatRelativeTime, capitalizeWords } from '../utils/formatters';
import { PoliticalBadge } from './PoliticalBadge';
import { RelatedArticles } from './RelatedArticles';
import { useState } from 'react';

interface ArticleCardProps {
  article: NewsArticle;
  isDark: boolean;
}

const PLACEHOLDER_IMAGES = [
  '/placeholder-images/news-placeholder-image-1.png',
  '/placeholder-images/news-placeholder-image-2.png',
  '/placeholder-images/news-placeholder-image-3.png',
  '/placeholder-images/news-placeholder-image-4.png',
];

function getPlaceholderImage(title: string): string {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length];
}

export function ArticleCard({ article, isDark }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasImage = !!article.media_url && !imageError;
  const imageSrc = hasImage && article.media_url ? article.media_url : getPlaceholderImage(article.title);
  const isPlaceholder = !hasImage;

  return (
    <article className="article-card">
      <div className="article-image-wrapper">
        <img
          src={imageSrc}
          alt={article.title}
          loading="lazy"
          className="article-image"
          onError={() => setImageError(true)}
        />
        {isPlaceholder && <span className="placeholder-label">Placeholder Image</span>}
      </div>
      <div className="article-card-content">
        <div className="article-meta">
          <span className="article-source">{article.source_title}</span>
          {article.source?.political_leaning && (
            <PoliticalBadge leaning={article.source.political_leaning} isDark={isDark} />
          )}
        </div>
        <h3 className="article-title">
          <a href={article.article_link} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
        {article.topics && article.topics.length > 0 && (
          <div className="article-topics">
            {article.topics.slice(0, 3).map((topic, index) => (
              <span key={index} className="topic-pill">
                {capitalizeWords(topic)}
              </span>
            ))}
          </div>
        )}
        <p className="article-description">{article.description}</p>
        <div className="article-footer">
          <span className="article-date">{formatRelativeTime(article.pub_date)}</span>
          <a
            href={article.article_link}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more"
          >
            Read More <ExternalLink size={14} />
          </a>
        </div>
      </div>
      <RelatedArticles articleId={article.id} isDark={isDark} currentArticleTitle={article.title} />
    </article>
  );
}
