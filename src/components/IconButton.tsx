import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { RADIUS } from '../constants/Theme';

type IconButtonProps = {
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  isActive?: boolean;
  style?: ViewStyle;
  size?: number;
};

export const IconButton = ({ icon, onPress, isActive = false, style, size = 20 }: IconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        isActive && styles.activeContainer,
        style
      ]}
    >
      <Feather 
        name={icon} 
        size={size} 
        color={isActive ? COLORS.primary : COLORS.textMuted} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContainer: {
    backgroundColor: 'rgba(0, 211, 243, 0.15)', // Light cyan background for active state
  },
});

