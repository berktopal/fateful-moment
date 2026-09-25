import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme, MONO_FONT } from '../theme';

export interface HudCardProps {
  /** Mono HUD tag above the title, e.g. "SURFACE_A // ENCRYPTED". */
  tag: string;
  title: string;
  description?: string;
  chips?: string[];
  /** Shows the red status dot in the top-right corner. */
  alert?: boolean;
  children?: ReactNode;
  style?: ViewStyle;
}

/** Style guide "Standard Card Layout": cinematic container with HUD accents. */
export const HudCard = ({
  tag,
  title,
  description,
  chips,
  alert = false,
  children,
  style,
}: HudCardProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceHud,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xxl + 4,
        },
        style,
      ]}>
      {alert && <View style={[styles.alertDot, { backgroundColor: theme.colors.danger }]} />}

      <View style={[styles.tagRow, { borderLeftColor: theme.colors.border }]}>
        <Text style={[styles.tag, { color: theme.colors.primary }]}>{tag}</Text>
      </View>

      <Text style={[theme.typography.heading, styles.title, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>

      {description ? (
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>{description}</Text>
      ) : null}

      {chips?.length ? (
        <View style={styles.chipRow}>
          {chips.map((chip) => (
            <View
              key={chip}
              style={[
                styles.chip,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceElevated },
              ]}>
              <Text style={[styles.chipText, { color: theme.colors.textMuted }]}>{chip}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  alertDot: {
    position: 'absolute',
    top: 16,
    right: 18,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagRow: {
    borderLeftWidth: 1,
    paddingLeft: 8,
    marginBottom: 10,
  },
  tag: {
    fontFamily: MONO_FONT,
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipText: {
    fontFamily: MONO_FONT,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
