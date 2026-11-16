import React from 'react';
import { PostCardProps } from '../types';

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className={`post-card ${post.isLocal ? 'post-card-local' : ''}`}>
      <div className="post-card-header">
        <span className="post-id-tag">#{post.id}</span>
        {post.isLocal && (
          <span
            className="local-badge"
            title="Esta publicación fue creada durante tu sesión actual"
          >
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Nueva {post.createdAt ? `(${post.createdAt})` : ''}
          </span>
        )}
      </div>

      <h3 className="post-title">{post.title}</h3>
      <p className="post-body">{post.body}</p>
    </article>
  );
};
