import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from './IconButton';
import { SPACING, TYPOGRAPHY } from '../constants/Theme';

type NavBarProps = {
  title: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

export const NavBar = ({ title, leftIcon, rightIcon, onLeftPress, onRightPress }: NavBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.md }]}>
      {leftIcon ? (
        <IconButton icon={leftIcon} onPress={onLeftPress} isActive={false} />
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
      
      <Text style={styles.title}>{title}</Text>

      {rightIcon ? (
        <IconButton icon={rightIcon} onPress={onRightPress} isActive={false} />
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 18,
    color: COLORS.text,
  },
  iconPlaceholder: {
    width: 36,
  },
});
