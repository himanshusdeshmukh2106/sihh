/**
 * ExperienceSlider Component
 * Custom slider for experience level selection
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';

interface ExperienceSliderProps {
  value: number; // 1-20 (years)
  onValueChange: (value: number) => void;
  style?: any;
}

export const ExperienceSlider: React.FC<ExperienceSliderProps> = ({
  value,
  onValueChange,
  style,
}) => {
  const sliderWidth = 300;
  const trackRef = useRef<View>(null);

  const handleTap = (x: number) => {
    const percentage = Math.max(0, Math.min(100, (x / sliderWidth) * 100));
    const years = Math.round((percentage / 100) * 19) + 1; // Convert to 1-20 years
    onValueChange(years);
  };

  const getSliderPosition = () => {
    return ((value - 1) / 19) * 100; // Convert years to percentage
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      // Handle initial touch
      const x = evt.nativeEvent.locationX;
      handleTap(x);
    },
    onPanResponderMove: (evt) => {
      // Handle drag movement
      const x = evt.nativeEvent.locationX;
      handleTap(x);
    },
    onPanResponderRelease: () => {
      // Handle release
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Years of Experience</Text>
      
      {/* Current Value Display */}
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>
          {value} {value === 1 ? 'Year' : 'Years'}
        </Text>
      </View>

      {/* Slider Track */}
      <View style={styles.sliderContainer}>
        <View
          ref={trackRef}
          style={styles.track}
          {...panResponder.panHandlers}
        >
          {/* Track Background */}
          <View style={styles.trackBackground} />
          
          {/* Active Track */}
          <View style={[styles.activeTrack, { width: `${getSliderPosition()}%` }]} />
          
          {/* Thumb */}
          <View style={[styles.thumb, { left: `${getSliderPosition()}%` }]} />
        </View>
      </View>

      {/* Year Labels */}
      <View style={styles.labelsContainer}>
        <Text style={styles.labelText}>1</Text>
        <Text style={styles.labelText}>5</Text>
        <Text style={styles.labelText}>10</Text>
        <Text style={styles.labelText}>15</Text>
        <Text style={styles.labelText}>20</Text>
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
    color: '#3498DB',
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
    backgroundColor: '#3498DB',
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
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7F8C8D',
    textAlign: 'center',
  },
});