import React, { ReactNode, Ref } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme, MAX_CONTENT_WIDTH } from '../theme';
import { Button } from './Button';
import { useI18n } from '../i18n';

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
  /** Lets a screen scroll programmatically (e.g. to reveal a result). */
  scrollRef?: Ref<ScrollView>;
}

/** Shared screen shell: themed background, scroll area and consistent loading / error states. */
export const ScreenContainer = ({
  header,
  children,
  loading = false,
  error,
  onRetry,
  retryLabel,
  contentStyle,
  footer,
  scrollRef,
}: ScreenContainerProps) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.state}>
          <ActivityIndicator color={theme.colors.primary} size="large" accessibilityLabel={t.common.loading} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.state}>
          <Text style={[styles.errorText, { color: theme.colors.textMuted }]}>{error}</Text>
          {onRetry && <Button title={retryLabel ?? t.common.retry} icon="refresh-cw" variant="glass" onPress={onRetry} />}
        </View>
      );
    }
    return (
      <ScrollView
        ref={scrollRef}
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
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
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
