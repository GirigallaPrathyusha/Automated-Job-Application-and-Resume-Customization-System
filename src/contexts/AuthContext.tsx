
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('jobApp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, you'd make an API call here
    // For now, we'll simulate by checking localStorage
    const storedUsers = JSON.parse(localStorage.getItem('jobApp_users') || '[]');
    const foundUser = storedUsers.find((u: User) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('jobApp_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const signup = async (userData: Omit<User, 'id'>) => {
    // In a real app, you'd make an API call here
    const newUser = {
      ...userData,
      id: Math.random().toString(36).substring(2, 9),
    };

    // Store in localStorage for demo purposes
    const storedUsers = JSON.parse(localStorage.getItem('jobApp_users') || '[]');
    storedUsers.push(newUser);
    localStorage.setItem('jobApp_users', JSON.stringify(storedUsers));
    
    // Auto login
    setUser(newUser as User);
    setIsAuthenticated(true);
    localStorage.setItem('jobApp_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('jobApp_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('jobApp_user', JSON.stringify(updatedUser));
      
      // Also update in users array
      const storedUsers = JSON.parse(localStorage.getItem('jobApp_users') || '[]');
      const updatedUsers = storedUsers.map((u: User) => u.id === user.id ? updatedUser : u);
      localStorage.setItem('jobApp_users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, updateUser }}>
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
