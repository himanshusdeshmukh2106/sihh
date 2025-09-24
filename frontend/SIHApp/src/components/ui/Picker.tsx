/**
 * Picker Component - Clean and Classy Design
 * Dropdown picker with modern styling
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Modal,
  FlatList,
} from 'react-native';
import { theme } from '../../styles/theme';

interface PickerOption {
  label: string;
  value: string;
}

interface PickerProps {
  label: string;
  value: string;
  placeholder?: string;
  options: PickerOption[];
  onSelect: (value: string) => void;
  error?: string;
  helperText?: string;
  icon?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export const Picker: React.FC<PickerProps> = ({
  label,
  value,
  placeholder,
  options,
  onSelect,
  error,
  helperText,
  icon,
  required = false,
  containerStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setIsOpen(false);
  };

  const renderOption = ({ item }: { item: PickerOption }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        value === item.value && styles.optionSelected,
      ]}
      onPress={() => handleSelect(item.value)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.optionText,
        value === item.value && styles.optionTextSelected,
      ]}>
        {item.label}
      </Text>
      {value === item.value && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {icon && <Text style={styles.labelIcon}>{icon} </Text>}
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.pickerContainer,
          error && styles.pickerContainerError,
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.pickerText,
          !selectedOption && styles.placeholderText,
        ]}>
          {selectedOption ? selectedOption.label : placeholder || `Select ${label.toLowerCase()}`}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[5],
  },
  
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '500' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  
  labelIcon: {
    fontSize: theme.typography.fontSize.sm,
  },
  
  required: {
    color: theme.colors.error[500],
    fontWeight: '700' as const,
  },
  
  pickerContainer: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.neutral[200],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  
  pickerContainerError: {
    borderColor: theme.colors.error[500],
  },
  
  pickerText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    flex: 1,
  },
  
  placeholderText: {
    color: theme.colors.text.muted,
  },
  
  dropdownIcon: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    marginLeft: theme.spacing[2],
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
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[5],
  },
  
  modalContent: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxHeight: '70%',
    ...theme.shadows.xl,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeButtonText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  
  optionsList: {
    maxHeight: 300,
  },
  
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  },
  
  optionSelected: {
    backgroundColor: theme.colors.primary[50],
  },
  
  optionText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    flex: 1,
  },
  
  optionTextSelected: {
    color: theme.colors.primary[600],
    fontWeight: '500' as const,
  },
  
  checkmark: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary[600],
    fontWeight: '700' as const,
  },
});