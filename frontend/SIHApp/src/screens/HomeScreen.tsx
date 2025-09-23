/**
 * Home Screen Component
 * Main landing screen with navigation options
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { apiService } from '../services/api';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');

  useEffect(() => {
    checkBackendConnection();
  }, []);

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

  const handleNavigation = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen as any);
  };

  const showApiDemo = () => {
    Alert.alert(
      'API Integration',
      'This app demonstrates:\n\n• User Authentication\n• CRUD Operations\n• Real-time API calls\n• TypeScript integration\n• Modern React Native patterns',
      [{ text: 'Got it!' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to SIH App</Text>
        <Text style={styles.subtitle}>
          React Native + TypeScript + FastAPI Demo
        </Text>

        {/* Backend Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Backend Status</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6366f1" />
              <Text style={styles.statusText}>Checking connection...</Text>
            </View>
          ) : (
            <Text style={styles.statusText}>{backendStatus}</Text>
          )}
          <TouchableOpacity style={styles.refreshButton} onPress={checkBackendConnection}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => handleNavigation('Login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handleNavigation('Register')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handleNavigation('Items')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Browse Items
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handleNavigation('Users')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              View Users
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.infoButton]}
            onPress={showApiDemo}
          >
            <Text style={styles.buttonText}>API Demo Info</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          <Text style={styles.featureItem}>🚀 Latest React Native 0.76</Text>
          <Text style={styles.featureItem}>⚡ FastAPI 0.115+ Backend</Text>
          <Text style={styles.featureItem}>📱 TypeScript Support</Text>
          <Text style={styles.featureItem}>🔐 JWT Authentication</Text>
          <Text style={styles.featureItem}>📊 CRUD Operations</Text>
          <Text style={styles.featureItem}>🎨 Modern UI Components</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  refreshButton: {
    marginTop: 8,
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonsContainer: {
    marginBottom: 30,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#6366f1',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  infoButton: {
    backgroundColor: '#10b981',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#6366f1',
  },
  featuresContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 24,
  },
});

export default HomeScreen;