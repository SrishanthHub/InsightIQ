import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Global axios interceptor to attach JWT to all requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('insightiq_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('insightiq_token'));
  const [isLoading, setIsLoading] = useState(true);
  const didInit = useRef(false);

  // Only run once on mount to verify the stored token
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const initAuth = async () => {
      const savedToken = localStorage.getItem('insightiq_token');
      if (savedToken) {
        try {
          const baseUrl = import.meta.env.PROD ? '' : 'http://localhost:5000';
          const response = await axios.get(`${baseUrl}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          setUser(response.data.user);
          setToken(savedToken);
        } catch (error) {
          console.error("Token invalid or expired", error);
          localStorage.removeItem('insightiq_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('insightiq_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('insightiq_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
