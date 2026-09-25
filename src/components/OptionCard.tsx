import React from 'react';
import { StyleSheet, ViewStyle, Animated, Pressable, useAnimatedValue } from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, OPTION_GRADIENTS } from '../theme';

/**
 * - `default` / `active` / `passive`: the three Figma "Option" states.
 * - `dimmed`: a default card faded back, used for the options *not* chosen once a decision is
 *   locked. Figma's pale passive gradient is brighter than the active one on dark surfaces,
 *   so it would pull the eye away from the actual choice.
 */
export type OptionCardState = 'default' | 'active' | 'passive' | 'dimmed';

export interface OptionCardProps {
  text: string;
  state?: OptionCardState;
  onPress?: () => void;
  style?: ViewStyle;
}

export const OptionCard = ({ text, state = 'default', onPress, style }: OptionCardProps) => {
  const { theme } = useTheme();
  const scaleAnim = useAnimatedValue(1);
  const disabled = state === 'passive' || state === 'dimmed';

  const animateTo = (toValue: number) =>
    Animated.spring(scaleAnim, { toValue, useNativeDriver: true, speed: 26 }).start();

  // Figma "Option" cards: diagonal sheen gradients, identical in both themes, always white copy.
  const gradientColors = OPTION_GRADIENTS[state === 'dimmed' ? 'default' : state];

  return (
    <Animated.View
      style={[{ transform: [{ scale: scaleAnim }] }, state === 'dimmed' && styles.dimmed, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => !disabled && animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityLabel={text}
        accessibilityState={{ checked: state === 'active', disabled }}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 1, y: 0.7 }}
          style={[
            styles.container,
            {
              borderRadius: theme.radius.xl,
              borderColor: state === 'active' ? OPTION_GRADIENTS.activeBorder : 'transparent',
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
    color: OPTION_GRADIENTS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  dimmed: {
    opacity: 0.35,
  },
});
