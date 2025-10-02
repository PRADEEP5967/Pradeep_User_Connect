import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { supabase } from '@/lib/supabase';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      (async () => {
        await checkUser();
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        } else if (userData) {
          setUser(userData as User);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Normalize email to lowercase for consistency
      const normalizedEmail = email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (userError || !userData) {
          toast({
            title: 'Login Failed',
            description: 'User profile not found',
            variant: 'destructive',
          });
          return false;
        }

        setUser(userData as User);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${userData.name}!`,
        });
        return true;
      }

      return false;
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
      await supabase.auth.signOut();
      setUser(null);
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

      // Normalize email to lowercase and trim all fields
      const normalizedData = {
        ...userData,
        email: userData.email.trim().toLowerCase(),
        name: userData.name.trim(),
        address: userData.address.trim()
      };

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedData.email,
        password: userData.password,
      });

      if (authError) {
        toast({
          title: 'Registration Failed',
          description: authError.message,
          variant: 'destructive',
        });
        return false;
      }

      if (!authData.user) {
        toast({
          title: 'Registration Failed',
          description: 'Failed to create account',
          variant: 'destructive',
        });
        return false;
      }

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: normalizedData.email,
          name: normalizedData.name,
          address: normalizedData.address,
          role: 'user',
        })
        .select()
        .single();

      if (insertError) {
        await supabase.auth.signOut();
        toast({
          title: 'Registration Failed',
          description: 'Failed to create user profile',
          variant: 'destructive',
        });
        return false;
      }

      setUser(newUser as User);
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

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast({
          title: 'Update Error',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

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
