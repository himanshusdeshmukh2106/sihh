/**
 * Login Screen Component - Redesigned
 * Clean and classy Google OAuth login with modern design
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Heading1, Heading2, Heading4, Body1, Body2 } from '../components/ui/Typography';
import { theme } from '../styles/theme';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Add timeout protection for the entire login process
      const loginPromise = signInWithGoogle();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout - please try again')), 30000)
      );
      
      await Promise.race([loginPromise, timeoutPromise]);
      
      // Note: The actual navigation will be handled by auth state changes
    } catch (error: any) {
      console.error('Google login error:', error);
      
      let errorMessage = 'Unable to sign in with Google';
      
      // Handle specific error types
      if (error.message?.includes('timeout')) {
        errorMessage = 'Login is taking too long. Please check your connection and try again.';
      } else if (error.message?.includes('access_denied')) {
        errorMessage = 'Access was denied. Please try again and allow access to continue.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary[600]} />
      
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Heading1 color="inverse" align="center" style={styles.heroTitle}>
                Welcome
              </Heading1>
              <Body1 color="inverse" align="center" style={styles.heroSubtitle}>
                Sign in to continue your athletic journey
              </Body1>
            </View>

            {/* Login Card */}
            <Card variant="glass" style={styles.loginCard}>
              <View style={styles.loginContent}>
                <View style={styles.iconContainer}>
                  <Heading1>🏆</Heading1>
                </View>
                
                <Heading2 align="center" style={styles.cardTitle}>
                  Sports Assessment Platform
                </Heading2>
                
                <Body2 color="secondary" align="center" style={styles.cardSubtitle}>
                  Access your personalized athletic dashboard
                </Body2>

                <Button
                  title="Continue with Google"
                  icon="🔐"
                  onPress={handleGoogleLogin}
                  loading={isLoading}
                  fullWidth
                  style={styles.googleButton}
                />

                <Button
                  title="← Back to Home"
                  variant="ghost"
                  onPress={goBack}
                  fullWidth
                  style={styles.backButton}
                />
              </View>
            </Card>

            {/* Security Info Card */}
            <Card variant="default" style={styles.infoCard}>
              <Heading4 style={styles.infoTitle}>🔐 Secure Authentication</Heading4>
              <View style={styles.infoList}>
                <Body2 color="secondary" style={styles.infoItem}>
                  • Google OAuth 2.0 authentication
                </Body2>
                <Body2 color="secondary" style={styles.infoItem}>
                  • No passwords to remember
                </Body2>
                <Body2 color="secondary" style={styles.infoItem}>
                  • Powered by Supabase
                </Body2>
                <Body2 color="secondary" style={styles.infoItem}>
                  • Enterprise-grade security
                </Body2>
              </View>
            </Card>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[900],
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    padding: theme.spacing[5],
    justifyContent: 'center',
  },
  
  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: theme.spacing[10],
  },
  heroTitle: {
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: theme.spacing[2],
  },
  heroSubtitle: {
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Login Card
  loginCard: {
    marginBottom: theme.spacing[6],
  },
  loginContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  cardTitle: {
    marginBottom: theme.spacing[2],
  },
  cardSubtitle: {
    marginBottom: theme.spacing[6],
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#4285f4',
    marginBottom: theme.spacing[3],
  },
  backButton: {
    marginTop: theme.spacing[2],
  },
  
  // Info Card
  infoCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary[500],
  },
  infoTitle: {
    marginBottom: theme.spacing[3],
  },
  infoList: {
    gap: theme.spacing[1],
  },
  infoItem: {
    marginBottom: theme.spacing[1],
  },
});

export default LoginScreen;