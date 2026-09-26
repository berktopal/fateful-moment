import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from './IconButton';
import { Icon, IconName } from './Icon';
import { useTheme, TYPE_SCALE } from '../theme';

/** A tappable nav bar icon. The label is required: screen readers announce it. */
export interface NavBarAction {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
}

export interface NavBarProps {
  title: string;
  /** An icon name renders a decorative glyph (e.g. the Figma brand squiggle); an action renders a button. */
  left?: IconName | NavBarAction;
  right?: IconName | NavBarAction;
}

export const NavBar = ({ title, left, right }: NavBarProps) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const renderSlot = (slot: NavBarProps['left']) => {
    if (!slot) return <View style={styles.slot} />;
    if (typeof slot === 'string') {
      return (
        <View
          style={styles.slot}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants">
          <Icon name={slot} size={24} color={theme.colors.textPrimary} />
        </View>
      );
    }
    return (
      <IconButton
        icon={slot.icon}
        onPress={slot.onPress}
        accessibilityLabel={slot.accessibilityLabel}
        color={theme.colors.textPrimary}
      />
    );
  };

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
      {renderSlot(left)}

      <Text
        style={[styles.title, { color: theme.colors.textPrimary }]}
        numberOfLines={1}
        accessibilityRole="header">
        {title}
      </Text>

      {renderSlot(right)}
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
  slot: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
