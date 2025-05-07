import React, { createContext, useState, useContext } from 'react';

type Auth = {
  token: string;
  user: {
    userId: number;
    email: string;
  };
} | null;

interface AuthContextType {
  userId: number | null;
  auth: Auth;
  login: (auth: NonNullable<Auth>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>(() => {
    const stored = localStorage.getItem('auth');
    if (!stored) return null;
    
    try {
      const parsed = JSON.parse(stored);
      // Validate the stored data
      if (!parsed.token || !parsed.user?.userId || !parsed.user?.email) {
        localStorage.removeItem('auth');
        return null;
      }
      return parsed;
    } catch (err) {
      localStorage.removeItem('auth');
      return null;
    }
  });

  const login = (newAuth: NonNullable<Auth>) => {
    if (!newAuth.token || !newAuth.user) {
      console.error('Invalid auth data:', newAuth);
      return;
    }
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, userId: auth?.user.userId || null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};