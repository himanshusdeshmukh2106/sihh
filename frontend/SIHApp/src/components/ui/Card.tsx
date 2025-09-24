/**
 * Card Component - Clean and Classy Design
 * Consistent card styling with glass morphism effect
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { theme } from '../../styles/theme';

type CardVariant = 'default' | 'glass' | 'elevated' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  padding?: keyof typeof theme.spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  padding = 5,
}) => {
  const cardStyles = [
    styles.base,
    styles[variant],
    { padding: theme.spacing[padding] },
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.lg,
  },
  
  default: {
    backgroundColor: theme.colors.surface.primary,
    ...theme.shadows.base,
  },
  
  glass: {
    backgroundColor: theme.colors.surface.glass,
    ...theme.shadows.md,
  },
  
  elevated: {
    backgroundColor: theme.colors.surface.primary,
    ...theme.shadows.lg,
  },
  
  outlined: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    ...theme.shadows.sm,
  },
});