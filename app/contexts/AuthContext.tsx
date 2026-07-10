'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types/interfaces';
import { api } from '../utils/helpers';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [hasRefreshed, setHasRefreshed] = useState(false);

  const refreshUser = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('[AuthContext] Failed to parse stored user:', e);
      }
    }

    if (!token) {
      setUser(null);
      setLoading(false);
      setHasRefreshed(true);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      const userData = res.data.user || res.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      if (!storedUser) {
        setUser(null);
      }
    } finally {
      setLoading(false);
      setHasRefreshed(true);
    }
  }, []);

  useEffect(() => {
    if (!hasRefreshed) {
      refreshUser();
    }
  }, [refreshUser, hasRefreshed]);

  const register = async (fullName: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { full_name: fullName, email, password });
    const { access_token } = res.data;
    const user = res.data.user || res.data; // Handle different response structures
    localStorage.setItem('token', access_token);
    if (user && user.id) {
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setHasRefreshed(true);
    } else {
      setHasRefreshed(false); // Allow refreshUser to run
    }
    setLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setHasRefreshed(false); // Reset for next login
    router.push('/login');
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token } = res.data;
    const user = res.data.user || res.data; // Handle different response structures
    localStorage.setItem('token', access_token);
    if (user && user.id) {
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setHasRefreshed(true);
    } else {
      setHasRefreshed(false); // Allow refreshUser to run
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

// {email: "test@gmail.com", full_name: "Test User",…}
// company_id
// :
// null
// created_at
// :
// "2026-07-08T09:06:11.484139"
// email
// :
// "test@gmail.com"
// full_name
// :
// "Test User"
// hashed_password
// :
// "$2b$12$RXpdbW3BtvGekUhw8XkVzeCOf6B4wqRPGVyL1f.y74gKYIPDfCe.S"
// id
// :
// 4
