/**
 * CustomInput Component - Redesigned
 * Clean and classy input field using the new design system
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import { Input } from './ui/Input';

interface CustomInputProps {
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
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = (props) => {
  return <Input {...props} />;
};

import { Picker } from './ui/Picker';

interface PickerInputProps {
  label: string;
  value: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  error?: string;
  helperText?: string;
  icon?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export const PickerInput: React.FC<PickerInputProps> = (props) => {
  return <Picker {...props} />;
};

// Removed old styles - now using the new Input component