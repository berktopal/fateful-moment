import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/Theme';

type OptionCardProps = {
  text: string;
  state?: 'default' | 'active' | 'passive';
  onPress?: () => void;
  style?: ViewStyle;
};

export const OptionCard = ({ text, state = 'default', onPress, style }: OptionCardProps) => {
  const getGradientColors = (): [string, string, ...string[]] => {
    switch (state) {
      case 'active':
        return ['#4B8B9B', '#1FB2C4', '#4B8B9B']; // Cyan gradient
      case 'passive':
        return ['#A1B5B8', '#D1E5E8', '#A1B5B8']; // Light grey/cyan gradient
      default:
        return ['#475161', '#475161']; // Solid dark grey
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={state === 'passive'} activeOpacity={0.8}>
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.container, style]}
      >
        <Text style={[
          styles.text, 
          state === 'passive' && styles.textPassive,
          state === 'active' && styles.textActive
        ]}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    justifyContent: 'center',
  },
  text: {
    ...TYPOGRAPHY.title,
    fontSize: 14,
    color: COLORS.text,
  },
  textPassive: {
    color: COLORS.text,
  },
  textActive: {
    color: COLORS.text,
  },
});
