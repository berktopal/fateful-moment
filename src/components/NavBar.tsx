import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from './IconButton';
import { useTheme } from '../theme';

export interface NavBarProps {
  title: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export const NavBar = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}: NavBarProps) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + theme.spacing.sm,
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}>
      {leftIcon ? (
        <IconButton icon={leftIcon} onPress={onLeftPress} />
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>

      {rightIcon ? (
        <IconButton icon={rightIcon} onPress={onRightPress} />
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
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  iconPlaceholder: {
    width: 40,
  },
});
