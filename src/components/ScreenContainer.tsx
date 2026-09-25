import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Button } from './Button';

interface ScreenContainerProps {
  /** Rendered above the scroll area (usually a NavBar). */
  header?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  retryLabel?: string;
  contentStyle?: ViewStyle;
  /** Rendered below the scroll area, e.g. a sticky CTA. */
  footer?: ReactNode;
}

/** Shared screen shell: themed background, scroll area and consistent loading / error states. */
export const ScreenContainer = ({
  header,
  children,
  loading = false,
  error,
  onRetry,
  retryLabel = 'Retry',
  contentStyle,
  footer,
}: ScreenContainerProps) => {
  const { theme } = useTheme();

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.state}>
          <ActivityIndicator color={theme.colors.primary} size="large" accessibilityLabel="Loading" />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.state}>
          <Text style={[styles.errorText, { color: theme.colors.textMuted }]}>{error}</Text>
          {onRetry && <Button title={retryLabel} icon="refresh-cw" variant="soft" onPress={onRetry} />}
        </View>
      );
    }
    return (
      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {header}
      {renderBody()}
      {footer}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
