import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from './Button';
import { Icon, IconName } from './Icon';
import { useTheme, MONO_FONT, MEDIA_COLORS } from '../theme';
import type { MediaSource } from '../types';

export interface ScenarioCardProps {
  title: string;
  description: string;
  image: MediaSource;
  onStart: () => void;
  style?: ViewStyle;
  /** Hero "Scenario Briefing" layout: centred copy and a "Start Simulation" CTA. */
  isLarge?: boolean;
  /** Locked scenarios get the Figma passive state: a frosted wash over the whole card. */
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
  const radius = theme.radius.xxl;

  return (
    <View
      style={[
        styles.container,
        { borderRadius: radius, borderColor: theme.colors.border, shadowColor: theme.colors.shadow },
        isLarge && styles.containerLarge,
        style,
      ]}
      accessible={false}>
      <Image
        source={image}
        contentFit="cover"
        transition={250}
        style={StyleSheet.absoluteFill}
        accessibilityIgnoresInvertColors
      />
      <LinearGradient
        colors={MEDIA_COLORS.scrim}
        style={[styles.content, isLarge && styles.contentLarge]}>
        <View style={[styles.header, isLarge && styles.centered]}>
          {!isLarge && <Icon name={iconName} size={14} color={theme.colors.primary} />}
          <Text style={[styles.hud, isLarge && styles.hudLarge, { color: theme.colors.primary }]}>
            {headerText}
          </Text>
        </View>

        <Text
          style={[styles.title, isLarge && styles.titleLarge]}
          numberOfLines={isLarge ? 2 : 1}
          accessibilityRole="header">
          {title}
        </Text>

        <Text
          style={[styles.description, isLarge && styles.descriptionLarge]}
          numberOfLines={isLarge ? 4 : 3}>
          {description}
        </Text>

        <View style={[styles.footer, isLarge && styles.centered]}>
          <Button
            title={ctaLabel ?? (isLarge ? 'Start Simulation' : isActive ? 'Start' : 'Locked')}
            onPress={onStart}
            variant="glass"
            size={isLarge ? 'lg' : 'md'}
            disabled={!isActive}
            accessibilityLabel={isActive ? `Start ${title}` : `${title} is locked`}
          />
        </View>
      </LinearGradient>

      {!isActive && <View pointerEvents="none" style={styles.passiveWash} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    minHeight: 230,
    marginBottom: 20,
    borderWidth: 1,
    backgroundColor: MEDIA_COLORS.base,
    elevation: 6,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  containerLarge: {
    minHeight: 290,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  contentLarge: {
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hud: {
    fontFamily: MONO_FONT,
    fontSize: 12,
  },
  hudLarge: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: MEDIA_COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  titleLarge: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  description: {
    color: MEDIA_COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  descriptionLarge: {
    color: MEDIA_COLORS.textMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 22,
  },
  footer: {
    alignItems: 'flex-end',
  },
  passiveWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: MEDIA_COLORS.passiveWash,
  },
});
