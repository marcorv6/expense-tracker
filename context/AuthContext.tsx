'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthContextType } from '@/types/auth';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

interface ExtendedAuthContextType extends AuthContextType {
  isMounted: boolean;
}

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useIsMounted();
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return api.getCurrentUser();
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return api.getCurrentToken();
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.login(credentials);
      setUser(res.user);
      setToken(res.token);
      toast.success(`Welcome back, ${res.user.name}!`);
      return res.user;
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || (err as Error)?.message || 'Login failed';
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.register(credentials);
      setUser(res.user);
      setToken(res.token);
      toast.success(`Account created! Welcome, ${res.user.name}`);
      return res.user;
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || (err as Error)?.message || 'Registration failed';
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoGuest = async (): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.loginAsDemoGuest();
      setUser(res.user);
      setToken(res.token);
      toast.success('Signed in as Recruiter Demo Guest ⚡');
      return res.user;
    } catch (err: unknown) {
      toast.error('Demo login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      setUser(null);
      setToken(null);
      toast.info('Signed out');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isMounted,
        login,
        register,
        loginAsDemoGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): ExtendedAuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
