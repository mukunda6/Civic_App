
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { AppUser, UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, AppUser> = {
    'head@test.com': {
        uid: 'head-user-01',
        name: 'GMC Head',
        email: 'head@test.com',
        role: 'Head',
        avatarUrl: 'https://picsum.photos/seed/head/100/100',
    },
    'admin@test.com': {
        uid: 'admin-user-01',
        name: 'Admin Manager',
        email: 'admin@test.com',
        role: 'Admin',
        avatarUrl: 'https://picsum.photos/seed/admin/100/100',
    },
    'citizen@test.com': {
        uid: 'citizen-user-01',
        name: 'John Citizen',
        email: 'citizen@test.com',
        role: 'Citizen',
        avatarUrl: 'https://picsum.photos/seed/citizen/100/100',
    }
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (mockUser) {
        setUser(mockUser);
    } else {
        // Default to citizen if email is not recognized
        const defaultUser = MOCK_USERS['citizen@test.com'];
        setUser({...defaultUser, email, name: 'Guest User'});
    }
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    router.push('/');
  };
  
  // This effect will run when the user state changes.
  useEffect(() => {
    if(user) {
        router.push('/dashboard');
    }
  }, [user, router]);


  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
