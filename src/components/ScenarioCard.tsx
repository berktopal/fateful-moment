import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from './Button';
import { Icon, IconName } from './Icon';
import { useTheme, MONO_FONT, MEDIA_COLORS, TYPE_SCALE } from '../theme';
import type { MediaSource } from '../types';

export interface ScenarioCardProps {
  title: string;
  description: string;
  image: MediaSource;
  onStart: () => void;
  style?: ViewStyle;
  /** Figma "Scenario Container" (hero). Otherwise the Figma "Card" list layout. */
  isLarge?: boolean;
  /** Locked scenarios use Figma's inactive state: the whole card at 35% opacity. */
  isActive?: boolean;
  iconName?: IconName;
  headerText?: string;
  ctaLabel?: string;
}

export const ScenarioCard = ({
  title,
  description,
  image,
  onStart,
  style,
  isLarge = false,
  isActive = true,
  iconName = 'alarm-clock',
  headerText = 'Scenario Time',
  ctaLabel,
}: ScenarioCardProps) => {
  const { theme } = useTheme();
  const radius = isLarge ? theme.radius.hero : theme.radius.xl;

  return (
    <View
      style={[
        styles.container,
        isLarge ? styles.hero : styles.list,
        { borderRadius: radius, shadowColor: theme.colors.shadow },
        !isActive && styles.inactive,
        style,
      ]}>
      <Image
        source={image}
        contentFit="cover"
        transition={250}
        style={StyleSheet.absoluteFill}
        accessibilityIgnoresInvertColors
      />
      <LinearGradient
        colors={isLarge ? MEDIA_COLORS.scrimHero : MEDIA_COLORS.scrimList}
        style={StyleSheet.absoluteFill}
      />

      {isLarge ? (
        <View style={styles.heroContent}>
          <View style={styles.heroText}>
            <View style={styles.heroTitleGroup}>
              <Text style={styles.heroHud}>{headerText}</Text>
              <Text style={styles.heroTitle} numberOfLines={2} accessibilityRole="header">
                {title}
              </Text>
            </View>
            <Text style={styles.heroDescription} numberOfLines={4}>
              {description}
            </Text>
          </View>
          <Button
            title={ctaLabel ?? 'Start Simulation'}
            onPress={onStart}
            variant="glass"
            size="lg"
            onMedia
            disabled={!isActive}
            fadeWhenDisabled={false}
            accessibilityLabel={`Start ${title}`}
          />
        </View>
      ) : (
        <View style={styles.listContent}>
          <View style={styles.listText}>
            <View style={styles.listHeader}>
              <Icon name={iconName} size={16} color={MEDIA_COLORS.accent} />
              <Text style={styles.listHud}>{headerText}</Text>
            </View>
            <Text style={styles.listTitle} numberOfLines={1} accessibilityRole="header">
              {title}
            </Text>
            <Text style={styles.listDescription} numberOfLines={3}>
              {description}
            </Text>
          </View>
          <Button
            title={ctaLabel ?? (isActive ? 'Start' : 'Locked')}
            onPress={onStart}
            variant="glass"
            size="md"
            onMedia
            disabled={!isActive}
            fadeWhenDisabled={false}
            // Figma Card: Inter Black 16/24 label with the compact 8px vertical padding.
            textStyle={TYPE_SCALE.body}
            style={styles.listButton}
            accessibilityLabel={isActive ? `Start ${title}` : `${title} is locked`}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: MEDIA_COLORS.border,
    backgroundColor: MEDIA_COLORS.base,
  },
  // Figma Scenario Container shadow: 0 25 50 -12 rgba(0,0,0,0.25).
  hero: {
    minHeight: 292,
    elevation: 10,
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
  },
  // Figma Card: 326 × 261 with a 20/25 + 8/10 double shadow (approximated as one).
  list: {
    // Explicit width: with only aspectRatio, Yoga can derive the width from the height.
    width: '100%',
    aspectRatio: 326 / 261,
    elevation: 6,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  inactive: {
    opacity: 0.35,
  },
  heroContent: {
    flex: 1,
    padding: 24,
    gap: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    alignItems: 'center',
    gap: 16,
  },
  heroTitleGroup: {
    alignItems: 'center',
    gap: 4,
  },
  heroHud: {
    ...TYPE_SCALE.caption02,
    fontFamily: MONO_FONT,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: MEDIA_COLORS.accent,
  },
  heroTitle: {
    ...TYPE_SCALE.title01,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: MEDIA_COLORS.textPrimary,
  },
  heroDescription: {
    ...TYPE_SCALE.subhead,
    opacity: 0.8,
    textAlign: 'center',
    color: MEDIA_COLORS.textSecondary,
  },
  listContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
    gap: 12,
  },
  listText: {
    gap: 2,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listHud: {
    ...TYPE_SCALE.caption01,
    fontFamily: MONO_FONT,
    fontWeight: '700',
    color: MEDIA_COLORS.accent,
  },
  listTitle: {
    ...TYPE_SCALE.subhead,
    fontWeight: '900',
    fontStyle: 'italic',
    color: MEDIA_COLORS.textPrimary,
  },
  listDescription: {
    ...TYPE_SCALE.subhead,
    color: MEDIA_COLORS.textSecondary,
  },
  listButton: {
    alignSelf: 'flex-end',
  },
});
