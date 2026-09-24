import React, { useRef } from 'react';
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
  Pressable,
} from 'react-native';
import { useTheme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) => {
  const { theme, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start();
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 14, borderRadius: theme.radius.sm };
      case 'lg':
        return { paddingVertical: 18, paddingHorizontal: 32, borderRadius: theme.radius.lg };
      case 'md':
      default:
        return { paddingVertical: 13, paddingHorizontal: 22, borderRadius: theme.radius.md };
    }
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case 'sm':
        return { fontSize: 11, letterSpacing: 0.8 };
      case 'lg':
        return { fontSize: 15, letterSpacing: 1.2 };
      case 'md':
      default:
        return { fontSize: 13, letterSpacing: 1 };
    }
  };

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return disabled
          ? {
              backgroundColor: isDark ? 'rgba(0, 211, 243, 0.12)' : 'rgba(8, 145, 178, 0.12)',
              borderColor: 'transparent',
              borderWidth: 1,
            }
          : {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
              borderWidth: 1,
            };
      case 'secondary':
        return {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.danger,
          borderColor: theme.colors.danger,
          borderWidth: 1,
        };
      case 'dark':
        return {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : theme.colors.surfaceElevated,
          borderColor: isDark ? 'rgba(0, 211, 243, 0.35)' : theme.colors.borderActive,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return disabled ? theme.colors.primary : theme.colors.onPrimary;
      case 'secondary':
        return theme.colors.textPrimary;
      case 'danger':
        return '#FFFFFF';
      case 'dark':
        return theme.colors.primary;
      default:
        return theme.colors.onPrimary;
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        style={[styles.base, getSizeStyle(), getContainerStyle()]}>
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <Text style={[styles.text, getTextSizeStyle(), { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '800',
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
});
