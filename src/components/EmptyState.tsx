import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme';

interface EmptyStateProps {
  message: string;
  /** Optional call to action below the message. */
  children?: ReactNode;
}

/** Dashed placeholder shown in place of a list that has nothing to show. */
export const EmptyState = ({ message, children }: EmptyStateProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { borderColor: theme.colors.border, borderRadius: theme.radius.xl }]}>
      <Text style={[theme.typography.body, styles.message, { color: theme.colors.textMuted }]}>
        {message}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 20,
    gap: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
  },
});
