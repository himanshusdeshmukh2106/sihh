/**
 * PoseOverlay - Visual overlay showing detected body keypoints and skeleton
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Keypoint } from '../types';

interface PoseOverlayProps {
  keypoints: Keypoint[];
  frameWidth: number;
  frameHeight: number;
  showSkeleton?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const PoseOverlay: React.FC<PoseOverlayProps> = ({
  keypoints,
  frameWidth,
  frameHeight,
  showSkeleton = true
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (keypoints.length > 0) {
      // Subtle pulse animation for the skeleton
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [keypoints.length]);

  if (keypoints.length === 0) {
    return null;
  }

  // Scale keypoints to screen dimensions
  const scaleX = screenWidth / frameWidth;
  const scaleY = screenHeight / frameHeight;

  const scaledKeypoints = keypoints.map(kp => ({
    ...kp,
    x: kp.x * scaleX,
    y: kp.y * scaleY
  }));

  // Define complete skeleton connections for full body tracking
  const connections = [
    // Head and neck
    ['nose', 'left_eye'],
    ['nose', 'right_eye'],
    ['left_eye', 'left_ear'],
    ['right_eye', 'right_ear'],
    
    // Torso
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_hip'],
    ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    
    // Left arm
    ['left_shoulder', 'left_elbow'],
    ['left_elbow', 'left_wrist'],
    
    // Right arm
    ['right_shoulder', 'right_elbow'],
    ['right_elbow', 'right_wrist'],
    
    // Left leg
    ['left_hip', 'left_knee'],
    ['left_knee', 'left_ankle'],
    
    // Right leg
    ['right_hip', 'right_knee'],
    ['right_knee', 'right_ankle'],
    
    // Additional body connections
    ['left_shoulder', 'nose'],
    ['right_shoulder', 'nose'],
  ];

  const findKeypoint = (name: string) => {
    return scaledKeypoints.find(kp => kp.name === name);
  };

  const getKeypointColor = (confidence: number, keypointName: string) => {
    // All blue color scheme
    if (confidence > 0.8) return '#0066FF'; // Bright blue for high confidence
    if (confidence > 0.6) return '#3399FF'; // Medium blue for medium confidence
    return '#66CCFF'; // Light blue for low confidence
  };

  const renderKeypoints = () => {
    return scaledKeypoints.map((kp, index) => {
      if (kp.confidence < 0.3) return null; // Don't show very low confidence points
      
      return (
        <Circle
          key={`keypoint-${index}`}
          cx={kp.x}
          cy={kp.y}
          r={kp.name.includes('elbow') || kp.name.includes('shoulder') ? 10 : 7}
          fill={getKeypointColor(kp.confidence, kp.name)}
          stroke="#FFFFFF"
          strokeWidth={2}
          opacity={0.8}
        />
      );
    });
  };

  const renderSkeleton = () => {
    if (!showSkeleton) return null;

    return connections.map((connection, index) => {
      const [startName, endName] = connection;
      const startPoint = findKeypoint(startName);
      const endPoint = findKeypoint(endName);

      if (!startPoint || !endPoint || 
          startPoint.confidence < 0.5 || endPoint.confidence < 0.5) {
        return null;
      }

      // All blue color scheme with varying thickness
      let strokeColor = '#0066FF'; // Blue color for all connections
      let strokeWidth = 4;
      
      // Vary thickness based on body part importance
      if (connection.includes('shoulder') && connection.includes('elbow')) {
        strokeWidth = 6; // Thicker for upper arms (important for pushups)
      } else if (connection.includes('elbow') && connection.includes('wrist')) {
        strokeWidth = 5; // Medium for forearms
      } else if (connection.includes('hip') && connection.includes('knee')) {
        strokeWidth = 5; // Medium for thighs
      } else if (connection.includes('knee') && connection.includes('ankle')) {
        strokeWidth = 4; // Standard for shins
      } else if (connection.includes('shoulder') || connection.includes('hip')) {
        strokeWidth = 5; // Medium for torso
      }

      return (
        <Line
          key={`connection-${index}`}
          x1={startPoint.x}
          y1={startPoint.y}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeOpacity={0.8}
        />
      );
    });
  };

  // Highlight pushup-critical angles
  const renderAngleIndicators = () => {
    const leftShoulder = findKeypoint('left_shoulder');
    const leftElbow = findKeypoint('left_elbow');
    const leftWrist = findKeypoint('left_wrist');
    const rightShoulder = findKeypoint('right_shoulder');
    const rightElbow = findKeypoint('right_elbow');
    const rightWrist = findKeypoint('right_wrist');

    const indicators = [];

    // Left elbow angle indicator
    if (leftShoulder && leftElbow && leftWrist && 
        leftElbow.confidence > 0.6) {
      indicators.push(
        <Circle
          key="left-elbow-indicator"
          cx={leftElbow.x}
          cy={leftElbow.y}
          r={15}
          fill="none"
          stroke="#0066FF"
          strokeWidth={3}
          strokeOpacity={0.6}
        />
      );
    }

    // Right elbow angle indicator
    if (rightShoulder && rightElbow && rightWrist && 
        rightElbow.confidence > 0.6) {
      indicators.push(
        <Circle
          key="right-elbow-indicator"
          cx={rightElbow.x}
          cy={rightElbow.y}
          r={15}
          fill="none"
          stroke="#0066FF"
          strokeWidth={3}
          strokeOpacity={0.6}
        />
      );
    }

    return indicators;
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ scale: pulseAnim }] }
      ]} 
      pointerEvents="none"
    >
      <Svg width={screenWidth} height={screenHeight} style={styles.svg}>
        {renderSkeleton()}
        {renderKeypoints()}
        {renderAngleIndicators()}
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  svg: {
    flex: 1,
  },
});