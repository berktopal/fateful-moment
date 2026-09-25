import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ViewStyle, Animated, Pressable, useAnimatedValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, IconName } from './Icon';
import { useTheme } from '../theme';

export interface SquareCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  iconName?: IconName;
  onPress?: () => void;
  style?: ViewStyle;
}

export const SquareCard = ({
  title,
  subtitle,
  imageUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000',
  iconName = 'squiggle',
  onPress,
  style,
}: SquareCardProps) => {
  const { theme } = useTheme();
  const scaleAnim = useAnimatedValue(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.container,
          {
            borderRadius: theme.radius.xl + 4,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}>
        <ImageBackground
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={styles.imageBackground}
          imageStyle={{ borderRadius: theme.radius.xl + 4 }}>
          <LinearGradient
            colors={['transparent', 'rgba(2,6,23,0.55)', 'rgba(2,6,23,0.95)']}
            style={styles.gradient}>
            <View style={styles.content}>
              <View style={styles.subtitleRow}>
                <Icon name={iconName} size={14} color={theme.colors.primary} />
                <Text style={[styles.subtitle, { color: theme.colors.primary }]}>{subtitle}</Text>
              </View>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    fontStyle: 'italic',
  },
});
