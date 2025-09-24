# 🔧 Fix OAuth Redirect Issue (localhost:3000)

## 🚨 **Quick Fix for "Site Can't Be Reached" Error**

You're getting redirected to `localhost:3000` because Supabase has the wrong redirect URL configured.

### ⚡ **Immediate Fix Steps:**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: Click on your SIH project
3. **Navigate to**: Authentication → URL Configuration
4. **Change Site URL**: 
   - **From**: `http://localhost:3000`
   - **To**: `sihapp://auth/callback`

5. **Add Additional Redirect URLs**:
   ```
   sihapp://auth/callback
   exp://192.168.1.4:8081
   http://localhost:8081
   ```

6. **Save Changes**

### 🧪 **Test Again:**

1. **Restart your app**: `npm start`
2. **Open in Expo Go**: Scan QR code
3. **Try Google Login**: Should now redirect properly
4. **Check Console**: Look for "Deep link received" messages

### 📱 **What Should Happen Now:**

1. **Tap "Continue with Google"**
2. **Google login page opens** in browser
3. **Complete Google authentication**
4. **Browser redirects** to `sihapp://auth/callback`
5. **App automatically opens** and you're logged in
6. **No more localhost:3000 error**

### 🔍 **If Still Not Working:**

**Check Supabase URL Configuration:**
- Site URL: `sihapp://auth/callback`
- Additional redirect URLs include your app scheme
- No `localhost:3000` anywhere in the config

**Check Google Cloud Console:**
- Authorized redirect URIs: `https://rlbimhbdhtnortixhefb.supabase.co/auth/v1/callback`
- Make sure it matches your Supabase project URL exactly

### ✅ **Expected Result:**
After the fix, Google OAuth will redirect properly back to your mobile app instead of trying to open localhost:3000!

## 🎯 **Why This Happened:**
- Supabase defaults to `localhost:3000` for web apps
- Mobile apps need custom scheme redirects (`sihapp://`)
- The OAuth flow goes: Google → Supabase → Your App
- If Supabase redirect is wrong, it can't get back to your app

Try the fix and let me know if the redirect works properly! 🚀