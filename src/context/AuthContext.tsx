'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { getToken, removeToken } from '../utils/auth';
import { getCurrentUser } from '../services/auth';


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        return;
      }

      const res = await getCurrentUser();
      setUser(res.data);
    } catch (error) {
      setUser(null);
      removeToken();
    }
  };

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, []);

  const login = async (token: string) => {
    const res = await getCurrentUser();
    setUser(res.data);
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
