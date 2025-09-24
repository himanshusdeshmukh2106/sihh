/**
 * Authentication Context - Google OAuth Only
 * Provides Google authentication state throughout the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authDirty, setAuthDirty] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Handle auth operations separately to avoid deadlocks
  useEffect(() => {
    if (authDirty && currentSession) {
      setAuthDirty(false);
      console.log('Processing auth state change:', currentSession?.user?.email);
      
      // Update state without async operations in the callback
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    } else if (authDirty && !currentSession) {
      setAuthDirty(false);
      console.log('User signed out');
      
      setSession(null);
      setUser(null);
      setLoading(false);
    }
  }, [authDirty, currentSession]);

  useEffect(() => {
    // Get initial session
    authService.getCurrentSession().then((session) => {
      if (session) {
        setCurrentSession(session);
        setAuthDirty(true);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting initial session:', error);
      setLoading(false);
    });

    // Listen for auth changes - FIXED: Use reactive pattern to avoid deadlocks
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        
        // Use reactive state pattern - no async operations in callback
        setTimeout(() => {
          switch (event) {
            case 'SIGNED_IN':
              console.log('User signed in:', session?.user?.email);
              setCurrentSession(session);
              setAuthDirty(true);
              break;
            case 'SIGNED_OUT':
              console.log('User signed out');
              setCurrentSession(null);
              setAuthDirty(true);
              break;
            case 'TOKEN_REFRESHED':
              console.log('Token refreshed');
              setCurrentSession(session);
              setAuthDirty(true);
              break;
            default:
              console.log('Other auth event:', event);
          }
        }, 0);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};