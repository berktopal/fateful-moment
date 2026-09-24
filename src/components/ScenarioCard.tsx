import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from './Button';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

export interface ScenarioCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onStart: () => void;
  style?: ViewStyle;
  isLarge?: boolean;
  isActive?: boolean;
  iconName?: keyof typeof Feather.glyphMap;
  headerText?: string;
}

export const ScenarioCard = ({
  title,
  description,
  imageUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  onStart,
  style,
  isLarge = false,
  isActive = true,
  iconName = 'activity',
  headerText = 'SCENARIO TIME',
}: ScenarioCardProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: theme.radius.xl,
          borderColor: isActive ? theme.colors.border : theme.colors.surfaceElevated,
          backgroundColor: theme.colors.surface,
        },
        isLarge && styles.containerLarge,
        style,
      ]}>
      <ImageBackground
        source={{ uri: imageUrl }}
        resizeMode="cover"
        style={styles.imageBackground}
        imageStyle={[
          styles.imageRadius,
          { borderRadius: theme.radius.xl },
          !isActive && styles.imagePassive,
        ]}>
        <LinearGradient
          colors={theme.colors.cardOverlayGradient}
          style={[styles.gradient, isLarge && styles.gradientLarge]}>
          <View style={[styles.header, isLarge && styles.headerLarge]}>
            <Feather
              name={iconName}
              size={15}
              color={!isActive ? theme.colors.textMuted : theme.colors.primary}
              style={styles.icon}
            />
            <Text
              style={[
                styles.subtitle,
                { color: !isActive ? theme.colors.textMuted : theme.colors.primary },
              ]}>
              {headerText}
            </Text>
          </View>

          <Text
            style={[
              styles.title,
              isLarge && styles.titleLarge,
              !isActive && { color: theme.colors.textMuted },
            ]}>
            {title}
          </Text>

          <Text
            style={[
              styles.description,
              isLarge && styles.descriptionLarge,
              !isActive && { color: theme.colors.textMuted },
            ]}
            numberOfLines={isLarge ? 4 : 3}>
            {description}
          </Text>

          <View style={[styles.footer, isLarge && styles.footerLarge]}>
            <Button
              title={isLarge ? 'START SIMULATION' : 'START'}
              onPress={onStart}
              variant={isLarge ? 'primary' : 'dark'}
              size={isLarge ? 'lg' : 'md'}
              disabled={!isActive}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: 245,
    marginBottom: 20,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  containerLarge: {
    height: 310,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    // configured dynamically via theme
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  gradientLarge: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLarge: {
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 6,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleLarge: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },
  descriptionLarge: {
    textAlign: 'center',
    marginBottom: 22,
  },
  footer: {
    alignItems: 'flex-end',
  },
  footerLarge: {
    alignItems: 'center',
  },
  imagePassive: {
    opacity: 0.35,
  },
});
