import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from './Button';
import { Icon, IconName } from './Icon';
import { useTheme, MONO_FONT } from '../theme';

export interface ScenarioCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onStart: () => void;
  style?: ViewStyle;
  /** Hero "Scenario Briefing" layout: centred copy and a "Start Simulation" CTA. */
  isLarge?: boolean;
  /** Locked scenarios get the Figma passive state: a frosted wash over the whole card. */
  isActive?: boolean;
  iconName?: IconName;
  headerText?: string;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop';

// Imagery is always darkened so white copy stays legible in both themes (Figma uses one look).
const IMAGE_SCRIM = ['rgba(2, 6, 23, 0.45)', 'rgba(2, 6, 23, 0.92)'] as const;

export const ScenarioCard = ({
  title,
  description,
  imageUrl = DEFAULT_IMAGE,
  onStart,
  style,
  isLarge = false,
  isActive = true,
  iconName = 'alarm-clock',
  headerText = 'Scenario Time',
}: ScenarioCardProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { borderRadius: theme.radius.xl + 4, borderColor: theme.colors.border },
        isLarge && styles.containerLarge,
        style,
      ]}>
      <ImageBackground source={{ uri: imageUrl }} resizeMode="cover" style={styles.image}>
        <LinearGradient
          colors={IMAGE_SCRIM}
          style={[styles.content, isLarge && styles.contentLarge]}>
          <View style={[styles.header, isLarge && styles.centered]}>
            {!isLarge && <Icon name={iconName} size={14} color={theme.colors.primary} />}
            <Text style={[styles.hud, isLarge && styles.hudLarge, { color: theme.colors.primary }]}>
              {headerText}
            </Text>
          </View>

          <Text style={[styles.title, isLarge && styles.titleLarge]} numberOfLines={isLarge ? 2 : 1}>
            {title}
          </Text>

          <Text
            style={[styles.description, isLarge && styles.descriptionLarge]}
            numberOfLines={isLarge ? 4 : 3}>
            {description}
          </Text>

          <View style={[styles.footer, isLarge && styles.centered]}>
            <Button
              title={isLarge ? 'Start Simulation' : 'Start'}
              onPress={onStart}
              variant="glass"
              size={isLarge ? 'lg' : 'md'}
              disabled={!isActive}
            />
          </View>
        </LinearGradient>
      </ImageBackground>

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
    backgroundColor: '#020617',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  containerLarge: {
    minHeight: 290,
  },
  image: {
    flex: 1,
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
    color: '#FFFFFF',
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
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  descriptionLarge: {
    color: '#94A3B8',
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
    backgroundColor: 'rgba(226, 232, 240, 0.6)',
  },
});
