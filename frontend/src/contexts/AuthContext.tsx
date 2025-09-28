import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';

interface User {
  id: string;
  retailer_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check if we have a token in localStorage
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Verify token with backend
          const response = await apiService.checkAuthStatus();
          if (!response.success) {
            // Token is invalid, clear it
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            setUser(null);
          }
        } catch (error) {
          console.error('Invalid user data in localStorage:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred during login' 
      };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success) {
        // Auto-login after successful registration
        const loginResult = await login(userData.email, userData.password);
        return loginResult;
      } else {
        return { 
          success: false, 
          error: response.error || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred during registration' 
      };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
