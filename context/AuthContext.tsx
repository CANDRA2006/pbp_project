import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
  setGuestMode: (enabled: boolean) => void;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => ReturnType<typeof supabase.auth.signUp>;
  signIn: (email: string, password: string) => ReturnType<typeof supabase.auth.signInWithPassword>;
  resendSignup: (email: string) => ReturnType<typeof supabase.auth.resend>;
  signOut: () => ReturnType<typeof supabase.auth.signOut>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    let alive = true;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) console.warn('Unable to restore auth session:', error.message);
      setSession(data.session);
      setIsLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) setIsGuest(false);
      setIsLoading(false);
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    isLoading,
    isGuest,
    setGuestMode: (enabled) => setIsGuest(enabled),
    signUp: (email, password, metadata) => supabase.auth.signUp({ email, password, options: { data: metadata, emailRedirectTo: Linking.createURL('auth/callback') } }),
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    resendSignup: (email) => supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: Linking.createURL('auth/callback') } }),
    signOut: () => supabase.auth.signOut(),
  }), [session, isLoading, isGuest]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
