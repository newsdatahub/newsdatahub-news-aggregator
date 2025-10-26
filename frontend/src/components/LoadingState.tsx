/**
 * Loading skeleton component
 */

export function LoadingState() {
  return (
    <div className="loading-grid">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="article-card skeleton">
          <div className="skeleton-image"></div>
          <div className="article-card-content">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-source"></div>
            <div className="skeleton-text skeleton-description"></div>
            <div className="skeleton-text skeleton-description"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
