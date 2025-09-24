/**
 * SIH App - React Native TypeScript with FastAPI Backend & Supabase Auth
 * Latest 2024 patterns and best practices with Google OAuth
 * Implements proper deep linking for mobile OAuth
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { supabase } from './src/services/supabase';
import { authService } from './src/services/authService';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  useEffect(() => {
    // Handle linking into app from OAuth redirect - Fixed for deadlock prevention
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link received:', url);
      
      // Handle OAuth callback using the auth service
      if (url.includes('oauth/callback') || url.includes('access_token') || url.includes('refresh_token')) {
        console.log('OAuth callback detected, processing URL:', url);
        
        // Use setTimeout to defer processing and avoid blocking the main thread
        setTimeout(async () => {
          try {
            const session = await authService.createSessionFromUrl(url);
            if (session) {
              console.log('Authentication successful!');
            }
          } catch (error) {
            console.error('Error processing OAuth callback:', error);
          }
        }, 100); // Small delay to ensure UI thread isn't blocked
      }
    };

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle initial URL if app was opened from deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL detected:', url);
        handleDeepLink({ url });
      }
    }).catch((error) => {
      console.error('Error getting initial URL:', error);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
