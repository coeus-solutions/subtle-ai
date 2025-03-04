import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, setAuthToken, clearAuthToken } from './api-client';
import { jwtDecode } from 'jwt-decode';
import { socketCluster } from './socketcluster';

interface TokenPayload {
  sub: string;
  uuid: string;
  exp: number;
  publish: string[];
  subscribe: string[];
}

interface User {
  email: string;
  uuid: string;
  sub: string;
  publish: string[];
  subscribe: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setAuthToken(token);
        const userData = {
          email: decoded.sub,
          uuid: decoded.uuid,
          sub: decoded.sub,
          publish: decoded.publish,
          subscribe: decoded.subscribe
        };
        setUser(userData);
        socketCluster.authenticate();
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('token');
        clearAuthToken();
        socketCluster.deauthenticate();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      const token = response.access_token;
      const decoded = jwtDecode<TokenPayload>(token);
      
      localStorage.setItem('token', token);
      setAuthToken(token);
      const userData = {
        email: decoded.sub,
        uuid: decoded.uuid,
        sub: decoded.sub,
        publish: decoded.publish,
        subscribe: decoded.subscribe
      };
      setUser(userData);
      await socketCluster.authenticate();
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await auth.register({ email, password });
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      localStorage.removeItem('token');
      clearAuthToken();
      socketCluster.deauthenticate();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}