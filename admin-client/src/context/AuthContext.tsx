import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('admin-token');
      if (token) {
        try {
          // We can't easily verify the JWT on the client without the secret,
          // but we can try to fetch the user's profile or just trust the token
          // until the first API call fails.
          // For simplicity, we'll store the user data in localStorage too.
          const userData = localStorage.getItem('admin-user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (e) {
          console.error('Error initializing auth:', e);
          localStorage.removeItem('admin-token');
          localStorage.removeItem('admin-user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('admin-token', data.token);
    localStorage.setItem('admin-user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const signOut = async () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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
