import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Header } from './Header';
import { MainContent } from './MainContent';
import { Login } from '../auth/Login';

export const Layout: React.FC = () => {
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainContent />
    </div>
  );
};