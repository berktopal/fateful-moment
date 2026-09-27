import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface ScanlineOverlayProps {
  opacity?: number;
  /** Distance between scanlines in dp. */
  spacing?: number;
  style?: ViewStyle;
}

export const ScanlineOverlay = ({ opacity = 0.08, spacing = 4, style }: ScanlineOverlayProps) => {
  const { theme, isDark } = useTheme();
  // Each line is a native view, so draw only as many as the measured area needs (a 190dp map
  // needs ~48) instead of a fixed number sized for the tallest possible container.
  const [height, setHeight] = useState(0);
  const lineCount = Math.ceil(height / spacing);
  const lineColor = isDark ? theme.colors.primary : theme.colors.textPrimary;
  // Lines read much stronger on light surfaces, so they are toned down there.
  const effectiveOpacity = isDark ? opacity : opacity * 0.5;

  return (
    <View
      pointerEvents="none"
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
      style={[styles.container, { opacity: effectiveOpacity }, style]}>
      {Array.from({ length: lineCount }, (_, i) => (
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
