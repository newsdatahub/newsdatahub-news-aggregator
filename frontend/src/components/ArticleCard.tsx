import React, { useState, useCallback, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import type { NewsArticle } from '../types/news';
import { formatRelativeTime, capitalizeWords } from '../utils/formatters';

const PLACEHOLDER_IMAGES: string[] = [
  '/placeholder-images/news-placeholder-image-1.png',
  '/placeholder-images/news-placeholder-image-2.png',
  '/placeholder-images/news-placeholder-image-3.png',
  '/placeholder-images/news-placeholder-image-4.png',
];
const MAX_TOPICS_DISPLAYED: number = 3;
const EXTERNAL_LINK_ICON_SIZE: number = 14;
const READ_MORE_TEXT: string = 'Read More';
const PLACEHOLDER_LABEL_TEXT: string = 'Placeholder Image';
const INVALID_TOPIC_PATTERN: string = 'Available on Developer plan';

function getPlaceholderImage(title: string): string {
  const hash: number = title.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length];
}

interface ArticleCardProps {
  article: NewsArticle;
}

export function ArticleCard({ article }: ArticleCardProps): React.ReactElement {
  const [imageError, setImageError] = useState<boolean>(false);

  const handleImageError = useCallback((): void => {
    setImageError(true);
  }, []);

  const hasImage: boolean = !!article.media_url && !imageError;
  const imageSrc: string = useMemo(() => {
    return hasImage && article.media_url ? article.media_url : getPlaceholderImage(article.title);
  }, [hasImage, article.media_url, article.title]);
  const isPlaceholder: boolean = !hasImage;

  const formattedDate: string = formatRelativeTime(article.pub_date);

  // Filter out invalid topic entries
  const validTopics: string[] | undefined = article.topics?.filter(
    (topic: string): boolean => !topic.includes(INVALID_TOPIC_PATTERN)
  );
  const hasTopics: boolean = !!(validTopics && validTopics.length > 0);
  const displayedTopics: string[] | undefined = hasTopics ? validTopics?.slice(0, MAX_TOPICS_DISPLAYED) : undefined;

  return (
    <article className="article-card">
      <div className="article-image-wrapper">
        <img
          src={imageSrc}
          alt={article.title}
          loading="lazy"
          className="article-image"
          onError={handleImageError}
        />
        {isPlaceholder && <span className="placeholder-label">{PLACEHOLDER_LABEL_TEXT}</span>}
      </div>
      <div className="article-card-content">
        <div className="article-meta">
          <span className="article-source">{article.source_title}</span>
        </div>
        <h3 className="article-title">
          <a href={article.article_link} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
        {hasTopics && displayedTopics && (
          <div className="article-topics">
            {displayedTopics.map((topic: string, index: number) => (
              <span key={index} className="topic-pill">
                {capitalizeWords(topic)}
              </span>
            ))}
          </div>
        )}
        <p className="article-description">{article.description}</p>
        <div className="article-footer">
          <span className="article-date">{formattedDate}</span>
          <a
            href={article.article_link}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more"
          >
            {READ_MORE_TEXT} <ExternalLink size={EXTERNAL_LINK_ICON_SIZE} />
          </a>
        </div>
      </div>
    </article>
  );
}
