import React, { useRef } from 'react';
import { Text, StyleSheet, ViewStyle, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

export interface OptionCardProps {
  text: string;
  state?: 'default' | 'active' | 'passive';
  onPress?: () => void;
  style?: ViewStyle;
}

export const OptionCard = ({
  text,
  state = 'default',
  onPress,
  style,
}: OptionCardProps) => {
  const { theme, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (state === 'passive') return;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 26,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 26,
    }).start();
  };

  const getGradientColors = (): [string, string, ...string[]] => {
    if (isDark) {
      switch (state) {
        case 'active':
          return ['#164E63', '#00D3F3', '#164E63']; // Cyan glow gradient
        case 'passive':
          return ['#334155', '#475569', '#334155']; // Dimmed grey gradient
        case 'default':
        default:
          return ['#1E293B', '#1E293B']; // Solid slate 800
      }
    } else {
      switch (state) {
        case 'active':
          return ['#0891B2', '#06B6D4', '#0891B2']; // Vibrant cyan gradient
        case 'passive':
          return ['#E2E8F0', '#CBD5E1', '#E2E8F0'];
        case 'default':
        default:
          return ['#F1F5F9', '#F1F5F9'];
      }
    }
  };

  const getTextColor = () => {
    if (state === 'active') {
      return '#FFFFFF';
    }
    if (state === 'passive') {
      return isDark ? 'rgba(241, 245, 249, 0.5)' : '#94A3B8';
    }
    return theme.colors.textPrimary;
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={state === 'passive'}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: state === 'active', disabled: state === 'passive' }}>
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.container,
            {
              borderRadius: theme.radius.lg,
              borderColor: state === 'active' ? theme.colors.primary : theme.colors.border,
            },
          ]}>
          <Text style={[styles.text, { color: getTextColor() }]}>{text}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
