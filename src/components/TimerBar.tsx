import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

interface TimerBarProps {
  progress?: number; // 0 to 1
  durationSeconds?: number;
  label?: string;
  style?: ViewStyle;
}

export const TimerBar = ({
  progress = 0.75,
  durationSeconds,
  label = 'MISSION WINDOW',
  style,
}: TimerBarProps) => {
  const { theme } = useTheme();
  const animatedWidth = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

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
      <View style={[styles.track, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
        <Animated.View style={[styles.barContainer, { width: widthInterpolation }]}>
          <LinearGradient
            colors={[theme.colors.primary, '#F59E0B', theme.colors.accent]}
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
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  percent: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  track: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  barContainer: {
    height: '100%',
  },
  gradient: {
    flex: 1,
    borderRadius: 4,
  },
});
