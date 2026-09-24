import React, { useRef } from 'react';
import { StyleSheet, ViewStyle, Animated, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme';

interface IconButtonProps {
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  isActive?: boolean;
  style?: ViewStyle;
  size?: number;
  accessibilityLabel?: string;
}

export const IconButton = ({
  icon,
  onPress,
  isActive = false,
  style,
  size = 20,
  accessibilityLabel,
}: IconButtonProps) => {
  const { theme, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 28,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 28,
    }).start();
  };

  const activeBg = isDark ? 'rgba(0, 211, 243, 0.16)' : 'rgba(8, 145, 178, 0.16)';

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || icon}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={[
          styles.container,
          {
            borderRadius: theme.radius.md,
            backgroundColor: isActive ? activeBg : 'transparent',
          },
        ]}>
        <Feather
          name={icon}
          size={size}
          color={isActive ? theme.colors.primary : theme.colors.textMuted}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
