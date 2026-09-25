import React from 'react';
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
  Pressable,
  useAnimatedValue,
} from 'react-native';
import { Icon, IconName } from './Icon';
import { useTheme, ThemeTokens } from '../theme';

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
  style?: ViewStyle;
  textStyle?: TextStyle;
}

interface Palette {
  fill: string;
  border: string;
  text: string;
}

const getPalette = (variant: ButtonVariant, theme: ThemeTokens, isDark: boolean): Palette => {
  const { colors } = theme;
  const tint = isDark ? 'rgba(0, 211, 243, 0.14)' : 'rgba(8, 145, 178, 0.12)';

  switch (variant) {
    case 'secondary':
      // Figma: Slate 900 pill; on light surfaces it stays dark for contrast.
      return isDark
        ? { fill: colors.surface, border: colors.border, text: colors.textPrimary }
        : { fill: colors.textPrimary, border: colors.textPrimary, text: '#FFFFFF' };
    case 'danger':
      return { fill: colors.danger, border: colors.danger, text: '#FFFFFF' };
    case 'neutral':
      return { fill: colors.textMuted, border: colors.textMuted, text: '#FFFFFF' };
    case 'soft':
      return { fill: tint, border: 'transparent', text: colors.primary };
    case 'glass':
      return { fill: colors.glass, border: colors.glassBorder, text: colors.primary };
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
  style,
  textStyle,
}: ButtonProps) => {
  const { theme, isDark } = useTheme();
  const scaleAnim = useAnimatedValue(1);

  const animateTo = (toValue: number) =>
    Animated.spring(scaleAnim, { toValue, useNativeDriver: true, speed: 24, bounciness: 4 }).start();

  // A disabled primary renders as the Figma "soft" tint rather than just fading out.
  const effectiveVariant = disabled && variant === 'primary' ? 'soft' : variant;
  const palette = getPalette(effectiveVariant, theme, isDark);
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
      : variant === 'primary' || variant === 'soft' || variant === 'glass'
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
        accessibilityState={{ disabled: isInactive }}
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
