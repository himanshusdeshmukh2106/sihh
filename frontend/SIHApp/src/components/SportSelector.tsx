/**
 * SportSelector Component - Redesigned
 * Clean and classy sports selection with modern design
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Sport } from '../types';
import { SPORTS_DATA } from '../data/sportsData';
import { Card } from './ui/Card';
import { Heading3, Heading4, Body2 } from './ui/Typography';
import { theme } from '../styles/theme';

interface SportSelectorProps {
  selectedSports: string[];
  onSportSelect: (sportId: string) => void;
  multiSelect?: boolean;
  title?: string;
  style?: ViewStyle;
}

export const SportSelector: React.FC<SportSelectorProps> = ({
  selectedSports,
  onSportSelect,
  multiSelect = false,
  title = 'Select Sports',
  style,
}) => {
  const teamSports = SPORTS_DATA.filter(sport => sport.category === 'team');
  const individualSports = SPORTS_DATA.filter(sport => sport.category === 'individual');

  const renderSportItem = (sport: Sport) => {
    const isSelected = selectedSports.includes(sport.id);
    
    const handleSportPress = () => {
      if (multiSelect) {
        onSportSelect(sport.id);
      } else {
        // For single select, always call with the sport ID
        // The parent component will handle toggle logic
        onSportSelect(sport.id);
      }
    };
    
    return (
      <TouchableOpacity
        key={sport.id}
        style={styles.sportItemContainer}
        onPress={handleSportPress}
        activeOpacity={0.8}
      >
        <Card 
          variant={isSelected ? 'elevated' : 'default'}
          style={isSelected ? {...styles.sportCard, ...styles.sportCardSelected} : styles.sportCard}
        >
          <View style={styles.sportContent}>
            <View style={isSelected ? {...styles.sportIconContainer, ...styles.sportIconContainerSelected} : styles.sportIconContainer}>
              <Heading3>{sport.icon}</Heading3>
            </View>
            
            <Heading4 
              align="center" 
              style={isSelected ? {...styles.sportName, ...styles.sportNameSelected} : styles.sportName}
            >
              {sport.name}
            </Heading4>
            
            <Body2 
              color="secondary" 
              align="center"
              style={styles.sportCategory}
            >
              {sport.category.toUpperCase()}
            </Body2>
            
            {isSelected && (
              <View style={styles.checkmark}>
                <Heading4 color="inverse">✓</Heading4>
              </View>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderSportCategory = (categoryTitle: string, sports: Sport[]) => (
    <View style={styles.categoryContainer}>
      <Heading3 style={styles.categoryTitle}>{categoryTitle}</Heading3>
      <View style={styles.sportsGrid}>
        {sports.map(renderSportItem)}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <Heading3 align="center" style={styles.title}>{title}</Heading3>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        nestedScrollEnabled={true}
      >
        {renderSportCategory('⚽ Team Sports', teamSports)}
        {renderSportCategory('🏃‍♂️ Individual Sports', individualSports)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  title: {
    marginBottom: theme.spacing[6],
  },
  
  scrollContainer: {
    flex: 1,
  },
  
  categoryContainer: {
    marginBottom: theme.spacing[8],
  },
  
  categoryTitle: {
    marginBottom: theme.spacing[4],
    paddingLeft: theme.spacing[1],
  },
  
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
  },
  
  sportItemContainer: {
    width: '48%',
  },
  
  sportCard: {
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  sportCardSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  
  sportContent: {
    alignItems: 'center',
  },
  
  sportIconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  
  sportIconContainerSelected: {
    backgroundColor: theme.colors.primary[100],
  },
  
  sportName: {
    marginBottom: theme.spacing[1],
    lineHeight: 20,
  },
  
  sportNameSelected: {
    color: theme.colors.primary[600],
  },
  
  sportCategory: {
    fontSize: theme.typography.fontSize.xs,
    letterSpacing: 0.5,
  },
  
  checkmark: {
    position: 'absolute',
    top: -theme.spacing[2],
    right: -theme.spacing[2],
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
});