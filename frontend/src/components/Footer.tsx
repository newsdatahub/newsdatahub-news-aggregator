/**
 * Footer component with branding and links
 */

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Powered by{' '}
          <a href="https://newsdatahub.com" target="_blank" rel="noopener noreferrer">
            NewsDataHub API
          </a>
        </p>
        <div className="footer-links">
          <a
            href="https://newsdatahub.com/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            API Documentation
          </a>
          <span className="footer-separator">•</span>
          <a
            href="https://github.com/newsdatahub/news-aggregator-demo"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
