/**
 * Supabase Configuration
 * Authentication and database setup with environment variables
 */

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get Supabase configuration from environment variables
const SUPABASE_URL = Constants.expoConfig?.extra?.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set.'
  );
}

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // Optimize for mobile and prevent deadlocks
    flowType: 'pkce',
    debug: __DEV__, // Enable debug logs in development
    // Additional settings to prevent auth deadlocks
    storageKey: 'supabase.auth.token',
  },
  // Add global configuration
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-react-native',
    },
  },
  // Realtime configuration
  realtime: {
    // Disable realtime to reduce potential conflicts
    log_level: 'info',
  },
});