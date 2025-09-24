/**
 * Input Component - Clean and Classy Design
 * Enhanced input field with better UX
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  Animated,
} from 'react-native';
import { theme } from '../../styles/theme';

interface InputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  icon?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputType?: 'text' | 'email' | 'phone' | 'number' | 'password' | 'date';
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  icon,
  required = false,
  containerStyle,
  inputType = 'text',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: theme.animation.fast,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animatedValue]);

  const getKeyboardType = () => {
    switch (inputType) {
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  const labelStyle = {
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.typography.fontSize.base, theme.typography.fontSize.sm],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.text.tertiary, isFocused ? theme.colors.primary[500] : theme.colors.text.secondary],
    }),
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
      ]}>
        <Animated.Text style={[styles.label, labelStyle]}>
          {icon && <Text style={styles.labelIcon}>{icon} </Text>}
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Animated.Text>
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor={theme.colors.text.muted}
          keyboardType={getKeyboardType()}
          secureTextEntry={inputType === 'password'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[5],
  },
  
  inputContainer: {
    position: 'relative',
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.neutral[200],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[2],
    ...theme.shadows.sm,
  },
  
  inputContainerFocused: {
    borderColor: theme.colors.primary[500],
    ...theme.shadows.base,
  },
  
  inputContainerError: {
    borderColor: theme.colors.error[500],
  },
  
  label: {
    position: 'absolute',
    left: theme.spacing[4],
    backgroundColor: theme.colors.surface.primary,
    paddingHorizontal: theme.spacing[1],
    fontWeight: '500' as const,
  },
  
  labelIcon: {
    fontSize: theme.typography.fontSize.sm,
  },
  
  required: {
    color: theme.colors.error[500],
    fontWeight: '700' as const,
  },
  
  input: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    paddingTop: theme.spacing[2],
    paddingBottom: 0,
    minHeight: 20,
  },
  
  helperText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[1],
    marginLeft: theme.spacing[1],
  },
  
  errorText: {
    color: theme.colors.error[500],
  },
});