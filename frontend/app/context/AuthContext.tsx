'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  authClient: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authClient, setAuthClient] = useState<any>(null);

  useEffect(() => {
    const initAuth = () => {
      if (typeof window === 'undefined') return;

      const RishirajAuthClass = (window as any).RishirajAuth;
      if (!RishirajAuthClass) {
        // If script hasn't loaded yet, poll in 100ms
        setTimeout(initAuth, 100);
        return;
      }

      try {
        const client = new RishirajAuthClass({
          serverUrl: process.env.NEXT_PUBLIC_RISHIRAJ_AUTH_URL || 'http://localhost:4000',
          tenantId: process.env.NEXT_PUBLIC_TENANT_ID || '',
          onLogin: (usr: any) => {
            setUser(usr);
            setIsAuthenticated(true);
          },
          onLogout: () => {
            setUser(null);
            setIsAuthenticated(false);
          }
        });

        setAuthClient(client);

        if (client.isAuthenticated && client.user) {
          setUser(client.user);
          setIsAuthenticated(true);
        } else if (client.isAuthenticated) {
          client.getProfile()
            .then((usr: any) => {
              setUser(usr);
              setIsAuthenticated(true);
            })
            .catch(() => {
              setIsAuthenticated(false);
            });
        }
      } catch (err) {
        console.error('Error initializing RishirajAuth client:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = () => {
    if (authClient) {
      authClient.showLoginModal();
    } else {
      console.error('Auth client not initialized');
    }
  };

  const logout = async () => {
    if (authClient) {
      await authClient.logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, authClient }}>
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
