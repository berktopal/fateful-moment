import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme';

export interface InteractiveSelectionProps {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  title?: string;
}

export const InteractiveSelection = ({
  options,
  selectedIndex,
  onSelect,
  title = 'INTERACTIVE PROTOCOL',
}: InteractiveSelectionProps) => {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderColor: isDark ? 'rgba(0, 211, 243, 0.25)' : theme.colors.border,
        },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
        <Feather name="check-circle" size={15} color={theme.colors.primary} />
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;

          return (
            <Pressable
              key={index}
              onPress={() => onSelect(index)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.option,
                {
                  borderRadius: theme.radius.md,
                  backgroundColor: isSelected
                    ? isDark
                      ? 'rgba(0, 211, 243, 0.14)'
                      : 'rgba(8, 145, 178, 0.12)'
                    : theme.colors.surfaceElevated,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? theme.colors.primary : theme.colors.textPrimary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {option}
              </Text>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}>
                {isSelected && (
                  <View
                    style={[
                      styles.radioInner,
                      {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderWidth: 1,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
