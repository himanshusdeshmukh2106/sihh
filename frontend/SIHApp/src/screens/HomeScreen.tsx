/**
 * Home Screen Component - Redesigned
 * Clean and classy main landing screen with modern design
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Heading1, Heading2, Heading3, Heading4, Body1, Body2, Caption } from '../components/ui/Typography';
import { theme } from '../styles/theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, session, loading, signInWithGoogle, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');

  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Redirect to profile setup after successful authentication
  useEffect(() => {
    if (user && session && !loading) {
      // Check if user needs to complete profile setup
      // In a real app, you'd check user.user_metadata or make an API call
      const hasCompletedProfile = user.user_metadata?.profile_completed;
      
      if (!hasCompletedProfile) {
        navigation.navigate('ProfileSetup');
      }
    }
  }, [user, session, loading, navigation]);

  const checkBackendConnection = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.healthCheck();
      setBackendStatus(`✅ Backend Connected - ${response.message || 'OK'}`);
    } catch (error) {
      setBackendStatus('❌ Backend Disconnected');
      console.error('Backend connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Sign Out Failed', 'Unable to sign out. Please try again.');
    }
  };

  const handleNavigation = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen as any);
  };

  const showApiDemo = () => {
    Alert.alert(
      'Sports Assessment Platform',
      'Features:\n\n• Google OAuth Authentication\n• Athlete Profile Setup\n• Sports Preferences\n• Training Goals & Scheduling\n• Performance Assessment\n• Clean & Modern UI',
      [{ text: 'Got it!' }]
    );
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
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Heading1 color="inverse" align="center" style={styles.heroTitle}>
                🏆 Sports Assessment Platform
              </Heading1>
              <Body1 color="inverse" align="center" style={styles.heroSubtitle}>
                Elevate Your Athletic Performance
              </Body1>
            </View>

            {/* User Status Card */}
            {user ? (
              <Card variant="glass" style={styles.userCard}>
                <Heading3 align="center" style={styles.welcomeText}>
                  Welcome back! 👋
                </Heading3>
                <Body2 color="secondary" align="center" style={styles.userEmail}>
                  {user.email}
                </Body2>
                <Button
                  title="Sign Out"
                  variant="outline"
                  onPress={handleSignOut}
                  style={styles.signOutButton}
                />
              </Card>
            ) : (
              <Card variant="glass" style={styles.authCard}>
                <Heading3 align="center" style={styles.authPrompt}>
                  Ready to start your athletic journey?
                </Heading3>
                <Button
                  title="Continue with Google"
                  icon="🔐"
                  onPress={handleGoogleSignIn}
                  loading={loading}
                  fullWidth
                  style={styles.googleButton}
                />
              </Card>
            )}

            {/* System Status Card */}
            <Card variant="default" style={styles.statusCard}>
              <Heading4 style={styles.statusTitle}>System Status</Heading4>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={theme.colors.primary[500]} />
                  <Body2 color="secondary" style={styles.loadingText}>
                    Checking connection...
                  </Body2>
                </View>
              ) : (
                <Body2 color="secondary" style={styles.statusText}>
                  {backendStatus}
                </Body2>
              )}
              <Button
                title="Refresh"
                variant="ghost"
                size="sm"
                onPress={checkBackendConnection}
                style={styles.refreshButton}
              />
            </Card>

            {/* Navigation Cards */}
            {user && (
              <View style={styles.navigationSection}>
                <Card variant="elevated" style={styles.navCard}>
                  <View style={styles.navCardContent}>
                    <View style={styles.navCardIcon}>
                      <Heading2>🏆</Heading2>
                    </View>
                    <Heading4 style={styles.navCardTitle}>Sports Assessment</Heading4>
                    <Body2 color="secondary" style={styles.navCardDescription}>
                      Take comprehensive sports assessments
                    </Body2>
                    <Button
                      title="Start Assessment"
                      onPress={() => handleNavigation('SportsGrid')}
                      fullWidth
                      style={styles.navCardButton}
                    />
                  </View>
                </Card>

                <Card variant="elevated" style={styles.navCard}>
                  <View style={styles.navCardContent}>
                    <View style={styles.navCardIcon}>
                      <Heading2>⚙️</Heading2>
                    </View>
                    <Heading4 style={styles.navCardTitle}>Profile Setup</Heading4>
                    <Body2 color="secondary" style={styles.navCardDescription}>
                      Complete your athlete profile
                    </Body2>
                    <Button
                      title="Setup Profile"
                      variant="secondary"
                      onPress={() => handleNavigation('ProfileSetup')}
                      fullWidth
                      style={styles.navCardButton}
                    />
                  </View>
                </Card>

                <Card variant="elevated" style={styles.navCard}>
                  <View style={styles.navCardContent}>
                    <View style={styles.navCardIcon}>
                      <Heading2>👤</Heading2>
                    </View>
                    <Heading4 style={styles.navCardTitle}>My Profile</Heading4>
                    <Body2 color="secondary" style={styles.navCardDescription}>
                      View and edit your profile
                    </Body2>
                    <Button
                      title="View Profile"
                      variant="outline"
                      onPress={() => handleNavigation('Profile')}
                      fullWidth
                      style={styles.navCardButton}
                    />
                  </View>
                </Card>
              </View>
            )}

            {/* Features Card */}
            <Card variant="default" style={styles.featuresCard}>
              <Heading3 style={styles.featuresTitle}>🚀 Platform Features</Heading3>
              <View style={styles.featuresList}>
                {[
                  '🏃‍♂️ Comprehensive Athlete Profiles',
                  '⚽ Multi-Sport Support',
                  '🎯 Personalized Training Goals',
                  '📈 Performance Analytics',
                  '👥 Coach & Team Management',
                  '🔒 Secure Data Protection',
                ].map((feature, index) => (
                  <Body2 key={index} color="secondary" style={styles.featureItem}>
                    {feature}
                  </Body2>
                ))}
              </View>
              <Button
                title="Learn More"
                variant="secondary"
                onPress={showApiDemo}
                fullWidth
                style={styles.learnMoreButton}
              />
            </Card>
          </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing[5],
    paddingTop: theme.spacing[10],
  },
  
  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
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
  
  // User Card
  userCard: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  welcomeText: {
    marginBottom: theme.spacing[1],
  },
  userEmail: {
    marginBottom: theme.spacing[4],
  },
  signOutButton: {
    marginTop: theme.spacing[2],
  },
  
  // Auth Card
  authCard: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  authPrompt: {
    marginBottom: theme.spacing[5],
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  
  // Status Card
  statusCard: {
    marginBottom: theme.spacing[6],
  },
  statusTitle: {
    marginBottom: theme.spacing[2],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  loadingText: {
    marginLeft: theme.spacing[2],
  },
  statusText: {
    marginBottom: theme.spacing[3],
  },
  refreshButton: {
    alignSelf: 'flex-start',
  },
  
  // Navigation Section
  navigationSection: {
    marginBottom: theme.spacing[6],
  },
  navCard: {
    marginBottom: theme.spacing[4],
  },
  navCardContent: {
    alignItems: 'center',
  },
  navCardIcon: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  navCardTitle: {
    marginBottom: theme.spacing[2],
  },
  navCardDescription: {
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },
  navCardButton: {
    marginTop: theme.spacing[2],
  },
  
  // Features Card
  featuresCard: {
    marginBottom: theme.spacing[6],
  },
  featuresTitle: {
    marginBottom: theme.spacing[4],
  },
  featuresList: {
    marginBottom: theme.spacing[5],
  },
  featureItem: {
    marginBottom: theme.spacing[2],
    lineHeight: 24,
  },
  learnMoreButton: {
    marginTop: theme.spacing[2],
  },
});

export default HomeScreen;