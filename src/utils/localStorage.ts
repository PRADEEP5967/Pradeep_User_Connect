import { User, Store, Rating } from '@/types';

const STORAGE_KEYS = {
  USERS: 'store_rating_users',
  STORES: 'store_rating_stores',
  RATINGS: 'store_rating_ratings',
  CURRENT_USER: 'store_rating_current_user'
};

// Initialize default admin user
const initializeDefaultData = () => {
  const users = getUsers();
  if (users.length === 0) {
    const defaultAdmin: User = {
      id: '1',
      name: 'System Administrator Account',
      email: 'admin@system.com',
      address: '123 Admin Street, Admin City, AC 12345',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    saveUsers([defaultAdmin]);
  }
};

// User operations
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user: Omit<User, 'id' | 'created_at' | 'updated_at'>): User => {
  const users = getUsers();
  const now = new Date().toISOString();
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    created_at: now,
    updated_at: now
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const updateUser = (userId: string, updates: Partial<User>): boolean => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return true;
  }
  return false;
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
};

// Store operations
export const getStores = (): Store[] => {
  const stores = localStorage.getItem(STORAGE_KEYS.STORES);
  return stores ? JSON.parse(stores) : [];
};

export const saveStores = (stores: Store[]): void => {
  localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
};

export const addStore = (store: Omit<Store, 'id' | 'createdAt' | 'averageRating' | 'totalRatings'>): Store => {
  const stores = getStores();
  const newStore: Store = {
    ...store,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    averageRating: 0,
    totalRatings: 0
  };
  stores.push(newStore);
  saveStores(stores);
  return newStore;
};

export const updateStoreRating = (storeId: string): void => {
  const stores = getStores();
  const ratings = getRatings();
  const storeRatings = ratings.filter(r => r.storeId === storeId);
  
  const storeIndex = stores.findIndex(s => s.id === storeId);
  if (storeIndex !== -1) {
    const totalRatings = storeRatings.length;
    const averageRating = totalRatings > 0 
      ? storeRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;
    
    stores[storeIndex].averageRating = Math.round(averageRating * 10) / 10;
    stores[storeIndex].totalRatings = totalRatings;
    saveStores(stores);
  }
};

// Rating operations
export const getRatings = (): Rating[] => {
  const ratings = localStorage.getItem(STORAGE_KEYS.RATINGS);
  return ratings ? JSON.parse(ratings) : [];
};

export const saveRatings = (ratings: Rating[]): void => {
  localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
};

export const addRating = (rating: Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>): Rating => {
  const ratings = getRatings();
  const existingRatingIndex = ratings.findIndex(
    r => r.userId === rating.userId && r.storeId === rating.storeId
  );
  
  if (existingRatingIndex !== -1) {
    // Update existing rating
    ratings[existingRatingIndex] = {
      ...ratings[existingRatingIndex],
      rating: rating.rating,
      comment: rating.comment,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Add new rating
    const newRating: Rating = {
      ...rating,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    ratings.push(newRating);
  }
  
  saveRatings(ratings);
  updateStoreRating(rating.storeId);
  return ratings.find(r => r.userId === rating.userId && r.storeId === rating.storeId)!;
};

export const getUserRating = (userId: string, storeId: string): Rating | null => {
  const ratings = getRatings();
  return ratings.find(r => r.userId === userId && r.storeId === storeId) || null;
};

// Authentication
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Initialize on import
initializeDefaultData();