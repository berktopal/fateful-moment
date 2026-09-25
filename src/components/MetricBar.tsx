import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme, MONO_FONT } from '../theme';

interface MetricBarProps {
  label: string;
  /** 0 → 100. */
  value: number;
  /** Change from the previous value, shown as "+10" / "-5". */
  delta?: number;
  style?: ViewStyle;
}

/** Solid HUD gauge for outcome metrics; colour reflects health (cyan → amber → red). */
export const MetricBar = ({ label, value, delta, style }: MetricBarProps) => {
  const { theme } = useTheme();
  const clamped = Math.min(100, Math.max(0, value));
  const color =
    clamped >= 60 ? theme.colors.primary : clamped >= 35 ? theme.colors.warning : theme.colors.danger;

  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: clamped }}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
        <Text style={[styles.value, { color }]}>
          {clamped}
          {delta !== undefined && delta !== 0 && (
            <Text
              style={{
                fontFamily: MONO_FONT,
                color: delta > 0 ? theme.colors.success : theme.colors.danger,
              }}>
              {`  ${delta > 0 ? '+' : ''}${delta}`}
            </Text>
          )}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.surfaceElevated }]}>
        <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  value: {
    fontFamily: MONO_FONT,
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
