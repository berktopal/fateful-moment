import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/Colors';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return disabled
          ? { backgroundColor: COLORS.border }
          : { backgroundColor: COLORS.primary };
      case 'secondary':
        return { backgroundColor: COLORS.secondary, borderColor: COLORS.border, borderWidth: 1 };
      case 'danger':
        return { backgroundColor: COLORS.accent };
      default:
        return { backgroundColor: COLORS.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return disabled ? { color: COLORS.textMuted } : { color: COLORS.background };
      case 'secondary':
        return { color: COLORS.text };
      case 'danger':
        return { color: COLORS.text };
      default:
        return { color: COLORS.background };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={getTextStyle().color} />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
