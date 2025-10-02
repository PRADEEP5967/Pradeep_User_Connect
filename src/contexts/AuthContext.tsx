import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { getCurrentUser, setCurrentUser, getUserByEmail, addUser, updateUser } from '@/utils/localStorage';
import { validateUserForm, validatePassword } from '@/utils/validation';
import { toast } from '@/hooks/use-toast';

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

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = getUserByEmail(email);
      if (!foundUser) {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
        return false;
      }

      if (foundUser.password !== password) {
        toast({
          title: 'Login Failed', 
          description: 'Invalid email or password',
          variant: 'destructive',
        });
        return false;
      }

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

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'role'>): Promise<boolean> => {
    try {
      // Validate form data
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

      // Check if email already exists
      const existingUser = getUserByEmail(userData.email);
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
        ...userData, 
        role: 'user' 
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

      const success = updateUser(user.id, { password: newPassword });
      if (success) {
        const updatedUser = { ...user, password: newPassword };
        setUser(updatedUser);
        setCurrentUser(updatedUser);
        toast({
          title: 'Password Updated',
          description: 'Your password has been updated successfully',
        });
        return true;
      }
      return false;
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};