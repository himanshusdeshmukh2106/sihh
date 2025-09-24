/**
 * ExperienceSlider Component
 * Custom slider for experience level selection
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface ExperienceSliderProps {
  value: number; // 0-100
  onValueChange: (value: number) => void;
  style?: any;
}

const EXPERIENCE_LABELS = [
  { value: 0, label: 'Beginner', color: '#E74C3C' },
  { value: 25, label: 'Amateur', color: '#F39C12' },
  { value: 50, label: 'Intermediate', color: '#F1C40F' },
  { value: 75, label: 'Advanced', color: '#3498DB' },
  { value: 100, label: 'Expert', color: '#27AE60' },
];

export const ExperienceSlider: React.FC<ExperienceSliderProps> = ({
  value,
  onValueChange,
  style,
}) => {
  const handleTap = (x: number, width: number) => {
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    const snappedValue = Math.round(percentage / 25) * 25;
    onValueChange(snappedValue);
  };

  const getCurrentLabel = () => {
    return EXPERIENCE_LABELS.find(item => item.value === value) || EXPERIENCE_LABELS[0];
  };

  const currentLabel = getCurrentLabel();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Experience Level</Text>
      
      {/* Current Value Display */}
      <View style={styles.valueContainer}>
        <Text style={[styles.valueText, { color: currentLabel.color }]}>
          {currentLabel.label}
        </Text>
      </View>

      {/* Slider Track */}
      <View style={styles.sliderContainer}>
        <TouchableOpacity
          style={styles.track}
          activeOpacity={1}
          onPress={(event) => {
            const { locationX } = event.nativeEvent;
            handleTap(locationX, 300); // Assuming track width is 300
          }}
        >
          {/* Track Background */}
          <View style={styles.trackBackground} />
          
          {/* Active Track */}
          <View style={[styles.activeTrack, { width: `${value}%` }]} />
          
          {/* Thumb */}
          <View style={[styles.thumb, { left: `${value}%`, backgroundColor: currentLabel.color }]} />
        </TouchableOpacity>
      </View>

      {/* Labels */}
      <View style={styles.labelsContainer}>
        {EXPERIENCE_LABELS.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={styles.labelItem}
            onPress={() => onValueChange(item.value)}
          >
            <View style={[
              styles.labelDot,
              { backgroundColor: value === item.value ? item.color : '#BDC3C7' }
            ]} />
            <Text style={[
              styles.labelText,
              { color: value === item.value ? item.color : '#7F8C8D' }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sliderContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  track: {
    width: 300,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  trackBackground: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
  },
  activeTrack: {
    position: 'absolute',
    height: 6,
    backgroundColor: '#3498DB',
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -12,
    marginTop: -9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  labelItem: {
    alignItems: 'center',
    flex: 1,
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});