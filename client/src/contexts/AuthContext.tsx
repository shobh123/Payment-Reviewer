import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone: string;
  avatar?: string;
  balance: number;
  trustScore: number;
  paymentRating: number;
  isVerified: boolean;
  phoneVerified: boolean;
  truecallerVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiService.getProfile();
          if (response.success) {
            setUser(response.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ identifier: email, password });
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const [firstName, lastName] = name.split(' ');
      const userData = {
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        password
      };
      const response = await apiService.register(userData);
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};