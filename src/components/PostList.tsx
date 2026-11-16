import React from 'react';
import { PostListProps } from '../types';
import { PostCard } from './PostCard';
import { LoadingSpinner } from './UI/LoadingSpinner';
import { ErrorMessage } from './UI/ErrorMessage';
import { EmptyState } from './UI/EmptyState';
import { CreatePostForm } from './CreatePostForm';

export const PostList: React.FC<PostListProps> = ({
  selectedUser,
  posts,
  loading,
  isSubmitting,
  submitError,
  onCreatePost,
  error,
  onRetry,
}) => {
  if (!selectedUser) {
    return (
      <main
        className="posts-panel empty-selection-panel"
        aria-label="Sección de publicaciones"
      >
        <EmptyState
          title="Ningún usuario seleccionado"
          description="Selecciona un usuario de la lista de la izquierda para ver su perfil y explorar o crear publicaciones."
          icon={
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />
      </main>
    );
  }

  return (
    <main
      className="posts-panel"
      aria-label={`Publicaciones de ${selectedUser.name}`}
    >
      <div className="selected-user-banner">
        <div className="selected-user-details">
          <div className="selected-user-avatar" aria-hidden="true">
            {selectedUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="selected-user-name">{selectedUser.name}</h2>
            <div className="selected-user-metadata">
              <span>@{selectedUser.username}</span>
              <span className="dot-separator">•</span>
              <span>{selectedUser.email}</span>
              <span className="dot-separator">•</span>
              <span>{selectedUser.company.name}</span>
            </div>
          </div>
        </div>

        <div className="posts-counter-badge">
          <strong>{posts.length}</strong>{' '}
          {posts.length === 1 ? 'publicación' : 'publicaciones'}
        </div>
      </div>

      <CreatePostForm
        userName={selectedUser.name}
        {...{ isSubmitting, submitError }}
        onSubmit={onCreatePost}
      />

      <div className="posts-content-area">
        {loading && (
          <div className="posts-loading-container">
            <LoadingSpinner
              message={`Cargando publicaciones de ${selectedUser.name}...`}
              size="lg"
            />
          </div>
        )}

        {!loading && error && (
          <div className="posts-error-container">
            <ErrorMessage
              title="Error al cargar las publicaciones"
              message={error}
              onRetry={onRetry}
            />
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <EmptyState
            title="Sin publicaciones aún"
            description={`${selectedUser.name} no tiene publicaciones registradas. ¡Sé el primero en crear una!`}
          />
        )}

        {!loading && !error && posts.length > 0 && (
          <div
            className="posts-grid"
            role="feed"
            aria-label="Lista de publicaciones"
          >
            {posts.map((post) => (
              <PostCard key={post.id} {...{ post }} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
