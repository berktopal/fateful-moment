import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
  useAnimatedValue,
} from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, MONO_FONT } from '../theme';

interface TimerBarProps {
  /** 0 → 1 fill. */
  progress: number;
  label?: string;
  /** Right-hand HUD readout; defaults to the percentage. */
  trailingLabel?: string;
  /** Turns the readout red below this progress (e.g. the last seconds of a countdown). */
  criticalBelow?: number;
  /** Use a short duration when progress is driven by a live countdown. */
  animationMs?: number;
  /**
   * Countdown mode pins the gradient to the full track width and anchors it to the fill's
   * right edge: a full bar looks exactly like the Figma timer (cyan → red) and, as time runs
   * out, only the red end remains visible — the colour itself signals urgency.
   */
  countdown?: boolean;
  style?: ViewStyle;
}

/** Style guide "Timer": thin track with a Cyan → Red gradient fill. */
export const TimerBar = ({
  progress,
  label = 'TIMER',
  trailingLabel,
  criticalBelow,
  animationMs = 600,
  countdown = false,
  style,
}: TimerBarProps) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const { theme } = useTheme();
  const clamped = Math.min(1, Math.max(0, progress));
  const animatedWidth = useAnimatedValue(clamped);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clamped,
      duration: animationMs,
      easing: Easing.linear,
      useNativeDriver: false, // width is a layout prop
    }).start();
  }, [clamped, animationMs, animatedWidth]);

  const width = animatedWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const isCritical = criticalBelow !== undefined && clamped < criticalBelow;

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
        <Text
          style={[
            styles.readout,
            { color: isCritical ? theme.colors.danger : theme.colors.primary },
          ]}>
          {trailingLabel ?? `${Math.round(clamped * 100)}%`}
        </Text>
      </View>
      <View
        style={[styles.track, { backgroundColor: theme.colors.surfaceElevated }]}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
        <Animated.View style={[styles.fill, { width }]}>
          <LinearGradient
            colors={theme.colors.timerGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={
              countdown && trackWidth > 0
                ? [styles.gradientPinned, { width: trackWidth }]
                : styles.gradient
            }
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
  readout: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  track: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
    borderRadius: 3,
  },
  gradientPinned: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
  gradient: {
    flex: 1,
    borderRadius: 3,
  },
});
