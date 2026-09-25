import React from 'react';
import { Text, StyleSheet, ViewStyle, Animated, Pressable, useAnimatedValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, OPTION_GRADIENTS } from '../theme';

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
  const gradientColors = OPTION_GRADIENTS[state];

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={state === 'passive'}
        accessibilityRole="radio"
        accessibilityLabel={text}
        accessibilityState={{ checked: state === 'active', disabled: state === 'passive' }}>
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
});
