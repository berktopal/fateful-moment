import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../constants/Theme';

type SquareCardProps = {
  title: string;
  subtitle: string;
  imageUrl?: string;
  iconName?: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  style?: ViewStyle;
};

export const SquareCard = ({ 
  title, 
  subtitle, 
  imageUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000', 
  iconName = 'activity',
  onPress,
  style 
}: SquareCardProps) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.container, style]}>
      <ImageBackground 
        source={{ uri: imageUrl }} 
        style={styles.imageBackground}
        imageStyle={styles.imageRadius}
      >
        <LinearGradient
          colors={['transparent', 'rgba(2,6,23,0.9)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.subtitleRow}>
              <Feather name={iconName} size={14} color={COLORS.primary} />
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1, // To make it a perfect square
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.secondary,
  },
  imageBackground: {
    flex: 1,
  },
  imageRadius: {
    borderRadius: RADIUS.lg,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACING.md,
  },
  content: {
    gap: SPACING.xs,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 16,
    color: COLORS.text,
  },
});

