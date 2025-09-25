/**
 * Home Screen Component - Redesigned
 * Clean and classy main landing screen with modern design
 */

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Heading1, Heading2, Heading3, Heading4, Body1, Body2 } from '../components/ui/Typography';
import { theme } from '../styles/theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, session, loading, signInWithGoogle, signOut } = useAuth();

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



  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Heading1 align="center" style={styles.heroTitle}>
                🏆 Sports Assessment Platform
              </Heading1>
              <Body1 color="secondary" align="center" style={styles.heroSubtitle}>
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


              </View>
            )}


          </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Very light blue tint (Alice Blue)
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
    marginBottom: theme.spacing[2],
  },
  heroSubtitle: {
    // Removed text shadow styles
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
  

});

export default HomeScreen;