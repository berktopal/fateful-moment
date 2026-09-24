import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { Button } from './Button';
import { LinearGradient } from 'expo-linear-gradient';

type ScenarioCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  onStart: () => void;
  style?: ViewStyle;
  isLarge?: boolean;
};

export const ScenarioCard = ({
  title,
  description,
  imageUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  onStart,
  style,
  isLarge = false,
}: ScenarioCardProps) => {
  return (
    <View style={[styles.container, style, isLarge && styles.containerLarge]}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.imageRadius}>
        <LinearGradient
          colors={['rgba(2,6,23,0.3)', 'rgba(2,6,23,0.9)']}
          style={styles.gradient}>
          
          <View style={[styles.header, isLarge && styles.headerLarge]}>
            <Feather name="activity" size={16} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.subtitle}>SCENARIO TIME</Text>
          </View>
          
          <Text style={[styles.title, isLarge && styles.titleLarge]}>{title}</Text>
          
          <Text style={[styles.description, isLarge && styles.descriptionLarge]} numberOfLines={3}>
            {description}
          </Text>

          <View style={[styles.footer, isLarge && styles.footerLarge]}>
            <Button 
              title={isLarge ? 'START SIMULATION' : 'START'} 
              onPress={onStart} 
              variant={isLarge ? 'primary' : 'dark'}
            />
          </View>
          
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 240,
    marginBottom: 20,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  containerLarge: {
    height: 300,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: 16,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLarge: {
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  subtitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  titleLarge: {
    fontSize: 28,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  descriptionLarge: {
    textAlign: 'center',
    marginBottom: 24,
  },
  footer: {
    alignItems: 'flex-end',
  },
  footerLarge: {
    alignItems: 'center',
  },
});
