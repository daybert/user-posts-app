import { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from '../types';
import { fetchUsers } from '../services/api';

export const useUsers = () => {
  // states
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // functions
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar usuarios';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(trimmed) ||
        user.username.toLowerCase().includes(trimmed)
    );
  }, [users, searchQuery]);

  return {
    users,
    filteredUsers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    retry: loadUsers,
  };
};
