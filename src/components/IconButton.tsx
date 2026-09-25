import React from 'react';
import { StyleSheet, ViewStyle, Animated, Pressable, useAnimatedValue } from 'react-native';
import { Icon, IconName } from './Icon';
import { useTheme } from '../theme';

interface IconButtonProps {
  icon: IconName;
  onPress?: () => void;
  isActive?: boolean;
  /** Style-guide HUD look: Slate 900 tile with a hairline border and cyan glyph. */
  bordered?: boolean;
  /** Overrides the inactive glyph colour (e.g. white icons on the Nav Bar). */
  color?: string;
  style?: ViewStyle;
  size?: number;
  accessibilityLabel?: string;
}

export const IconButton = ({
  icon,
  onPress,
  isActive = false,
  bordered = false,
  color,
  style,
  size = 24,
  accessibilityLabel,
}: IconButtonProps) => {
  const { theme } = useTheme();
  const scaleAnim = useAnimatedValue(1);

  const animateTo = (toValue: number) =>
    Animated.spring(scaleAnim, { toValue, useNativeDriver: true, speed: 28 }).start();

  const glyphColor =
    isActive || bordered ? theme.colors.primary : (color ?? theme.colors.iconMuted);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateTo(0.92)}
        onPressOut={() => animateTo(1)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || icon}
        hitSlop={8}
        style={[
          styles.container,
          {
            borderRadius: theme.radius.lg,
            backgroundColor: isActive ? theme.colors.primaryTint : bordered ? theme.colors.surface : 'transparent',
            borderColor: bordered ? theme.colors.border : 'transparent',
          },
        ]}>
        <Icon name={icon} size={size} color={glyphColor} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
