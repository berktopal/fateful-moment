import React, { useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, ViewStyle, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme';

export interface SquareCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  iconName?: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  style?: ViewStyle;
}

export const SquareCard = ({
  title,
  subtitle,
  imageUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000',
  iconName = 'activity',
  onPress,
  style,
}: SquareCardProps) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
            borderRadius: theme.radius.lg,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}>
        <ImageBackground
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={styles.imageBackground}
          imageStyle={{ borderRadius: theme.radius.lg }}>
          <LinearGradient
            colors={['transparent', 'rgba(2,6,23,0.92)']}
            style={styles.gradient}>
            <View style={styles.content}>
              <View style={styles.subtitleRow}>
                <Feather name={iconName} size={13} color={theme.colors.primary} />
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
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
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
