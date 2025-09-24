# Google OAuth Redirect URI Fix Guide

## Issue Summary
Google OAuth authentication hangs at `setSession()` because the redirect URIs are not properly configured in Supabase and Google Cloud Console.

## Solution Steps

### Step 1: Identify Your Redirect URIs

Based on your app configuration, you need these redirect URIs:

**Development (Expo Go):**
- `exp+sihapp://oauth/callback`

**Production (Standalone builds):**
- `com.sihapp://oauth/callback`

**Web (if needed):**
- `http://localhost:19006/oauth/callback`

### Step 2: Update Supabase Project Settings

1. Go to your Supabase Dashboard: https://app.supabase.com/project/rlbimhbdhtnortixhefb
2. Navigate to **Authentication** → **Providers**
3. Find **Google** provider and click **Configure**
4. In the **Authorized redirect URIs** section, add these URIs:
   ```
   exp+sihapp://oauth/callback
   com.sihapp://oauth/callback
   http://localhost:19006/oauth/callback
   ```
5. Click **Save**

### Step 3: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID for your mobile app
4. Click **Edit** on the client ID
5. In the **Authorized redirect URIs** section, add:
   ```
   exp+sihapp://oauth/callback
   com.sihapp://oauth/callback
   ```
6. Click **Save**

### Step 4: Verify Your Code Changes

Your code has been updated to:
- Use the correct redirect URI for development vs production
- Include the setTimeout fix in AuthContext (already implemented)
- Handle auth state changes without deadlocks

### Step 5: Test the OAuth Flow

1. Start your Expo development server:
   ```bash
   cd c:\Users\Lenovo\Desktop\sih\frontend\SIHApp
   npm start
   ```

2. Open your app in Expo Go
3. Try the Google OAuth login
4. The flow should now work without hanging

## Expected Behavior After Fix

1. User taps "Sign in with Google"
2. Google OAuth page opens in browser
3. User completes authentication
4. App redirects back successfully
5. User is signed in without hanging

## Troubleshooting

If the issue persists:

1. **Check Console Logs**: Look for any error messages in the Expo/React Native logs
2. **Verify URIs**: Double-check that the redirect URIs are exactly as specified above
3. **Clear Cache**: Clear Expo cache with `expo r -c`
4. **Check Network**: Ensure stable internet connection

## Technical Details

The root cause was:
- ❌ **Wrong**: Using generic or incorrect redirect URIs
- ✅ **Fixed**: Using proper Expo-generated URI schemes
- ✅ **Fixed**: setTimeout in onAuthStateChange to prevent deadlocks
- ✅ **Fixed**: Environment-specific redirect URI handling

## Code Changes Made

1. Updated `authService.ts` to use correct redirect URIs for dev/prod
2. AuthContext already had the setTimeout fix implemented
3. Proper error handling and timeout protection in place

---

**Note**: Make sure to complete steps 2 and 3 (Supabase and Google Cloud Console configuration) as these are the critical fixes needed for your OAuth flow to work properly.