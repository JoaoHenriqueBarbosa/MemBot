import { User } from 'private/utils/types';
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  user: Partial<User> | null;
  setAuth: (token: string | null, user: Partial<User> | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<Partial<User> | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const setAuth = (newToken: string | null, newUser: Partial<User> | null) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken && newUser) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
