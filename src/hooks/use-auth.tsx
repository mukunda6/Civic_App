

'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { mockUsers } from '@/lib/mock-data';
import type { AppUser } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useLanguage } from './use-language';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, pass: string, name: string, role: AppUser['role'], details?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useLanguage(); // Use language hook to translate names

  const getTranslatedUser = (user: AppUser): AppUser => {
    return {
      ...user,
      name: t(user.nameKey),
    };
  };

  useEffect(() => {
    // In a real app, you'd verify a token here
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(getTranslatedUser(parsedUser));
    }
    setLoading(false);
  }, [t]);

  const login = async (email: string, pass: string) => {
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === pass
    );

    if (foundUser) {
      const appUser: AppUser = {
        uid: foundUser.uid,
        name: foundUser.name,
        nameKey: foundUser.nameKey,
        email: foundUser.email,
        role: foundUser.role,
        avatarUrl: foundUser.avatarUrl,
      };
      setUser(getTranslatedUser(appUser));
      sessionStorage.setItem('user', JSON.stringify(appUser));
    } else {
      throw new Error('Invalid email or password.');
    }
  };

  const logout = async () => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/');
  };

  const signUp = async (email: string, pass: string, name: string, role: AppUser['role'], details: any = {}) => {
    // This is a mock sign-up. In a real app, this would create a user in the database.
    console.log('Mock sign up for:', { email, name, role, details });
    
    // Check if user already exists in our mock data
    if (mockUsers.some(u => u.email === email)) {
        throw new Error('An account with this email already exists.');
    }
    
    // For the demo, we'll just log them in as a new user.
    const newUser: AppUser = {
        uid: `new-${Date.now()}`,
        name,
        nameKey: name.toLowerCase().replace(/ /g, '_'),
        email,
        role,
        avatarUrl: `https://picsum.photos/seed/${name.split(' ')[0]}/100/100`,
    };

    // Add to mock users array to allow login later in the session
    mockUsers.push({ ...newUser, password: pass });

    setUser(getTranslatedUser(newUser));
    sessionStorage.setItem('user', JSON.stringify(newUser));
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signUp }}>
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
