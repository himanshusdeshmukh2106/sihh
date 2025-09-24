# OAuth Debug Steps

## Current Issue
The OAuth flow hangs after opening the Google authentication URL. This is happening because of a redirect URI mismatch.

## Immediate Fix Required

### 1. Update Supabase Project Settings NOW

Go to your Supabase Dashboard and add this redirect URI:

**URL**: https://app.supabase.com/project/rlbimhbdhtnortixhefb/auth/providers

**Add this exact URI to Google Provider settings**:
```
exp+sihapp://oauth/callback
```

### 2. Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Add this redirect URI:
```
exp+sihapp://oauth/callback
```

### 3. Test Again

After adding the redirect URIs, restart your Expo app and try the Google OAuth again.

## Debug Information

From your logs, I can see:
- ✅ OAuth URL is generated correctly
- ✅ WebBrowser opens the OAuth URL
- ❌ **Missing**: The redirect URI `exp+sihapp://oauth/callback` is not configured in Supabase/Google

The key line in your logs:
```
redirect_to=exp%2Bsihapp%3A%2F%2Foauth%2Fcallback
```

This shows that the correct redirect URI (`exp+sihapp://oauth/callback`) is being sent to Google, but if it's not configured in both Supabase and Google Cloud Console, the OAuth flow will hang.

## Expected Behavior After Fix

You should see logs like:
```
LOG  OAuth result: {type: 'success', url: 'exp+sihapp://oauth/callback?...'}
LOG  OAuth successful, creating session...
LOG  Processing OAuth callback URL: exp+sihapp://oauth/callback?...
LOG  Setting session with tokens...
LOG  Session set successfully for user: user@example.com
```

## If Still Stuck

If the issue persists after adding the redirect URIs, run:
```bash
npx expo start --clear
```

This clears the cache and might resolve any caching issues.