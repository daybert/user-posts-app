import React from 'react';
import { UserListProps } from '../types';
import { LoadingSpinner } from './UI/LoadingSpinner';
import { ErrorMessage } from './UI/ErrorMessage';
import { EmptyState } from './UI/EmptyState';
import { UserCard } from './UserCard';
import { UserSearch } from './UserSearch';

export const UserList: React.FC<UserListProps> = ({
  users,
  filteredUsers,
  loading,
  error,
  searchQuery,
  onSearchChange,
  selectedUser,
  onSelectUser,
  onRetry,
}) => {
  return (
    <aside className="users-panel" aria-label="Lista de usuarios">
      <div className="panel-header">
        <h2 className="panel-title">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Usuarios
        </h2>
      </div>

      <UserSearch
        value={searchQuery}
        onChange={onSearchChange}
        totalCount={users.length}
        filteredCount={filteredUsers.length}
      />

      <div className="users-scroll-area">
        {loading && (
          <div className="users-loading-wrapper">
            <LoadingSpinner message="Cargando usuarios..." size="md" />
          </div>
        )}

        {!loading && error && (
          <div className="users-error-wrapper">
            <ErrorMessage
              title="Error al cargar usuarios"
              message={error}
              onRetry={onRetry}
            />
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <EmptyState
            title="Sin resultados"
            description={`No se encontraron usuarios que coincidan con "${searchQuery}".`}
            action={
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onSearchChange('')}
              >
                Limpiar filtro
              </button>
            }
          />
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div className="users-list" role="list">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                {...{ user }}
                isSelected={selectedUser?.id === user.id}
                onSelect={onSelectUser}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
