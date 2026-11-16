import { useState, useEffect, useCallback } from 'react';
import { Post, NewPostInput } from '../types';
import { fetchPostsByUser, createPost } from '../services/api';

export const useUserPosts = (userId: number | null) => {
  // states
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // functions
  const loadPosts = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPostsByUser(id);
      setPosts(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar las publicaciones';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId === null) {
      setPosts([]);
      setLoading(false);
      setError(null);
      return;
    }

    loadPosts(userId);
  }, [userId, loadPosts]);

  const handleCreatePost = useCallback(
    async (title: string, body: string): Promise<boolean> => {
      if (!userId) return false;

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const payload: NewPostInput = {
          title: title.trim(),
          body: body.trim(),
          userId,
        };

        const newPost = await createPost(payload);

        const newPostWithId: Post = {
          ...newPost,
          id: Date.now(),
        };

        setPosts((prev) => [newPostWithId, ...prev]);
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se ha podido crear la publicación';
        setSubmitError(message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [userId]
  );

  return {
    posts,
    loading,
    error,
    isSubmitting,
    submitError,
    createPost: handleCreatePost,
    retry: () => userId !== null && loadPosts(userId),
  };
};
