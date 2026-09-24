import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavBarProps = {
  title: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

export const NavBar = ({ title, leftIcon, rightIcon, onLeftPress, onRightPress }: NavBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {leftIcon ? (
        <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
          <Feather name={leftIcon} size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
      
      <Text style={styles.title}>{title}</Text>

      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
          <Feather name={rightIcon} size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0,
    fontStyle: 'normal',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 36,
  },
});
