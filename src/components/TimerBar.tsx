import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Animated, ViewStyle, useAnimatedValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, MONO_FONT } from '../theme';

interface TimerBarProps {
  progress?: number; // 0 to 1
  durationSeconds?: number;
  label?: string;
  style?: ViewStyle;
}

export const TimerBar = ({
  progress = 0.75,
  durationSeconds,
  label = 'TIMER',
  style,
}: TimerBarProps) => {
  const { theme } = useTheme();
  const animatedWidth = useAnimatedValue(progress);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
        <Text style={[styles.percent, { color: theme.colors.primary }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.surfaceElevated }]}>
        <Animated.View style={[styles.barContainer, { width: widthInterpolation }]}>
          <LinearGradient
            colors={[theme.colors.primary, '#7C8BA1', theme.colors.accent]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontFamily: MONO_FONT,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  percent: {
    fontFamily: MONO_FONT,
    fontSize: 10,
    letterSpacing: 1,
  },
  track: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barContainer: {
    height: '100%',
  },
  gradient: {
    flex: 1,
    borderRadius: 3,
  },
});

