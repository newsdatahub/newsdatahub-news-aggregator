/**
 * Footer component with branding and links
 */

import React from 'react';

const POWERED_BY_TEXT: string = 'Powered by ';
const POWERED_BY_LINK_TEXT: string = 'NewsDataHub API';
const POWERED_BY_URL: string = 'https://newsdatahub.com';
const DOCS_TEXT: string = 'API Documentation';
const DOCS_URL: string = 'https://newsdatahub.com/docs';
const GITHUB_TEXT: string = 'GitHub';
const GITHUB_URL: string = 'https://github.com/newsdatahub/newsdatahub-news-aggregator';
const SEPARATOR: string = '•';

export function Footer(): React.ReactElement {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          {POWERED_BY_TEXT}
          <a href={POWERED_BY_URL} target="_blank" rel="noopener noreferrer">
            {POWERED_BY_LINK_TEXT}
          </a>
        </p>
        <div className="footer-links">
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {DOCS_TEXT}
          </a>
          <span className="footer-separator">{SEPARATOR}</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {GITHUB_TEXT}
          </a>
        </div>
      </div>
    </footer>
  );
}
