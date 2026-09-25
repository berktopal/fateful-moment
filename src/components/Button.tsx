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
import { useTheme, ThemeTokens, MEDIA_COLORS, TYPE_SCALE } from '../theme';

/**
 * Figma "Buttons" component set:
 * - `primary` (cyan fill) · `secondary` (cyan outline) · `ghost` (white 10% + outline) · `link`
 *   — each with Default / Pressed / Disabled states and Lg / Md / Sm sizes.
 * - `glass` — "Primary Glass": translucent cyan, used for Start buttons on imagery.
 * - `dark` / `danger` — the Style Guide's "Secondary" and "Danger Action" buttons.
 */
export type ButtonVariant =
  'primary' | 'secondary' | 'ghost' | 'link' | 'glass' | 'dark' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing icon, e.g. the Figma `arrow-right`. */
  icon?: IconName;
  /** Content sits on photography: use the Figma cyan regardless of theme. */
  onMedia?: boolean;
  disabled?: boolean;
  /**
   * Set false when a parent already dims the whole block (e.g. a locked card at 35%), so the
   * button is not faded twice.
   */
  fadeWhenDisabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

interface Appearance {
  fill: string;
  border: string;
  text: string;
}

// Figma: 24px horizontal padding at every size; Lg 12px / Md & Sm 8px vertical.
const SIZES: Record<ButtonSize, { paddingVertical: number; type: TextStyle; icon: number }> = {
  lg: { paddingVertical: 12, type: TYPE_SCALE.body, icon: 24 },
  md: { paddingVertical: 8, type: { fontSize: 14, lineHeight: 18 }, icon: 20 },
  sm: { paddingVertical: 8, type: TYPE_SCALE.caption01, icon: 16 },
};

const resolveAppearance = (
  variant: ButtonVariant,
  state: 'default' | 'pressed' | 'disabled',
  theme: ThemeTokens,
  onMedia: boolean,
): Appearance => {
  const { colors } = theme;
  const clear = 'transparent';

  switch (variant) {
    case 'secondary':
      if (state === 'disabled')
        return { fill: clear, border: colors.disabledBorder, text: colors.disabledText };
      if (state === 'pressed')
        return { fill: clear, border: colors.inverseSurface, text: colors.inverseSurface };
      return { fill: clear, border: colors.primary, text: colors.primary };

    case 'ghost':
      if (state === 'disabled')
        return { fill: colors.ghostFill, border: colors.disabledBorder, text: colors.disabledText };
      return { fill: colors.ghostFill, border: colors.ghostBorder, text: colors.ghostText };

    case 'link':
      if (state === 'disabled') return { fill: clear, border: clear, text: colors.disabledText };
      if (state === 'pressed') return { fill: clear, border: clear, text: colors.textMuted };
      return { fill: clear, border: clear, text: colors.primary };

    case 'glass': {
      const text = onMedia ? MEDIA_COLORS.accent : colors.glassText;
      return { fill: onMedia ? MEDIA_COLORS.glassFill : colors.glassFill, border: clear, text };
    }

    case 'dark':
      // Style Guide "Secondary": Slate 900 with a sec-800 hairline so it reads on Slate 900 surfaces.
      return {
        fill: colors.inverseSurface,
        border: theme.mode === 'dark' ? colors.border : colors.inverseSurface,
        text: colors.onInverseSurface,
      };

    case 'danger':
      return { fill: colors.danger, border: colors.danger, text: colors.onAccent };

    case 'primary':
    default:
      if (state === 'disabled')
        return {
          fill: colors.disabledFill,
          border: colors.disabledBorder,
          text: colors.onInverseSurface,
        };
      if (state === 'pressed')
        return {
          fill: colors.inverseSurface,
          border: colors.inverseSurface,
          text: colors.onInverseSurface,
        };
      return { fill: colors.primary, border: colors.primary, text: colors.onPrimary };
  }
};

// Variants with their own Figma disabled/pressed treatment; the rest simply fade.
const HAS_STATE_STYLES: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'link'];

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  onMedia = false,
  disabled = false,
  fadeWhenDisabled = true,
  loading = false,
  accessibilityLabel,
  style,
  textStyle,
}: ButtonProps) => {
  const { theme } = useTheme();
  const scaleAnim = useAnimatedValue(1);
  const inactive = disabled || loading;
  const spec = SIZES[size];
  const isLink = variant === 'link';
  // The Style Guide's standalone buttons (glass / dark / danger) set labels in Inter Black.
  const labelWeight =
    variant === 'glass' || variant === 'dark' || variant === 'danger' ? '900' : '700';

  const animateTo = (toValue: number) =>
    Animated.spring(scaleAnim, {
      toValue,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => !inactive && animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        disabled={inactive}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled: inactive, busy: loading }}>
        {({ pressed }) => {
          const state = disabled ? 'disabled' : pressed ? 'pressed' : 'default';
          const appearance = resolveAppearance(variant, state, theme, onMedia);
          const fades = !HAS_STATE_STYLES.includes(variant);
          return (
            <Animated.View
              style={[
                styles.base,
                {
                  borderRadius: theme.radius.xl,
                  paddingVertical: isLink ? 2 : spec.paddingVertical,
                  paddingHorizontal: isLink ? 0 : 24,
                  backgroundColor: appearance.fill,
                  borderColor: appearance.border,
                },
                fades && disabled && fadeWhenDisabled && styles.faded,
                fades && pressed && !disabled && styles.pressed,
              ]}>
              {loading ? (
                <ActivityIndicator color={appearance.text} size="small" />
              ) : (
                <>
                  <Text
                    style={[
                      spec.type,
                      { fontWeight: labelWeight, color: appearance.text, textAlign: 'center' },
                      textStyle,
                    ]}>
                    {title}
                  </Text>
                  {icon && <Icon name={icon} size={spec.icon} color={appearance.text} />}
                </>
              )}
            </Animated.View>
          );
        }}
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
  faded: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
});
