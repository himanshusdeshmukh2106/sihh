/**
 * StepProgress Component
 * Clean progress indicator for multi-step profile setup
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ProfileSetupStep } from '../types';

interface StepProgressProps {
  steps: ProfileSetupStep[];
  style?: ViewStyle;
}

export const StepProgress: React.FC<StepProgressProps> = ({ steps, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <View style={styles.stepWrapper}>
              <View style={[
                styles.stepCircle,
                step.isCompleted && styles.stepCompleted,
                step.isActive && styles.stepActive,
              ]}>
                {step.isCompleted ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text style={[
                    styles.stepNumber,
                    step.isActive && styles.stepNumberActive,
                  ]}>
                    {step.id}
                  </Text>
                )}
              </View>
              <Text style={[
                styles.stepTitle,
                step.isActive && styles.stepTitleActive,
                step.isCompleted && styles.stepTitleCompleted,
              ]}>
                {step.title}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.connector,
                step.isCompleted && styles.connectorCompleted,
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#BDC3C7',
  },
  stepActive: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
  },
  stepCompleted: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7F8C8D',
  },
  stepNumberActive: {
    color: 'white',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  stepTitleActive: {
    color: '#3498DB',
    fontWeight: '600',
  },
  stepTitleCompleted: {
    color: '#27AE60',
    fontWeight: '600',
  },
  connector: {
    height: 2,
    backgroundColor: '#BDC3C7',
    flex: 0.5,
    marginHorizontal: 5,
  },
  connectorCompleted: {
    backgroundColor: '#27AE60',
  },
});