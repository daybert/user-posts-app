import { useState } from 'react';
import { Header } from './components/Header';
import { UserList } from './components/UserList';
import { User } from './types';
import { useUsers } from './hooks/useUsers';
import { PostList } from './components/PostList';
import { useUserPosts } from './hooks/useUserPosts';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    users,
    filteredUsers,
    loading: usersLoading,
    error: usersError,
    searchQuery,
    setSearchQuery,
    retry: retryUsers,
  } = useUsers();

  const {
    posts,
    loading: postsLoading,
    error: postsError,
    isSubmitting,
    submitError,
    createPost,
    retry: retryPosts,
  } = useUserPosts(selectedUser ? selectedUser.id : null);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="main-content-layout">
        <UserList
          {...{ users, filteredUsers, searchQuery, selectedUser }}
          loading={usersLoading}
          error={usersError}
          onSearchChange={setSearchQuery}
          onSelectUser={handleSelectUser}
          onRetry={retryUsers}
        />
        <PostList
          {...{ selectedUser, posts, isSubmitting, submitError }}
          loading={postsLoading}
          error={postsError}
          onCreatePost={createPost}
          onRetry={retryPosts}
        />
      </div>
    </div>
  );
};

export default App;
