import React from 'react';
import { StyleSheet, ViewStyle, Animated, Pressable, useAnimatedValue } from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, OPTION_CARD, TYPE_SCALE } from '../theme';

/**
 * - `default` / `active` / `passive`: Figma "Option Card" (Is selected? = Default / Selected /
 *   Passive). Passive is the selected treatment at 48% opacity.
 * - `dimmed`: the Default card at the same 48% — used for the options *not* chosen once a
 *   decision is locked, so only the actual choice keeps the cyan treatment.
 */
export type OptionCardState = 'default' | 'active' | 'passive' | 'dimmed';

export interface OptionCardProps {
  text: string;
  state?: OptionCardState;
  onPress?: () => void;
  style?: ViewStyle;
}

// Figma gradient angle ≈ 96°: nearly horizontal, rising slightly to the right.
const GRADIENT_START = { x: 0, y: 0.45 };
const GRADIENT_END = { x: 1, y: 0.55 };

export const OptionCard = ({ text, state = 'default', onPress, style }: OptionCardProps) => {
  const { theme } = useTheme();
  const scaleAnim = useAnimatedValue(1);
  const disabled = state === 'passive' || state === 'dimmed';
  const selectedLook = state === 'active' || state === 'passive';

  const animateTo = (toValue: number) =>
    Animated.spring(scaleAnim, { toValue, useNativeDriver: true, speed: 26 }).start();

  const frame = [
    styles.container,
    {
      borderRadius: theme.radius.xl,
      borderColor: OPTION_CARD.border,
      borderWidth: selectedLook ? 2 : 1,
      // Figma keeps the outer size fixed, so the thicker border eats 1px of padding.
      paddingHorizontal: selectedLook ? 18 : 17,
    },
  ];

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ scale: scaleAnim }] },
        disabled && { opacity: OPTION_CARD.passiveOpacity },
        style,
      ]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => !disabled && animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityLabel={text}
        accessibilityState={{ checked: state === 'active', disabled }}>
        {selectedLook ? (
          <LinearGradient
            colors={OPTION_CARD.selectedGradient}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={frame}>
            <Text style={styles.text}>{text}</Text>
          </LinearGradient>
        ) : (
          <Animated.View style={[frame, { backgroundColor: OPTION_CARD.fill }]}>
            <Text style={styles.text}>{text}</Text>
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  container: {
    minHeight: 66,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  text: {
    ...TYPE_SCALE.caption01,
    color: OPTION_CARD.text,
    fontWeight: '500',
  },
});
