export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'admin' | 'user' | 'store_owner';
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  createdAt: string;
  averageRating: number;
  totalRatings: number;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'role'> & { password: string }) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
}