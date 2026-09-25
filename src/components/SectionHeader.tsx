import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface SectionHeaderProps {
  title: string;
  /** Optional trailing element, typically a StatusBeacon or a text action. */
  accessory?: ReactNode;
  style?: ViewStyle;
}

export const SectionHeader = ({ title, accessory, style }: SectionHeaderProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.row, style]}>
      <Text
        style={[theme.typography.caption, { color: theme.colors.textMuted }]}
        accessibilityRole="header">
        {title}
      </Text>
      {accessory}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
