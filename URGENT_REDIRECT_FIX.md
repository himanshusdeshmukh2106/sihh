## 🔧 **Updated Fix: App Gets Stuck After Site URL Change**

If your app gets stuck after changing Site URL to `sihapp://auth/callback`, this is because mobile OAuth needs a different approach.

### **Fix: Change Site URL Back**

1. **Go to Supabase Dashboard** → Authentication → URL Configuration
2. **Change Site URL back to**: `http://localhost:3000` (temporarily)
3. **But ADD this to Additional Redirect URLs**:
   ```
   sihapp://auth/callback
   exp://192.168.1.4:8081
   http://localhost:8081
   ```

### **Why This Works Better**:
- **Site URL**: Used for web apps (keep as localhost for now)
- **Additional Redirect URLs**: Used for mobile deep links
- **OAuth flow**: Google → Supabase → Mobile app (via additional URLs)

---

# 🚨 URGENT: Fix localhost:3000 Redirect Issue

## 🔍 **Multiple Places to Check and Fix**

The localhost:3000 redirect can be coming from several places. Let's fix ALL of them:

### **1. Supabase Dashboard - Authentication Settings**

**Go to**: https://supabase.com/dashboard → Your Project → Authentication → URL Configuration

**Check and Update These Settings**:

✅ **Site URL**: 
- **Current**: `http://localhost:3000` ❌
- **Change to**: `sihapp://auth/callback` ✅

✅ **Additional Redirect URLs** (add all of these):
```
sihapp://auth/callback
exp://192.168.1.4:8081
http://localhost:8081
```

### **2. Supabase Dashboard - Google Provider Settings**

**Go to**: Authentication → Providers → Google

**Check**:
- ✅ Google provider is **enabled**
- ✅ Client ID is filled
- ✅ Client Secret is filled
- ✅ **No custom redirect URL** in provider settings

### **3. Google Cloud Console - OAuth Settings**

**Go to**: https://console.cloud.google.com → Your Project → APIs & Services → Credentials

**Check Authorized redirect URIs**:
```
https://rlbimhbdhtnortixhefb.supabase.co/auth/v1/callback
```

**Make sure it's EXACTLY your Supabase URL** (not localhost:3000)

### **4. Check Your Supabase Project URL**

**Verify your project URL**:
- Go to Supabase Dashboard → Settings → API
- **Project URL**: Should be `https://rlbimhbdhtnortixhefb.supabase.co`
- **NOT**: `http://localhost:3000`

### **5. Clear Browser Cache**

The redirect might be cached:
1. **Close all browser tabs**
2. **Clear browser cache** (or use incognito/private mode)
3. **Try OAuth again**

## 🧪 **Testing Steps After Fixes**

1. **Restart Expo**: `npm start`
2. **Clear app cache**: Close and reopen Expo Go
3. **Try Google login**
4. **Check console logs** for OAuth URL

## 🔍 **Debug: Check the OAuth URL**

When you tap "Continue with Google", check the console log for the OAuth URL. It should look like:
```
https://accounts.google.com/oauth/authorize?client_id=...&redirect_uri=https%3A%2F%2Frlbimhbdhtnortixhefb.supabase.co%2Fauth%2Fv1%2Fcallback
```

**If you see `localhost:3000` in this URL**, then the issue is in Google Cloud Console settings.

## 🚨 **Most Common Causes**

1. **Wrong Supabase Site URL** (still set to localhost:3000)
2. **Google OAuth redirect URI** points to localhost instead of Supabase
3. **Browser cache** remembering old redirect
4. **Wrong Supabase project URL** in environment variables

## ⚡ **Nuclear Option: Reset OAuth Setup**

If nothing works:

1. **Delete Google OAuth credentials** in Google Cloud Console
2. **Create new OAuth client** with correct Supabase callback URL
3. **Update Supabase** with new Client ID/Secret
4. **Test again**

## 📱 **Expected Working Flow**

1. Tap "Continue with Google"
2. Browser opens Google OAuth page
3. Login with Google
4. **Browser redirects to**: `https://rlbimhbdhtnortixhefb.supabase.co/auth/v1/callback`
5. **Supabase processes auth**
6. **Supabase redirects to**: `sihapp://auth/callback`
7. **Your app opens** and you're logged in

Let me know which step shows localhost:3000! 🎯