# 🔐 Supabase Authentication Setup

## Quick Setup Guide

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create account or sign in
4. Click "New Project"
5. Fill in project details:
   - **Name**: SIH App
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you

### 2. Get Project Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Update Your App Configuration
Update `src/services/supabase.ts`:
```typescript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 4. Configure Authentication
In Supabase Dashboard:
1. Go to **Authentication** → **Settings**
2. **Site URL**: `exp://192.168.1.4:8081` (for development)
3. **Email Templates**: Customize if needed
4. **Providers**: Enable/disable as needed

### 5. Test Authentication
1. Start your app: `npm start`
2. Open in Expo Go
3. Go to Register screen
4. Create a new account
5. Check your email for verification
6. Login with your credentials

## 🔥 Features Enabled

### ✅ What Works Now:
- **User Registration** with email verification
- **User Login** with email/password
- **User Logout** 
- **Session Management** with auto-refresh
- **Password Reset** (email-based)
- **Profile Updates**
- **Persistent Sessions** across app restarts

### 📱 User Experience:
- Real authentication (no mock data)
- Email verification required
- Secure password handling
- Auto-login on app restart
- Loading states and error handling

## 🛠️ Database Tables (Auto-created)

Supabase automatically creates these tables:
- `auth.users` - User accounts
- `auth.sessions` - User sessions
- `auth.refresh_tokens` - Token management

## 🔧 Advanced Configuration

### Custom User Metadata
Add custom fields during registration:
```typescript
await signUp({
  email,
  password,
  options: {
    data: {
      full_name: 'John Doe',
      avatar_url: 'https://...',
      role: 'user'
    }
  }
});
```

### Row Level Security (RLS)
Enable RLS for your custom tables:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
```

## 🚨 Security Best Practices

### ✅ Already Implemented:
- Environment variables for keys
- Row Level Security ready
- Secure token storage
- Auto token refresh
- HTTPS-only in production

### 🔒 Additional Security:
- Enable email confirmation
- Set password complexity rules
- Configure rate limiting
- Add 2FA (premium feature)

## 📊 User Management

### View Users:
Go to **Authentication** → **Users** in Supabase dashboard

### User Roles:
Add custom claims for role-based access

### Email Templates:
Customize in **Authentication** → **Email Templates**

## 🐛 Troubleshooting

### Common Issues:

**"Invalid API key"**
- Check SUPABASE_URL and SUPABASE_ANON_KEY
- Ensure they match your project

**"Email not confirmed"**
- Check spam folder
- Resend confirmation email
- Check email templates

**"Network Error"**
- Check internet connection
- Verify Supabase project status
- Check CORS settings

### Debug Mode:
Add to your app for debugging:
```typescript
console.log('Auth State:', user);
console.log('Session:', session);
```

## 🎯 Next Steps

1. **Update Supabase Config**: Add your project credentials
2. **Test Registration**: Create test account
3. **Verify Email**: Check email and confirm
4. **Test Login**: Login with verified account
5. **Add Custom Tables**: Create app-specific data tables

Your app now has **real authentication** powered by Supabase! 🚀