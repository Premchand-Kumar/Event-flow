import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { users } from '../mocks/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, role: 'attendee' | 'organizer') => Promise<boolean>;
  logout: () => void;
}

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
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('eventflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock authentication (no password check in the prototype)
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('eventflow_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const register = async (
    email: string, 
    name: string, 
    role: 'attendee' | 'organizer'
  ): Promise<boolean> => {
    // Mock registration delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return false;
    }
    
    // Create new user with mock ID
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role
    };
    
    // In a real app, we would send this to the backend
    // For the prototype, we'll just set the user as logged in
    setUser(newUser);
    localStorage.setItem('eventflow_user', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};