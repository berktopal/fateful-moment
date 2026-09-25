import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface ScanlineOverlayProps {
  opacity?: number;
  /** Distance between scanlines in dp. */
  spacing?: number;
  style?: ViewStyle;
}

// Enough lines to cover any card/screen section; the container clips the rest.
const LINE_COUNT = 160;

export const ScanlineOverlay = ({ opacity = 0.08, spacing = 4, style }: ScanlineOverlayProps) => {
  const { theme, isDark } = useTheme();
  const lineColor = isDark ? theme.colors.primary : theme.colors.textPrimary;
  // Lines read much stronger on light surfaces, so they are toned down there.
  const effectiveOpacity = isDark ? opacity : opacity * 0.5;

  return (
    <View pointerEvents="none" style={[styles.container, { opacity: effectiveOpacity }, style]}>
      {Array.from({ length: LINE_COUNT }, (_, i) => (
        <View
          key={i}
          style={[styles.line, { backgroundColor: lineColor, marginBottom: spacing - 1 }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    zIndex: 1,
  },
  line: {
    height: 1,
  },
});
