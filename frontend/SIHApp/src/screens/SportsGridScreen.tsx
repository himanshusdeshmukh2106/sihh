/**
 * SportsGridScreen - Redesigned
 * Clean and classy sports selection grid with modern design
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { SPORTS_DATA } from '../data/sportsData';
import { Card } from '../components/ui/Card';
import { Heading1, Heading2, Heading3, Body2, Caption } from '../components/ui/Typography';
import { theme } from '../styles/theme';

type SportsGridNavigationProp = StackNavigationProp<RootStackParamList, 'SportsGrid'>;

export const SportsGridScreen: React.FC = () => {
  const navigation = useNavigation<SportsGridNavigationProp>();

  const handleSportSelect = (sportId: string, sportName: string) => {
    navigation.navigate('SportDetail', { sportId, sportName });
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
            <Heading2>{sport.icon}</Heading2>
          </View>
          
          <Heading3 align="center" style={styles.sportName}>
            {sport.name}
          </Heading3>
          
          <Caption 
            color="secondary" 
            align="center" 
            style={styles.sportCategory}
          >
            {sport.category.toUpperCase()}
          </Caption>
          
          <View style={styles.popularityBadge}>
            <Caption color="inverse" style={styles.popularityText}>
              #{sport.popularityRank}
            </Caption>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const teamSports = SPORTS_DATA.filter(sport => sport.category === 'team');
  const individualSports = SPORTS_DATA.filter(sport => sport.category === 'individual');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary[600]} />
      
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <Heading1 color="inverse" align="center" style={styles.title}>
                🏆 Choose Your Sport
              </Heading1>
              <Body2 color="inverse" align="center" style={styles.subtitle}>
                Select a sport to start your comprehensive assessment
              </Body2>
            </View>

            {/* Team Sports Section */}
            <View style={styles.section}>
              <Card variant="glass" style={styles.sectionCard}>
                <Heading2 style={styles.sectionTitle}>⚽ Team Sports</Heading2>
                <Body2 color="secondary" style={styles.sectionDescription}>
                  Collaborative sports that build teamwork and communication
                </Body2>
              </Card>
              
              <View style={styles.sportsGrid}>
                {teamSports.map(renderSportCard)}
              </View>
            </View>

            {/* Individual Sports Section */}
            <View style={styles.section}>
              <Card variant="glass" style={styles.sectionCard}>
                <Heading2 style={styles.sectionTitle}>🏃‍♂️ Individual Sports</Heading2>
                <Body2 color="secondary" style={styles.sectionDescription}>
                  Personal excellence and self-improvement focused activities
                </Body2>
              </Card>
              
              <View style={styles.sportsGrid}>
                {individualSports.map(renderSportCard)}
              </View>
            </View>
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
  
  background: {
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
    paddingTop: theme.spacing[8],
  },
  
  // Header Section
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  
  title: {
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: theme.spacing[2],
  },
  
  subtitle: {
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Section Styles
  section: {
    marginBottom: theme.spacing[8],
  },
  
  sectionCard: {
    marginBottom: theme.spacing[5],
    alignItems: 'center',
  },
  
  sectionTitle: {
    marginBottom: theme.spacing[2],
  },
  
  sectionDescription: {
    textAlign: 'center',
  },
  
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing[4],
  },
  
  // Sport Card Styles
  sportCardContainer: {
    width: '48%',
  },
  
  sportCard: {
    position: 'relative',
    borderWidth: 1,
    borderColor: theme.colors.primary[100],
  },
  
  sportContent: {
    alignItems: 'center',
  },
  
  sportIconContainer: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  
  sportName: {
    marginBottom: theme.spacing[1],
    lineHeight: 22,
  },
  
  sportCategory: {
    letterSpacing: 0.8,
    fontWeight: '600' as const,
  },
  
  popularityBadge: {
    position: 'absolute',
    top: -theme.spacing[2],
    right: -theme.spacing[2],
    backgroundColor: theme.colors.error[500],
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    minWidth: 28,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  
  popularityText: {
    fontWeight: '700' as const,
  },
});