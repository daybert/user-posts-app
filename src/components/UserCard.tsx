import React from 'react';
import { UserCardProps } from '../types';

export const UserCard: React.FC<UserCardProps> = ({
  user,
  isSelected,
  onSelect,
}) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(user);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      aria-label={`Ver publicaciones de ${user.name}`}
      className={`user-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(user)}
      onKeyDown={handleKeyDown}
    >
      <div className="user-avatar" aria-hidden="true">
        {getInitials(user.name)}
      </div>

      <div className="user-info">
        <div className="user-header">
          <h3 className="user-name">{user.name}</h3>
          <span className="user-username">@{user.username}</span>
        </div>

        <div className="user-details">
          <span className="user-email" title={user.email}>
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {user.email}
          </span>
          <span className="user-company" title={user.company?.name || ''}>
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            {user.company?.name || 'Sin empresa'}
          </span>
        </div>
      </div>

      <div className="card-arrow" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
};
