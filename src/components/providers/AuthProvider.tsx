'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: string;
  userId: string;
  headline?: string;
  bio?: string;
  locationCity: string;
  locationCountry: string;
  building?: string;
  lookingFor: string;
  canOffer: string;
  skills?: string;
  experienceYears: number;
  websiteUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  organizerScore: number;
  venueScore: number;
  speakerScore: number;
  collaboratorScore: number;
  communityScore: number;
  reviewCount: number;
  collaborationsCount: number;
  responseRate: number;
  verificationLevel: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'FOUNDER' | 'STARTUP' | 'COMMUNITY' | 'VENUE' | 'PROFESSIONAL' | 'ADMIN';
  avatarUrl?: string;
  status: string;
  profile?: UserProfile;
  orgMemberships?: any[];
  commMemberships?: any[];
  unreadNotificationsCount?: number;
}

export interface DemoPersona {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  isDemoMode: boolean;
  personas: DemoPersona[];
  switchDemoPersona: (userId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemoMode: false,
  personas: [],
  switchDemoPersona: async () => {},
  refreshUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [personas, setPersonas] = useState<DemoPersona[]>([]);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to fetch user:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonas = async () => {
    try {
      const res = await fetch('/api/auth/personas');
      const data = await res.json();
      if (data.personas) {
        setPersonas(data.personas);
        setIsDemoMode(Boolean(data.isDemoMode));
      }
    } catch (e) {
      console.error('Failed to fetch personas:', e);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPersonas();
  }, []);

  const switchDemoPersona = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/demo-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        await fetchUser();
        router.refresh();
      }
    } catch (e) {
      console.error('Failed to switch persona:', e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        personas,
        switchDemoPersona,
        refreshUser: fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
