import React from 'react';
import { UserSearchProps } from '../types';

export const UserSearch: React.FC<UserSearchProps> = ({
  value,
  onChange,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="search-box-wrapper">
      <div className="search-input-container">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          id="user-search-input"
          aria-label="Buscar usuario por nombre"
          placeholder="Buscar por nombre o usuario..."
          {...{ value }}
          onChange={(e) => onChange(e.target.value)}
          className="search-input"
        />

        {value && (
          <button
            type="button"
            className="clear-search-btn"
            aria-label="Limpiar búsqueda"
            onClick={() => onChange('')}
          >
            ×
          </button>
        )}
      </div>

      <div className="search-meta" aria-live="polite">
        {value.trim() ? (
          <span>
            Mostrando <strong>{filteredCount}</strong> de {totalCount} usuarios
          </span>
        ) : (
          <span>{totalCount} usuarios en total</span>
        )}
      </div>
    </div>
  );
};
