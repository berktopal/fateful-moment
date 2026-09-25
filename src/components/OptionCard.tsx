import React from 'react';
import { Text, StyleSheet, ViewStyle, Animated, Pressable, useAnimatedValue } from 'react-native';
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
  const { theme } = useTheme();
  const scaleAnim = useAnimatedValue(1);

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

  // Figma "Option" cards: diagonal sheen gradients, identical in both themes, always white copy.
  const gradientColors: readonly [string, string, ...string[]] =
    state === 'active'
      ? ['#5E7F8E', '#3FB9CC', '#52E3F5', '#3FB9CC', '#5E7F8E']
      : state === 'passive'
        ? ['#B4BFCA', '#AEDDE6', '#B2F0F7', '#AEDDE6', '#B4BFCA']
        : ['#667085', '#667085'];

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
          colors={gradientColors}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 1, y: 0.7 }}
          style={[
            styles.container,
            {
              borderRadius: theme.radius.xl,
              borderColor: state === 'active' ? 'rgba(0, 211, 243, 0.6)' : 'transparent',
            },
          ]}>
          <Text style={styles.text}>{text}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
