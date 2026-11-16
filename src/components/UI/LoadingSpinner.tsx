import React from 'react';
import { LoadingSpinnerProps } from '../../types';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  };

  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className={`spinner ${sizeClasses[size]}`} aria-hidden="true" />
      {message && <p className="loading-text">{message}</p>}
    </div>
  );
};
