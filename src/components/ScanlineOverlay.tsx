import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface ScanlineOverlayProps {
  opacity?: number;
  style?: ViewStyle;
}

export const ScanlineOverlay = ({ opacity = 0.05, style }: ScanlineOverlayProps) => {
  const { isDark } = useTheme();

  const effectiveOpacity = isDark ? opacity : opacity * 0.4;

  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      <View style={[styles.tint, { opacity: effectiveOpacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  tint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#00D3F3', // Subtle HUD tint
  },
});
