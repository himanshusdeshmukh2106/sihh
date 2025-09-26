/**
 * AssessmentResultsScreen - Display assessment completion results
 * Shows total pushup count, session duration, and performance summary
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Card } from '../components/ui/Card';
import { AssessmentDataService } from '../services/AssessmentDataService';
import { ErrorHandlingService } from '../services/ErrorHandlingService';
import { theme } from '../styles/theme';

type AssessmentResultsNavigationProp = StackNavigationProp<RootStackParamList, 'AssessmentResults'>;
type AssessmentResultsRouteProp = RouteProp<RootStackParamList, 'AssessmentResults'>;

const { width } = Dimensions.get('window');

export const AssessmentResultsScreen: React.FC = () => {
  const navigation = useNavigation<AssessmentResultsNavigationProp>();
  const route = useRoute<AssessmentResultsRouteProp>();
  const { totalPushups, duration, assessmentData } = route.params;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceLevel = (pushups: number): { level: string; color: string; emoji: string } => {
    if (pushups >= 20) return { level: 'Excellent', color: '#27AE60', emoji: '🏆' };
    if (pushups >= 15) return { level: 'Great', color: '#2ECC71', emoji: '🥇' };
    if (pushups >= 10) return { level: 'Good', color: '#F39C12', emoji: '🥈' };
    if (pushups >= 5) return { level: 'Fair', color: '#E67E22', emoji: '🥉' };
    return { level: 'Keep Trying', color: '#E74C3C', emoji: '💪' };
  };

  const calculateCalories = (pushups: number): number => {
    return Math.round(pushups * 0.32 * 100) / 100;
  };

  const performance = getPerformanceLevel(totalPushups);
  const caloriesBurned = calculateCalories(totalPushups);

  const handleSaveResults = async () => {
    try {
      // Save assessment data using the data service
      await AssessmentDataService.saveAssessment(assessmentData);
      
      console.log('Assessment results saved successfully:', assessmentData);
      
      // Navigate back to sports grid
      navigation.navigate('SportsGrid');
    } catch (error) {
      ErrorHandlingService.handleDataStorageError(
        error as Error,
        {
          enableRetry: true,
          fallbackAction: () => {
            // Navigate back even if save failed
            navigation.navigate('SportsGrid');
          },
          customMessage: 'Your assessment results could not be saved, but you can still continue using the app.'
        }
      );
    }
  };

  const handleRetakeAssessment = () => {
    // Navigate back to pushup assessment with same parameters
    navigation.navigate('PushupAssessment', {
      sportId: assessmentData.sportId,
      sportName: 'Pushup Assessment', // TODO: Get sport name from data
      experienceLevel: assessmentData.experienceLevel,
      highestLevel: assessmentData.highestLevel
    });
  };

  const renderMainResults = () => (
    <Animated.View 
      style={[
        styles.mainResultsContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Card variant="elevated" style={[styles.mainResultsCard, { borderColor: performance.color }]}>
        <View style={styles.performanceHeader}>
          <Text style={styles.performanceEmoji}>{performance.emoji}</Text>
          <Text style={[styles.performanceLevel, { color: performance.color }]}>
            {performance.level}
          </Text>
        </View>
        
        <View style={styles.mainStatsContainer}>
          <View style={styles.mainStat}>
            <Text style={styles.mainStatValue}>{totalPushups}</Text>
            <Text style={styles.mainStatLabel}>Pushups</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.mainStat}>
            <Text style={styles.mainStatValue}>{formatDuration(duration)}</Text>
            <Text style={styles.mainStatLabel}>Duration</Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  const renderDetailedStats = () => (
    <Animated.View 
      style={[
        styles.detailedStatsContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Text style={styles.sectionTitle}>Session Details</Text>
      
      <View style={styles.statsGrid}>
        <Card variant="outlined" style={styles.statCard}>
          <Text style={styles.statCardValue}>{caloriesBurned}</Text>
          <Text style={styles.statCardLabel}>Calories Burned</Text>
        </Card>
        
        <Card variant="outlined" style={styles.statCard}>
          <Text style={styles.statCardValue}>
            {duration > 0 ? Math.round((totalPushups / duration) * 60) : 0}
          </Text>
          <Text style={styles.statCardLabel}>Pushups/Min</Text>
        </Card>
        
        <Card variant="outlined" style={styles.statCard}>
          <Text style={styles.statCardValue}>
            {assessmentData.experienceLevel}
          </Text>
          <Text style={styles.statCardLabel}>Experience (Years)</Text>
        </Card>
        
        <Card variant="outlined" style={styles.statCard}>
          <Text style={styles.statCardValue}>
            {assessmentData.highestLevel.charAt(0).toUpperCase() + assessmentData.highestLevel.slice(1)}
          </Text>
          <Text style={styles.statCardLabel}>Level</Text>
        </Card>
      </View>
    </Animated.View>
  );

  const renderMotivationalMessage = () => {
    let message = '';
    if (totalPushups >= 20) {
      message = "Outstanding performance! You're in excellent shape! 💪";
    } else if (totalPushups >= 15) {
      message = "Great job! You're showing real strength and endurance! 🔥";
    } else if (totalPushups >= 10) {
      message = "Good work! Keep training to reach the next level! 📈";
    } else if (totalPushups >= 5) {
      message = "Nice effort! Consistency is key to improvement! 🎯";
    } else {
      message = "Every journey starts with a single step. Keep going! 🌟";
    }

    return (
      <Animated.View 
        style={[
          styles.motivationContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Card variant="outlined" style={styles.motivationCard}>
          <Text style={styles.motivationText}>{message}</Text>
        </Card>
      </Animated.View>
    );
  };

  const renderActionButtons = () => (
    <Animated.View 
      style={[
        styles.actionButtonsContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <TouchableOpacity
        style={[styles.actionButton, styles.retakeButton]}
        onPress={handleRetakeAssessment}
        activeOpacity={0.8}
      >
        <Text style={styles.retakeButtonText}>🔄 Try Again</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.actionButton, styles.saveButton]}
        onPress={handleSaveResults}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>✅ Save & Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Assessment Complete!</Text>
          <Text style={styles.subtitle}>Here's how you performed</Text>
        </View>

        {renderMainResults()}
        {renderDetailedStats()}
        {renderMotivationalMessage()}
        {renderActionButtons()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: theme.spacing[5],
    paddingTop: theme.spacing[8],
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 18,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  
  // Main Results
  mainResultsContainer: {
    marginBottom: theme.spacing[6],
  },
  
  mainResultsCard: {
    borderWidth: 3,
    padding: theme.spacing[6],
  },
  
  performanceHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  
  performanceEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing[2],
  },
  
  performanceLevel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  mainStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  mainStat: {
    alignItems: 'center',
    flex: 1,
  },
  
  mainStatValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: theme.spacing[1],
  },
  
  mainStatLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E8E8E8',
    marginHorizontal: theme.spacing[4],
  },
  
  // Detailed Stats
  detailedStatsContainer: {
    marginBottom: theme.spacing[6],
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: theme.spacing[4],
    textAlign: 'center',
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
  },
  
  statCard: {
    width: '48%',
    padding: theme.spacing[4],
    alignItems: 'center',
  },
  
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498DB',
    marginBottom: theme.spacing[1],
  },
  
  statCardLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Motivational Message
  motivationContainer: {
    marginBottom: theme.spacing[6],
  },
  
  motivationCard: {
    padding: theme.spacing[5],
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  
  motivationText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  
  // Action Buttons
  actionButtonsContainer: {
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  
  actionButton: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  
  retakeButton: {
    backgroundColor: '#F39C12',
  },
  
  retakeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  saveButton: {
    backgroundColor: '#27AE60',
  },
  
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});