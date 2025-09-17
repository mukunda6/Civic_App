
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { AppUser } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { mockUsers } from '@/lib/mock-data-db';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, pass: string, name: string, role: AppUser['role']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Find users from mock data
const citizenUser = mockUsers.find(u => u.role === 'Citizen')!;
const adminUser = mockUsers.find(u => u.role === 'Admin')!;
const headUser = mockUsers.find(u => u.role === 'Head')!;

const usersForAuth: Record<string, AppUser> = {
  [citizenUser.email]: { ...citizenUser, password: 'password' } as AppUser,
  [adminUser.email]: { ...adminUser, password: 'password' } as AppUser,
  [headUser.email]: { ...headUser, password: 'password' } as AppUser,
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a logged-in user
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const potentialUser = usersForAuth[email];
    
    if (potentialUser && pass === 'password') {
      const userToSave = { ...potentialUser };
      // @ts-ignore
      delete userToSave.password; // Don't store password in state/session
      setUser(userToSave);
      sessionStorage.setItem('user', JSON.stringify(userToSave));
    } else {
      setLoading(false);
      throw new Error('Invalid email or password. The password for all demo accounts is `password`.');
    }
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/');
  };
  
  const signUp = async (email: string, pass: string, name: string, role: AppUser['role']) => {
    setLoading(true);
    // This is a mock sign up. In a real app, you'd call a backend service.
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: AppUser = {
      uid: `new-user-${Date.now()}`,
      name,
      email,
      role,
      avatarUrl: `https://picsum.photos/seed/${name.split(' ')[0]}/100/100`,
    };
    setUser(newUser);
    sessionStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
  }

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
