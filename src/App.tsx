import React, { useState } from 'react';
import { Users, FileText, PlusCircle } from 'lucide-react';
import './App.css';
import type { Post } from './types';

export const App: React.FC = () => {
  const [posts] = useState<Post[]>([
    {
      userId: 1,
      id: 1,
      title: 'Primer post del proyecto',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
      isLocal: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          <Users className="icon-title" size={32} />
          User Posts App
        </h1>
      </header>

      <main className="posts-section">
        <div className="section-header">
          <h2>
            <FileText size={24} /> Publicaciones
          </h2>
          <button className="btn-primary" type="button">
            <PlusCircle size={18} /> Nuevo Post
          </button>
        </div>

        <div className="posts-list">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <div className="post-footer">
                <span className="post-date">
                  Creado:{' '}
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
