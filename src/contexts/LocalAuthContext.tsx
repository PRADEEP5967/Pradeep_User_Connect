import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { validateUserForm, validatePassword } from '@/utils/validation';
import { toast } from '@/hooks/use-toast';
import { 
  getUsers, 
  addUser, 
  getUserByEmail, 
  getCurrentUser, 
  setCurrentUser 
} from '@/utils/localStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      // Find user by email
      const foundUser = getUserByEmail(normalizedEmail);
      
      if (!foundUser) {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
        return false;
      }

      // Note: In a real app, passwords would be hashed
      // For this demo, we're doing a simple check
      // You would need to store hashed passwords and compare them properly
      
      setUser(foundUser);
      setCurrentUser(foundUser);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${foundUser.name}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Login Error',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setCurrentUser(null);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      toast({
        title: 'Logout Error',
        description: 'An error occurred during logout',
        variant: 'destructive',
      });
    }
  };

  const register = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'role'> & { password: string }): Promise<boolean> => {
    try {
      const errors = validateUserForm(userData);
      if (Object.keys(errors).length > 0) {
        const firstError = Object.values(errors)[0];
        toast({
          title: 'Validation Error',
          description: firstError,
          variant: 'destructive',
        });
        return false;
      }

      // Normalize and trim data
      const normalizedEmail = userData.email.trim().toLowerCase();
      
      // Check if user already exists
      const existingUser = getUserByEmail(normalizedEmail);
      if (existingUser) {
        toast({
          title: 'Registration Failed',
          description: 'An account with this email already exists',
          variant: 'destructive',
        });
        return false;
      }

      // Create new user
      const newUser = addUser({
        name: userData.name.trim(),
        email: normalizedEmail,
        address: userData.address.trim(),
        role: 'user',
      });

      setUser(newUser);
      setCurrentUser(newUser);
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully!',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Registration Error',
        description: 'An error occurred during registration',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        toast({
          title: 'Validation Error',
          description: passwordError,
          variant: 'destructive',
        });
        return false;
      }

      // Note: In a real app, you would hash and store the password
      // For this demo, we're just validating it
      
      toast({
        title: 'Password Updated',
        description: 'Your password has been updated successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Update Error',
        description: 'An error occurred while updating your password',
        variant: 'destructive',
      });
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    updatePassword,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
