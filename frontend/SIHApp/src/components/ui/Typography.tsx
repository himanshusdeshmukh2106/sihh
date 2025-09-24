/**
 * Typography Components - Clean and Classy Design
 * Consistent text styling across the app
 */

import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { theme } from '../../styles/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'muted';
type TextAlign = 'left' | 'center' | 'right';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  style?: TextStyle;
  numberOfLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  style,
  numberOfLines,
}) => {
  const textStyles = [
    styles.base,
    styles[variant],
    styles[`${color}Color`],
    { textAlign: align },
    style,
  ];

  return (
    <Text style={textStyles} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

// Convenience components
export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Body1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body1" {...props} />
);

export const Body2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body2" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.typography.fontFamily.regular,
  },
  
  // Variants
  h1: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: '700' as const,
    lineHeight: theme.typography.fontSize['4xl'] * theme.typography.lineHeight.tight,
  },
  h2: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '700' as const,
    lineHeight: theme.typography.fontSize['3xl'] * theme.typography.lineHeight.tight,
  },
  h3: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '600' as const,
    lineHeight: theme.typography.fontSize['2xl'] * theme.typography.lineHeight.tight,
  },
  h4: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600' as const,
    lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.normal,
  },
  body1: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '400' as const,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
  },
  body2: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '400' as const,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  },
  caption: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '400' as const,
    lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.normal,
  },
  overline: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.normal,
  },
  
  // Colors
  primaryColor: {
    color: theme.colors.text.primary,
  },
  secondaryColor: {
    color: theme.colors.text.secondary,
  },
  tertiaryColor: {
    color: theme.colors.text.tertiary,
  },
  inverseColor: {
    color: theme.colors.text.inverse,
  },
  mutedColor: {
    color: theme.colors.text.muted,
  },
});