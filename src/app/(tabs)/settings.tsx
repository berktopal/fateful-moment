import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { theme, preference, setPreference, isDark } = useTheme();
  const router = useRouter();

  const [haptic, setHaptic] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavBar title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Theme Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            THEME & APPEARANCE
          </Text>

          <View
            style={[
              styles.themeSelectorCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.lg,
              },
            ]}>
            <View style={styles.settingLeft}>
              <Feather name={isDark ? 'moon' : 'sun'} size={20} color={theme.colors.primary} />
              <View>
                <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                  Interface Theme
                </Text>
                <Text style={[styles.settingSubtext, { color: theme.colors.textMuted }]}>
                  Active: {isDark ? 'Dark (Figma Baseline)' : 'Light (Accessible)'}
                </Text>
              </View>
            </View>

            <View style={styles.segmentedContainer}>
              {(['dark', 'light', 'system'] as const).map((mode) => {
                const isActive = preference === mode;
                return (
                  <Pressable
                    key={mode}
                    onPress={() => setPreference(mode)}
                    style={[
                      styles.segmentButton,
                      {
                        backgroundColor: isActive
                          ? theme.colors.primary
                          : theme.colors.surfaceElevated,
                        borderRadius: theme.radius.sm,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.segmentText,
                        {
                          color: isActive ? theme.colors.onPrimary : theme.colors.textMuted,
                          fontWeight: isActive ? '800' : '600',
                        },
                      ]}>
                      {mode.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* System Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            TACTICAL PREFERENCES
          </Text>

          <View
            style={[
              styles.settingRow,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.lg,
              },
            ]}>
            <View style={styles.settingLeft}>
              <Feather name="bell" size={20} color={theme.colors.primary} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Encrypted Notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={notifications ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View
            style={[
              styles.settingRow,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.lg,
              },
            ]}>
            <View style={styles.settingLeft}>
              <Feather name="smartphone" size={20} color={theme.colors.primary} />
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                Haptic Actuation
              </Text>
            </View>
            <Switch
              value={haptic}
              onValueChange={setHaptic}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={haptic ? '#FFFFFF' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Developer & Design System Tools */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            DESIGN SYSTEM VERIFICATION
          </Text>

          <Pressable
            onPress={() => router.push('/gallery')}
            style={[
              styles.settingRow,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.primary,
                borderRadius: theme.radius.lg,
              },
            ]}>
            <View style={styles.settingLeft}>
              <Feather name="layers" size={20} color={theme.colors.primary} />
              <View>
                <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                  Component Gallery
                </Text>
                <Text style={[styles.settingSubtext, { color: theme.colors.textMuted }]}>
                  View all Figma states in Light & Dark
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.primary} />
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  themeSelectorCard: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 14,
  },
  segmentedContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 11,
    letterSpacing: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
});
