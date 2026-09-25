import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, ViewStyle, useAnimatedValue } from 'react-native';
import { useTheme } from '../theme';

interface StatusBeaconProps {
  status?: 'online' | 'warning' | 'critical' | 'standby';
  size?: number;
  pulse?: boolean;
  style?: ViewStyle;
}

export const StatusBeacon = ({
  status = 'online',
  size = 10,
  pulse = true,
  style,
}: StatusBeaconProps) => {
  const { theme } = useTheme();
  const pulseAnim = useAnimatedValue(1);
  const opacityAnim = useAnimatedValue(0.7);

  useEffect(() => {
    if (!pulse) return;

    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2.2,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulse, pulseAnim, opacityAnim]);

  const getColor = () => {
    switch (status) {
      case 'online':
        return theme.colors.beaconGreen;
      case 'warning':
        return '#F59E0B'; // Amber
      case 'critical':
        return theme.colors.beaconRed;
      case 'standby':
      default:
        return theme.colors.primary;
    }
  };

  const color = getColor();

  return (
    <View style={[styles.container, { width: size * 2.5, height: size * 2.5 }, style]}>
      {pulse && (
        <Animated.View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              transform: [{ scale: pulseAnim }],
              opacity: opacityAnim,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  dot: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});

