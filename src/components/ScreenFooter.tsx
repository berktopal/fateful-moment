import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

/**
 * Sticky action area below a ScreenContainer's scroll view, clear of the home indicator /
 * gesture bar. Several actions stack vertically: two large buttons side by side do not fit
 * their labels on a 360dp-wide phone.
 */
export const ScreenFooter = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom: insets.bottom + 12,
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
