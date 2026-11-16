import React from 'react';
import { ErrorMessageProps } from '../../types';

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Ha ocurrido un error',
  message,
  onRetry,
}) => {
  return (
    <div className="error-card" role="alert" aria-live="assertive">
      <div className="error-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="error-content">
        <h4 className="error-title">{title}</h4>
        <p className="error-description">{message}</p>
        {onRetry && (
          <button type="button" className="retry-btn" onClick={onRetry}>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};
