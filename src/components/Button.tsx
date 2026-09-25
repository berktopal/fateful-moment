import React from 'react';
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
  Pressable,
  useAnimatedValue,
} from 'react-native';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { useTheme, ThemeTokens, MEDIA_COLORS } from '../theme';

/**
 * Figma "Buttons" board: 6 colour variants × 3 appearances (solid / outline / link) × 3 sizes.
 * `glass` is the translucent Start button that sits on top of scenario imagery.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'neutral' | 'soft' | 'glass';
export type ButtonAppearance = 'solid' | 'outline' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  /** Trailing icon, e.g. the Figma `arrow-right`. */
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

interface Palette {
  fill: string;
  border: string;
  text: string;
}

const getPalette = (variant: ButtonVariant, theme: ThemeTokens): Palette => {
  const { colors } = theme;

  switch (variant) {
    case 'secondary':
      // Figma: Slate 900 pill in both themes (bordered on dark backgrounds).
      return {
        fill: colors.inverseSurface,
        border: theme.mode === 'dark' ? colors.border : colors.inverseSurface,
        text: colors.onInverseSurface,
      };
    case 'danger':
      return { fill: colors.danger, border: colors.danger, text: colors.onAccent };
    case 'neutral':
      return { fill: colors.textMuted, border: colors.textMuted, text: colors.onAccent };
    case 'soft':
      return { fill: colors.primaryTint, border: 'transparent', text: colors.primary };
    case 'glass':
      // Glass sits on imagery, so it keeps the Figma cyan in both themes.
      return { fill: colors.glass, border: colors.glassBorder, text: MEDIA_COLORS.accent };
    case 'primary':
    default:
      return { fill: colors.primary, border: colors.primary, text: colors.onPrimary };
  }
};

const SIZES: Record<ButtonSize, { container: ViewStyle; fontSize: number; icon: number }> = {
  sm: { container: { paddingVertical: 7, paddingHorizontal: 12 }, fontSize: 12, icon: 14 },
  md: { container: { paddingVertical: 11, paddingHorizontal: 18 }, fontSize: 14, icon: 16 },
  lg: { container: { paddingVertical: 15, paddingHorizontal: 26 }, fontSize: 16, icon: 18 },
};

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  appearance = 'solid',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  accessibilityLabel,
  style,
  textStyle,
}: ButtonProps) => {
  const { theme } = useTheme();
  const scaleAnim = useAnimatedValue(1);

  const animateTo = (toValue: number) =>
    Animated.spring(scaleAnim, { toValue, useNativeDriver: true, speed: 24, bounciness: 4 }).start();

  // A disabled primary renders as the Figma "soft" tint rather than just fading out.
  const effectiveVariant = disabled && variant === 'primary' ? 'soft' : variant;
  const palette = getPalette(effectiveVariant, theme);
  const sizeSpec = SIZES[size];

  const containerStyle: ViewStyle =
    appearance === 'solid'
      ? { backgroundColor: palette.fill, borderColor: palette.border }
      : appearance === 'outline'
        ? { backgroundColor: 'transparent', borderColor: variant === 'soft' ? palette.text : palette.fill }
        : { backgroundColor: 'transparent', borderColor: 'transparent', paddingHorizontal: 0 };

  // Outline/link buttons draw their label in the variant's accent colour.
  const textColor =
    appearance === 'solid'
      ? palette.text
      : variant === 'glass'
        ? MEDIA_COLORS.accent
        : variant === 'primary' || variant === 'soft'
          ? theme.colors.primary
          : variant === 'secondary'
            ? theme.colors.textPrimary
            : palette.fill;

  const isInactive = disabled || loading;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => !isInactive && animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        disabled={isInactive}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled: isInactive, busy: loading }}
        style={[
          styles.base,
          { borderRadius: theme.radius.lg },
          sizeSpec.container,
          containerStyle,
          disabled && effectiveVariant !== 'soft' && styles.disabled,
        ]}>
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <>
            <Text style={[styles.text, { fontSize: sizeSpec.fontSize, color: textColor }, textStyle]}>
              {title}
            </Text>
            {icon && <Icon name={icon} size={sizeSpec.icon} color={textColor} />}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.45,
  },
});
