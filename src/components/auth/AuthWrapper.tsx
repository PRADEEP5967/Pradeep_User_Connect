import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { UserDashboard } from '@/components/dashboards/UserDashboard';
import { StoreOwnerDashboard } from '@/components/dashboards/StoreOwnerDashboard';

export const AuthWrapper: React.FC = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // If user is not logged in, show auth forms
  if (!user) {
    return isLogin ? (
      <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
    );
  }

  // If user is logged in, show appropriate dashboard based on role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'user':
      return <UserDashboard />;
    case 'store_owner':
      return <StoreOwnerDashboard />;
    default:
      return <LoginForm onSwitchToRegister={() => setIsLogin(false)} />;
  }
};