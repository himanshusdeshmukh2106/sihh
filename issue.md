Google OAuth Sign-In Hangs at setSession in React Native (Expo) App #1429
Closed
Closed
Google OAuth Sign-In Hangs at setSession in React Native (Expo) App
#1429
@berkingurcan
Description
berkingurcan
opened on May 25 · edited by berkingurcan
Bug report

I confirm this is a bug with Supabase, not with my own application.

I confirm I have searched the Docs, GitHub Discussions, and Discord.
Describe the bug
When using Google OAuth with Supabase in a React Native (Expo) app, the sign-in process hangs at supabase.auth.setSession call. While the authentication succeeds and the user is created/authorized in Supabase, the app's UX becomes unresponsive and doesn't redirect back properly. This issue specifically occurs with Google OAuth, while Apple Sign-In works smoothly in the same implementation.

Environment
Platform: React Native (Expo)
Supabase JS Version: ^2.49.5-next.5
expo-auth-session: ^6.1.5
expo-web-browser: ~14.1.6
React Native Version: 0.79.2
To Reproduce
I can't provide steps to reproduce.

Current Behavior
Google OAuth flow starts successfully
User completes Google authentication
Redirect URL is received with valid tokens
supabase.auth.setSession is called with the tokens
The call appears to succeed (user is created/authorized in Supabase)
However, the promise from setSession never resolves
App becomes unresponsive at this point
Expected Behavior
The setSession call should resolve promptly after setting the session, allowing the app to continue its flow and properly redirect back to the application.

Code Example
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google OAuth process');
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'inphrasia',
      preferLocalhost: __DEV__
    });
    console.log('Using redirect URI:', redirectUri);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        skipBrowserRedirect: true // This is important for Expo workflow
      }
    });

    console.log('Supabase OAuth response:', { data, error });

    if (error) {
      console.error('Supabase OAuth error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // For Expo development environment, we need to manually open the URL
    if (data && data.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
      );
      
      console.log('WebBrowser auth result:', result);
      
      if (result.type === 'success' && result.url) {
        // Extract tokens from the URL
        const url = new URL(result.url);
        const params = url.hash ? new URLSearchParams(url.hash.substring(1)) : new URLSearchParams(url.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');
        
        console.log('Extracted tokens from URL:', { 
          accessToken: accessToken ? 'exists' : 'missing',
          refreshToken: refreshToken ? 'exists' : 'missing',
          expiresIn 
        });
        
        // If we have an access token, set it in Supabase
        if (accessToken) {
          console.log('Extracted tokens for setSession. AccessToken (first 10 chars):', accessToken.substring(0, 10), 'RefreshToken present:', !!refreshToken);
          
          // 1. Quick Network Check
          try {
            console.log('Performing quick network check...');
            const networkCheck = await fetch('https://google.com', { method: 'HEAD' }); // Using Google as a reliable endpoint
            console.log('Network check status:', networkCheck.status);
            if (!networkCheck.ok) {
              console.error('Network check failed. Status:', networkCheck.status);
              return { success: false, error: 'Network check failed before setSession. Please check internet connectivity.' };
            }
            console.log('Network check successful.');
          } catch (netError: any) {
            console.error('Network check threw an error:', netError.message, netError);
            return { success: false, error: `Network check failed: ${netError.message}` };
          }
          
          console.log('Attempting to set Supabase session. Access token present. Refresh token status:', refreshToken ? 'present' : 'absent');
          
          let sessionDataFromSetSession, sessionErrorFromSetSession;
          try {
            console.log('>>> BEFORE await supabase.auth.setSession');
            
            // 2. setSession with Timeout STUCKS HERE!!
            const setSessionPromise = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('setSession call timed out after 15 seconds')), 15000)
            );

            // @ts-ignore TS might complain about Promise<unknown> vs specific type, but fine for race
            const response = await Promise.race([setSessionPromise, timeoutPromise]);
            
            console.log('<<< AFTER await supabase.auth.setSession. Raw response:', response);
            // @ts-ignore response type needs assertion if TS strict
            sessionDataFromSetSession = response.data;
            // @ts-ignore response type needs assertion if TS strict
            sessionErrorFromSetSession = response.error;

          }
Additional Context
The issue occured after integrating Supabase DB with the app for user creation and authorizing. Before that, it was working well.
Apple Sign-In implementation works correctly in the same codebase
The authentication itself succeeds (user is created/authorized in Supabase)
The issue appears to be specifically with the setSession promise resolution
I've implemented a 15-second timeout as a workaround, but this doesn't solve anything.
Activity

berkingurcan
added 
bug
Something isn't working
 on May 25
j4w8n
j4w8n commented on May 26
j4w8n
on May 26
Contributor
You need to await the call.

berkingurcan
berkingurcan commented on May 26
berkingurcan
on May 26
Author
You need to await the call.

I did before, it was same. Checked now, still same.

j4w8n
j4w8n commented on May 26
j4w8n
on May 26
Contributor
Are you using supabase.auth.onAuthStateChange anywhere? If so, what does that code look like?

berkingurcan
berkingurcan commented on May 26
berkingurcan
on May 26
Author
onAuthStateChange

Yes exactly:

useEffect(() => {
    // Initialize authentication and load user data
    const initialize = async () => {
      try {
        // Initialize auth configuration
        await initializeAuth();
        
        // Listen for auth changes with Supabase
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const userData = await createUserDataFromSupabaseUser(session.user);
            setUser(userData);
            await storeUserData(userData);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
          }
        });
        
        // Check for current user in Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData = await createUserDataFromSupabaseUser(session.user);
          setUser(userData);
          await storeUserData(userData);
        } else {
          // Check for stored user data (for biometric login)
          const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
j4w8n
j4w8n commented on May 26
j4w8n
on May 26
Contributor
Ok, thanks. Are any of those functions within it calling other supabase things?

There's an important note here, about using await inside onAuthStateChange. I just wanted to make sure thatnot causing the issue.

https://supabase.com/docs/reference/javascript/auth-onauthstatechange

berkingurcan
berkingurcan commented on May 26
berkingurcan
on May 26 · edited by berkingurcan
Author
Incredible! Thank you very much it is solved! I was trying to solve this for a week :D

Yes inside the useEffect, onAuthStateChange makes multiple await calls to Supabase functions. So, I have changed
the code to this:

const { data } = supabase.auth.onAuthStateChange((event, session) => {
          // Use setTimeout to defer async operations and avoid deadlocks
          setTimeout(async () => {
            if (event === 'SIGNED_IN' && session?.user) {
              const userData = await createUserDataFromSupabaseUser(session.user);
              setUser(userData);
              await storeUserData(userData);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              await AsyncStorage.removeItem(USER_STORAGE_KEY);
            }
          }, 0);
        });
authListener = data;
and returned like

return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
and solved. Thank you very much!

go 