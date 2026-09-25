import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Icon } from './Icon';
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
  title = 'Interactive Selection',
}: InteractiveSelectionProps) => {
  const { theme, isDark } = useTheme();
  const selectedFill = isDark ? '#0092B8' : theme.colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#020C1B' : theme.colors.surface,
          borderRadius: theme.radius.xl + 8,
          borderColor: theme.colors.border,
        },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
        <Icon name="check-circle" size={20} color={theme.colors.primary} />
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
                  // Style guide: selected option is a solid cyan bar, others are outlined.
                  backgroundColor: isSelected ? selectedFill : 'transparent',
                  borderColor: isSelected ? selectedFill : theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? theme.colors.onPrimary : theme.colors.textMuted,
                  },
                ]}>
                {option}
              </Text>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: isSelected ? theme.colors.onPrimary : theme.colors.textMuted,
                  },
                ]}>
                {isSelected && (
                  <View
                    style={[
                      styles.radioInner,
                      {
                        backgroundColor: theme.colors.onPrimary,
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
    padding: 24,
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
    fontSize: 17,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.3,
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
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    flex: 1,
    marginRight: 10,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
