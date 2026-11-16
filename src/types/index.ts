export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  isLocal?: boolean;
  createdAt?: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface NewPostInput {
  title: string;
  body: string;
  userId: number;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface UserListProps {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onRetry: () => void;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
}

export interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
}
