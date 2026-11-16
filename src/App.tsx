import { useState } from 'react';
import { Header } from './components/Header';
import { UserList } from './components/UserList';
import { User } from './types';
import { useUsers } from './hooks/useUsers';

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
      </div>
    </div>
  );
};

export default App;
