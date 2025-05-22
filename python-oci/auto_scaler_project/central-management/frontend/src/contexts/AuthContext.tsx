
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const username = localStorage.getItem('username');
      
      if (token && username) {
        try {
          // In a real app, we would validate the token with the server
          // For now, we'll just set the user based on local storage
          setUser({ username });
        } catch (error) {
          console.error('Authentication failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('username');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // In a production app, this would make a real API call
      // For development, we'll use mock authentication
      if (username === 'admin' && password === 'admin') {
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        
        // Store the token and user info
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('username', username);
        
        // Set the user
        setUser({ username });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
