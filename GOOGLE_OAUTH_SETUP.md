# 🔐 Google OAuth Setup Guide

## ✅ App Configuration Complete!

Your React Native app is now configured for **Google OAuth only** authentication. Here's what you need to do:

## 💡 **Why "Web Application" for Mobile App?**

This is a common confusion! Here's why:

**OAuth Flow Explanation**:
1. **Your Mobile App** → Opens browser with Google OAuth URL
2. **Google** → User logs in on Google's website 
3. **Google** → Redirects to **Supabase servers** (web-based)
4. **Supabase** → Processes the OAuth callback
5. **Supabase** → Redirects back to your mobile app

**Why "Web Application" Type**:
- The OAuth callback goes to **Supabase's web servers** first
- Supabase acts as the "web application" in Google's eyes
- Your mobile app receives the final result from Supabase
- This is the standard pattern for mobile apps using Supabase auth

**Alternative (More Complex)**:
You *could* use "Android" and "iOS" OAuth client types, but then you'd need:
- Separate Android/iOS OAuth clients
- Direct Google OAuth integration (no Supabase)
- Manual JWT token handling
- More complex implementation

**Recommended**: Stick with "Web Application" + Supabase for simplicity!

---

## 📋 Supabase Google OAuth Setup

### Step 1: Enable Google Provider in Supabase

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: SIH Project
3. **Navigate**: Authentication → Providers
4. **Find Google** in the list
5. **Toggle**: Enable Google provider

### Step 2: Configure Google OAuth

You need to create a Google OAuth app:

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create/Select Project**:
   - Project name: "SIH App"
   - Note your Project ID

3. **Enable Google+ API**:
   - APIs & Services → Library
   - Search "Google+ API" 
   - Click "Enable"

4. **Create OAuth Credentials**:
   
   **For Supabase (Required)**:
   - APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: **"Web application"** (This is correct for Supabase)
   - Name: "SIH App Supabase"
   
   **Note**: Even though this is a mobile app, Supabase requires "Web application" type because the OAuth flow goes through Supabase's web servers first, then redirects back to your mobile app.
   
5. **Configure Redirect URIs**:
   Add these URLs in "Authorized redirect URIs":
   ```
   https://rlbimhbdhtnortixhefb.supabase.co/auth/v1/callback
   ```
   **Important**: Use your exact Supabase project URL!

6. **Get Credentials**:
   - Copy your **Client ID**
   - Copy your **Client Secret**

### Step 3: Fix Supabase Redirect URL (IMPORTANT!)

**This fixes the "localhost:3000" redirect issue**:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: SIH Project
3. **Navigate**: Authentication → URL Configuration
4. **Update Site URL**: Change from `http://localhost:3000` to:
   ```
   sihapp://auth/callback
   ```
5. **Additional redirect URLs**: Add these in "Additional redirect URLs":
   ```
   sihapp://auth/callback
   exp://192.168.1.4:8081
   http://localhost:8081
   ```
6. **Save changes**

### Step 4: Add Google Credentials to Supabase

Back in Supabase Dashboard:

1. **Authentication → Providers → Google**
2. **Add your credentials**:
   - **Client ID**: (from Google Console)
   - **Client Secret**: (from Google Console)
3. **Save Configuration**

## 🚀 App Features Now Available

### ✅ What Works:
- **Google OAuth Login**: One-click authentication
- **Automatic Registration**: Users created on first login
- **Session Management**: Auto-login on app restart
- **Secure Logout**: Proper session cleanup
- **User Profile**: Access to Google profile data

### 📱 User Experience:
- **No Forms**: No email/password fields
- **One Button**: Simple "Continue with Google"
- **Fast**: Instant authentication
- **Secure**: Google OAuth 2.0 standards

## 🧪 Testing Instructions

### Development Testing:
1. **Start App**: `npm start` in `frontend/SIHApp`
2. **Open Expo Go**: Scan QR code
3. **Navigate**: Home → Login
4. **Test**: Tap "Continue with Google"
5. **Verify**: Google OAuth flow opens in browser
6. **Complete**: Login with your Google account

### Expected Flow:
1. User taps "Continue with Google"
2. Google OAuth page opens in browser
3. User logs in with Google
4. Browser redirects back to app
5. User is authenticated and sees profile

## 🔧 Troubleshooting

### Common Issues:

**"OAuth Error - Invalid Client"**
- Check Google Cloud Console credentials
- Verify redirect URI matches exactly
- Ensure Google+ API is enabled

**"Provider Not Configured"**
- Check Supabase → Authentication → Providers
- Ensure Google provider is enabled
- Verify Client ID/Secret are correct

**"Redirect URI Mismatch"**
- Must use exact Supabase callback URL
- Check for typos in redirect URI
- Ensure HTTPS (not HTTP)

## 📊 User Data Available

After Google OAuth login, you get:
```typescript
user: {
  id: "google-user-id",
  email: "user@gmail.com",
  user_metadata: {
    full_name: "John Doe",
    avatar_url: "https://lh3.googleusercontent.com/...",
    picture: "https://lh3.googleusercontent.com/..."
  }
}
```

## 🎯 Production Considerations

### For Production:
1. **Domain Verification**: Add your production domain to Google Console
2. **OAuth Consent Screen**: Configure for production use
3. **Privacy Policy**: Required for Google OAuth approval
4. **Terms of Service**: Required for app store submission

### Expo Build:
- App will work in Expo Go for development
- For production builds, use EAS Build
- OAuth redirect will work in standalone apps

## ✨ Your App Is Ready!

Your SIH app now has:
- ✅ **Modern Authentication**: Google OAuth only
- ✅ **Clean UI**: Simple, professional login screens
- ✅ **Secure**: Industry-standard OAuth 2.0
- ✅ **Fast**: No form filling required
- ✅ **Mobile Optimized**: Perfect for React Native

Just complete the Google OAuth setup in Supabase and you're ready to go! 🎉