/**
 * Button Component - Clean and Classy Design
 * Consistent button styling across the app
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';
import { theme } from '../../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'base' | 'lg';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'base',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
    fullWidth = false,
}) => {
    const getSizeStyle = (size: ButtonSize) => {
        switch (size) {
            case 'sm': return styles.sm;
            case 'base': return styles.baseSize;
            case 'lg': return styles.lg;
            default: return styles.baseSize;
        }
    };

    const getTextSizeStyle = (size: ButtonSize) => {
        switch (size) {
            case 'sm': return styles.smText;
            case 'base': return styles.baseSizeText;
            case 'lg': return styles.lgText;
            default: return styles.baseSizeText;
        }
    };

    const buttonStyles = [
        styles.base,
        styles[variant],
        getSizeStyle(size),
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text`],
        getTextSizeStyle(size),
        textStyle,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' ? theme.colors.surface.primary : theme.colors.primary[500]}
                />
            ) : (
                <>
                    {icon && <Text style={styles.icon}>{icon}</Text>}
                    <Text style={textStyles}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.sm,
    },

    // Variants
    primary: {
        backgroundColor: theme.colors.primary[500],
    },
    secondary: {
        backgroundColor: theme.colors.secondary[500],
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primary[500],
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    danger: {
        backgroundColor: theme.colors.error[500],
    },

    // Sizes
    sm: {
        height: theme.components.button.height.sm,
        paddingHorizontal: theme.components.button.paddingHorizontal.sm,
    },
    baseSize: {
        height: theme.components.button.height.base,
        paddingHorizontal: theme.components.button.paddingHorizontal.base,
    },
    lg: {
        height: theme.components.button.height.lg,
        paddingHorizontal: theme.components.button.paddingHorizontal.lg,
    },

    // States
    disabled: {
        opacity: 0.5,
    },
    fullWidth: {
        width: '100%',
    },

    // Text styles
    text: {
        fontWeight: '600' as const,
        textAlign: 'center',
    },

    // Text variants
    primaryText: {
        color: theme.colors.text.inverse,
    },
    secondaryText: {
        color: theme.colors.text.inverse,
    },
    outlineText: {
        color: theme.colors.primary[500],
    },
    ghostText: {
        color: theme.colors.primary[500],
    },
    dangerText: {
        color: theme.colors.text.inverse,
    },

    // Text sizes
    smText: {
        fontSize: theme.typography.fontSize.sm,
    },
    baseSizeText: {
        fontSize: theme.typography.fontSize.base,
    },
    lgText: {
        fontSize: theme.typography.fontSize.lg,
    },

    icon: {
        marginRight: theme.spacing[2],
        fontSize: theme.typography.fontSize.base,
    },
});