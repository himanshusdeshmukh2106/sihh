/**
 * SportsGridScreen - Redesigned
 * Clean and classy sports selection grid with modern design
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { SPORTS_DATA } from '../data/sportsData';
import { Card } from '../components/ui/Card';
import { Heading3, Heading4 } from '../components/ui/Typography';
import { theme } from '../styles/theme';

type SportsGridNavigationProp = StackNavigationProp<RootStackParamList, 'SportsGrid'>;

export const SportsGridScreen: React.FC = () => {
  const navigation = useNavigation<SportsGridNavigationProp>();

  const handleSportSelect = (sportId: string, sportName: string) => {
    if (sportId === 'pushups') {
      // Navigate directly to pushup assessment with default values
      navigation.navigate('PushupAssessment', {
        sportId: 'pushups',
        sportName: 'Pushup Assessment',
        experienceLevel: 2, // Default 2 years experience
        highestLevel: 'district' // Default district level
      });
    } else {
      navigation.navigate('SportDetail', { sportId, sportName });
    }
  };

  const renderSportCard = (sport: any) => (
    <TouchableOpacity
      key={sport.id}
      style={styles.sportCardContainer}
      onPress={() => handleSportSelect(sport.id, sport.name)}
      activeOpacity={0.8}
    >
      <Card variant="elevated" style={styles.sportCard}>
        <View style={styles.sportContent}>
          <View style={styles.sportIconContainer}>
            <Heading3>{sport.icon}</Heading3>
          </View>
          
          <Heading4 align="center" style={styles.sportName}>
            {sport.name}
          </Heading4>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sports Grid - All sports in one grid */}
        <View style={styles.sportsGrid}>
          {SPORTS_DATA.map(renderSportCard)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Same light blue as home page
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: theme.spacing[5],
    paddingTop: theme.spacing[8],
  },
  
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
  },
  
  // Sport Card Styles
  sportCardContainer: {
    width: '48%', // 2 cards per row with equal spacing
  },
  
  sportCard: {
    borderWidth: 1,
    borderColor: theme.colors.primary[100],
    minHeight: 120, // Ensure consistent card height
  },
  
  sportContent: {
    alignItems: 'center',
  },
  
  sportIconContainer: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  
  sportName: {
    marginBottom: theme.spacing[2],
    lineHeight: 18,
    fontSize: 14,
  },
});