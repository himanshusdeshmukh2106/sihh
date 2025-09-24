/**
 * SportDetailScreen - Individual Sport Assessment Setup
 * Experience slider and highest level dropdown with start assessment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { ExperienceSlider } from '../components/ExperienceSlider';
import { PickerInput } from '../components/CustomInput';
import { HIGHEST_LEVEL_PLAYED, SPORTS_DATA } from '../data/sportsData';

type SportDetailNavigationProp = StackNavigationProp<RootStackParamList, 'SportDetail'>;
type SportDetailRouteProp = RouteProp<RootStackParamList, 'SportDetail'>;

export const SportDetailScreen: React.FC = () => {
  const navigation = useNavigation<SportDetailNavigationProp>();
  const route = useRoute<SportDetailRouteProp>();
  const { sportId, sportName } = route.params;

  const [experienceLevel, setExperienceLevel] = useState(25); // 0-100
  const [highestLevel, setHighestLevel] = useState('recreational');

  const sport = SPORTS_DATA.find(s => s.id === sportId);

  const handleStartAssessment = () => {
    // TODO: Navigate to assessment screen or save data
    const assessmentData = {
      sport: sportId,
      experienceLevel,
      highestLevel,
    };
    
    console.log('Starting assessment with data:', assessmentData);
    
    Alert.alert(
      '🚀 Assessment Starting!',
      `Ready to begin your ${sportName} assessment?\n\nExperience: ${getExperienceLabel()}\nHighest Level: ${getHighestLevelLabel()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Assessment',
          onPress: () => {
            // Navigate to assessment or placeholder
            Alert.alert('Success!', 'Assessment module will be implemented next!');
          },
        },
      ]
    );
  };

  const getExperienceLabel = () => {
    if (experienceLevel <= 25) return 'Beginner';
    if (experienceLevel <= 50) return 'Intermediate';
    if (experienceLevel <= 75) return 'Advanced';
    return 'Expert';
  };

  const getHighestLevelLabel = () => {
    return HIGHEST_LEVEL_PLAYED.find(level => level.value === highestLevel)?.label || 'Recreational';
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.sportIconContainer}>
              <Text style={styles.sportIcon}>{sport?.icon || '⚽'}</Text>
            </View>
            <Text style={styles.title}>{sportName}</Text>
            <Text style={styles.subtitle}>Set up your assessment parameters</Text>
          </View>

          {/* Content Card */}
          <View style={styles.contentCard}>
            {/* Sport Info */}
            <View style={styles.sportInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Category:</Text>
                <Text style={styles.infoValue}>{sport?.category.toUpperCase()}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Popularity Rank:</Text>
                <Text style={styles.infoValue}>#{sport?.popularityRank}</Text>
              </View>
              <Text style={styles.description}>{sport?.description}</Text>
            </View>

            {/* Experience Slider */}
            <View style={styles.section}>
              <ExperienceSlider
                value={experienceLevel}
                onValueChange={setExperienceLevel}
              />
            </View>

            {/* Highest Level Dropdown */}
            <View style={styles.section}>
              <PickerInput
                label="Highest Level Played"
                value={highestLevel}
                options={HIGHEST_LEVEL_PLAYED}
                onSelect={setHighestLevel}
                icon="🏆"
                placeholder="Select your highest level"
              />
            </View>

            {/* Assessment Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Assessment Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sport:</Text>
                <Text style={styles.summaryValue}>{sportName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Experience:</Text>
                <Text style={styles.summaryValue}>{getExperienceLabel()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Highest Level:</Text>
                <Text style={styles.summaryValue}>{getHighestLevelLabel()}</Text>
              </View>
            </View>

            {/* Start Assessment Button */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartAssessment}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>🚀 Start Assessment</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  sportIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  sportIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  sportInfo: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#34495E',
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  summaryContainer: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.2)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#3498DB',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#27AE60',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#27AE60',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});