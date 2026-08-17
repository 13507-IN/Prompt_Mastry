'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  [key: string]: unknown;
}

interface RishirajAuthClient {
  isAuthenticated: boolean;
  user?: UserProfile;
  showLoginModal: () => void;
  logout: () => Promise<void>;
  getProfile: () => Promise<UserProfile>;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  } | null;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  authClient: RishirajAuthClient | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authClient, setAuthClient] = useState<RishirajAuthClient | null>(null);

  useEffect(() => {
    const initAuth = (attempts = 0) => {
      if (typeof window === 'undefined') return;

      const RishirajAuthClass = (window as any).RishirajAuth;
      if (!RishirajAuthClass) {
        if (attempts > 50) {
          console.error('RishirajAuth script failed to load. Is the auth server running?');
          setLoading(false);
          return;
        }
        // If script hasn't loaded yet, poll in 100ms
        setTimeout(() => initAuth(attempts + 1), 100);
        return;
      }

      try {
        const client = new (RishirajAuthClass as unknown as new (config: { serverUrl: string; tenantId: string; onLogin: (user: UserProfile) => void; onLogout: () => void }) => RishirajAuthClient)({
          serverUrl: process.env.NEXT_PUBLIC_RISHIRAJ_AUTH_URL || 'https://rishiraj-auth.onrender.com',
          tenantId: process.env.NEXT_PUBLIC_TENANT_ID || '',
          onLogin: (usr: UserProfile) => {
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
            .then((usr: UserProfile) => {
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
