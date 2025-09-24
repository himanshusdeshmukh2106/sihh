/**
 * Supabase Google Authentication Service
 * Handles Google OAuth authentication with Supabase
 * Based on official Supabase mobile deep linking documentation
 */

import { supabase } from './supabase';
import { AuthResponse, User, Session } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Required for web only
WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
  user_metadata?: any;
}

class AuthService {
  // Get the correct redirect URI for the current environment
  private getRedirectUri(): string {
    // Use makeRedirectUri to generate the proper URI for the current environment
    return makeRedirectUri({});
  }

  constructor() {
    console.log('AuthService initialized');
  }

  // Create session from URL (for deep link handling) - Fixed for authorization code flow
  async createSessionFromUrl(url: string): Promise<Session | null> {
    try {
      console.log('Processing OAuth callback URL:', url);
      
      // Handle both hash and query parameters
      const urlObj = new URL(url);
      let params: any = {};
      
      if (urlObj.hash) {
        // Extract from hash (token flow)
        const hashParams = new URLSearchParams(urlObj.hash.substring(1));
        hashParams.forEach((value, key) => {
          params[key] = value;
        });
      } else {
        // Extract from query parameters (code flow)
        urlObj.searchParams.forEach((value, key) => {
          params[key] = value;
        });
      }
      
      console.log('Extracted params:', Object.keys(params));

      if (params.error) {
        console.error('OAuth error in URL:', params.error);
        throw new Error(`Authentication failed: ${params.error}`);
      }

      // Handle authorization code flow
      if (params.code && !params.access_token) {
        console.log('Received authorization code, exchanging for session...');
        
        try {
          // Use Supabase's built-in method to exchange code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
          
          if (error) {
            console.error('Error exchanging code for session:', error.message);
            throw new Error(`Failed to exchange code: ${error.message}`);
          }
          
          console.log('Code exchange successful for user:', data.session?.user?.email);
          return data.session;
        } catch (exchangeError) {
          console.error('Code exchange failed:', exchangeError);
          throw exchangeError;
        }
      }

      // Handle direct token flow (fallback)
      const { access_token, refresh_token } = params;

      if (!access_token) {
        console.log('No access token or code found in URL');
        return null;
      }

      console.log('Setting session with tokens...');
      
      // Use timeout protection to prevent deadlocks
      const setSessionPromise = supabase.auth.setSession({
        access_token,
        refresh_token: refresh_token || '',
      });
      
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('setSession timeout - possible deadlock detected')), 10000)
      );
      
      const { data, error } = await Promise.race([setSessionPromise, timeoutPromise]);

      if (error) {
        console.error('Error setting session:', error.message);
        throw new Error(`Failed to create session: ${error.message}`);
      }

      console.log('Session set successfully for user:', data.session?.user?.email);
      return data.session;
    } catch (error) {
      console.error('Error creating session from URL:', error);
      throw error;
    }
  }

  // Sign in with Google OAuth - Fixed for deadlock issue
  async signInWithGoogle(): Promise<void> {
    try {
      console.log('Starting Google OAuth...');
      
      // Get the correct redirect URI for current environment
      const redirectUri = this.getRedirectUri();
      console.log('Redirect URI:', redirectUri);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true, // Important for mobile
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Opening OAuth URL:', data.url);

        try {
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUri
          );

          console.log('OAuth result:', result);

          if (result.type === 'success') {
            console.log('OAuth successful, creating session...');
            await this.createSessionFromUrl(result.url);
          } else if (result.type === 'cancel') {
            console.log('OAuth cancelled by user');
            throw new Error('Authentication cancelled by user');
          } else {
            console.log('OAuth failed:', result);
            throw new Error('Authentication failed');
          }
        } catch (webBrowserError) {
          console.error('WebBrowser error:', webBrowserError);
          throw new Error(`Authentication failed: ${webBrowserError}`);
        }
      } else {
        throw new Error('No OAuth URL received from Supabase');
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Get current session
  async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  // Listen to auth changes - No async operations in callback to prevent deadlocks
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      // Ensure callback execution doesn't block the auth flow
      try {
        callback(event, session);
      } catch (error) {
        console.error('Error in auth state change callback:', error);
      }
    });
  }

  // Helper method to recover from potential deadlocks
  async recoverSession(): Promise<Session | null> {
    try {
      console.log('Attempting session recovery...');
      
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.log('Session refresh failed, getting current session...');
        return await this.getCurrentSession();
      }
      
      console.log('Session recovered successfully');
      return data.session;
    } catch (error) {
      console.error('Session recovery failed:', error);
      return null;
    }
  }

  // Handle deep link authentication (simplified for current setup)
  async handleAuthCallback(): Promise<void> {
    // This will be handled by the auth state change listener
    // No additional processing needed for Google OAuth
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;