import React from 'react';
import { View, StyleSheet, ViewStyle, Animated, Pressable, useAnimatedValue } from 'react-native';
import { Text } from './Text';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, IconName } from './Icon';
import { useTheme, MEDIA_COLORS } from '../theme';
import type { MediaSource } from '../types';

export interface SquareCardProps {
  title: string;
  subtitle: string;
  image?: MediaSource;
  iconName?: IconName;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Figma "Card": locked to 1:1 so imagery of any aspect ratio is cropped (`contentFit="cover"`)
 * instead of stretched — the "Aspect ratio problem" board.
 */
export const SquareCard = ({
  title,
  subtitle,
  image,
  iconName = 'squiggle',
  onPress,
  style,
}: SquareCardProps) => {
  const { theme } = useTheme();
  const scaleAnim = useAnimatedValue(1);
  const radius = theme.radius.xxl;

  const animateTo = (toValue: number) =>
    Animated.spring(scaleAnim, { toValue, useNativeDriver: true, speed: 26 }).start();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => onPress && animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={`${title}, ${subtitle}`}
        style={[
          styles.container,
          {
            borderRadius: radius,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.shadow,
          },
        ]}>
        {image ? (
          <Image
            source={image}
            contentFit="cover"
            transition={250}
            style={StyleSheet.absoluteFill}
            accessibilityIgnoresInvertColors
          />
        ) : (
          // Figma placeholder: grey → navy fade with an image glyph.
          <LinearGradient colors={MEDIA_COLORS.placeholder} style={styles.placeholder}>
            <Icon name="grid" size={32} color={MEDIA_COLORS.placeholderIcon} />
          </LinearGradient>
        )}
        <LinearGradient colors={MEDIA_COLORS.scrimBottom} style={styles.gradient}>
          <View style={styles.content}>
            <View style={styles.subtitleRow}>
              <Icon name={iconName} size={14} color={MEDIA_COLORS.accent} />
              <Text style={[styles.subtitle, { color: MEDIA_COLORS.accent }]}>{subtitle}</Text>
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: MEDIA_COLORS.base,
    elevation: 3,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  placeholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  content: {
    gap: 4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: MEDIA_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    fontStyle: 'italic',
  },
});
