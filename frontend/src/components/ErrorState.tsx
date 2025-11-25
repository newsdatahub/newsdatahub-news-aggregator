/**
 * Error message component
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

const ICON_SIZE: number = 48;
const HEADING: string = 'Oops! Something went wrong';
const BUTTON_TEXT: string = 'Try Again';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps): React.ReactElement {
  return (
    <div className="error-state">
      <AlertCircle size={ICON_SIZE} className="error-icon" />
      <h3>{HEADING}</h3>
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button" type="button">
          {BUTTON_TEXT}
        </button>
      )}
    </div>
  );
}
