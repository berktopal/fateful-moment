import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from './IconButton';
import { IconName } from './Icon';
import { useTheme, TYPE_SCALE } from '../theme';

export interface NavBarProps {
  title: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
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
          paddingTop: insets.top,
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.divider,
        },
      ]}>
      {leftIcon ? (
        <IconButton icon={leftIcon} onPress={onLeftPress} color={theme.colors.textPrimary} />
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      <Text
        style={[styles.title, { color: theme.colors.textPrimary }]}
        numberOfLines={1}
        accessibilityRole="header">
        {title}
      </Text>

      {rightIcon ? (
        <IconButton icon={rightIcon} onPress={onRightPress} color={theme.colors.textPrimary} />
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Figma Nav Bar: 48px tall, 24px icons inset 24px from the edges, 1px sec-700 divider.
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 2,
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  title: {
    ...TYPE_SCALE.headline,
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  // Same footprint as an IconButton so the title stays centred and the bar height is stable.
  iconPlaceholder: {
    width: 44,
    height: 44,
  },
});
