import { ReactNode } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { NavBar } from '../../components/NavBar';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Icon, IconName } from '../../components/Icon';
import { useAppStore } from '../../store/AppStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme, MONO_FONT, ThemePreference } from '../../theme';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'dark', label: 'DARK' },
  { value: 'light', label: 'LIGHT' },
  { value: 'system', label: 'SYSTEM' },
];

interface SettingRowProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onPress?: () => void;
}

const SettingRow = ({ icon, title, subtitle, trailing, onPress }: SettingRowProps) => {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
        },
      ]}>
      <View style={[styles.rowIcon, { backgroundColor: theme.colors.primaryTint }]}>
        <Icon name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.rowSubtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {trailing ?? (onPress ? <Icon name="chevron-right" size={18} color={theme.colors.textMuted} /> : null)}
    </Pressable>
  );
};

export default function SettingsScreen() {
  const { theme, preference, setPreference, isDark } = useTheme();
  const { preferences, setPreference: setStorePreference } = useAppStore();
  const haptics = useHaptics();

  const switchColors = {
    trackColor: { false: theme.colors.border, true: theme.colors.primary },
    ios_backgroundColor: theme.colors.border,
  };

  return (
    <ScreenContainer header={<NavBar title="Settings" leftIcon="squiggle" />}>
      <SectionHeader title="Appearance" />
      <View
        style={[
          styles.themeCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg },
        ]}>
        <View style={styles.themeHeader}>
          <View style={[styles.rowIcon, { backgroundColor: theme.colors.primaryTint }]}>
            <Icon name={isDark ? 'moon' : 'sun'} size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.colors.textPrimary }]}>Interface Theme</Text>
            <Text style={[styles.rowSubtitle, { color: theme.colors.textMuted }]}>
              {preference === 'system' ? `Following system (${isDark ? 'dark' : 'light'})` : 'Saved on this device'}
            </Text>
          </View>
        </View>
        <View style={[styles.segmented, { backgroundColor: theme.colors.surfaceElevated }]} accessibilityRole="radiogroup">
          {THEME_OPTIONS.map(({ value, label }) => {
            const active = preference === value;
            return (
              <Pressable
                key={value}
                onPress={() => {
                  haptics.selection();
                  setPreference(value);
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={`${label.toLowerCase()} theme`}
                style={[
                  styles.segment,
                  { borderRadius: theme.radius.md, backgroundColor: active ? theme.colors.primary : 'transparent' },
                ]}>
                <Text
                  style={[styles.segmentText, { color: active ? theme.colors.onPrimary : theme.colors.textMuted }]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <SectionHeader title="Preferences" style={styles.section} />
      <SettingRow
        icon="smartphone"
        title="Haptic Feedback"
        subtitle="Vibration on decisions and timeouts"
        trailing={
          <Switch
            value={preferences.haptics}
            onValueChange={(value) => setStorePreference('haptics', value)}
            thumbColor={preferences.haptics ? theme.colors.onAccent : theme.colors.switchThumbOff}
            accessibilityLabel="Haptic feedback"
            {...switchColors}
          />
        }
      />
      <SettingRow
        icon="bell"
        title="Mission Alerts"
        subtitle="Saved preference — no push service in this demo"
        trailing={
          <Switch
            value={preferences.notifications}
            onValueChange={(value) => setStorePreference('notifications', value)}
            thumbColor={preferences.notifications ? theme.colors.onAccent : theme.colors.switchThumbOff}
            accessibilityLabel="Mission alerts"
            {...switchColors}
          />
        }
      />

      <SectionHeader title="Account & Privacy" style={styles.section} />
      <SettingRow
        icon="shield"
        title="Security & Privacy"
        subtitle="All data stays on this device"
        onPress={() =>
          Alert.alert(
            'Security & Privacy',
            'Fateful Moment runs entirely on dummy data. Preferences and mission history are stored locally with AsyncStorage and never leave the device.'
          )
        }
      />
      <SettingRow
        icon="fingerprint"
        title="Clearance Credentials"
        subtitle="Level 4 Tactical Clearance"
        onPress={() => Alert.alert('Clearance Level', 'Operative credentials verified.')}
      />

      <SectionHeader title="Developer" style={styles.section} />
      <SettingRow
        icon="grid"
        title="Design System Gallery"
        subtitle="Every component and state from the Figma file"
        onPress={() => router.push('/gallery')}
      />

      <Text style={[styles.version, { color: theme.colors.textMuted }]}>
        {`FATEFUL MOMENT // v${Constants.expoConfig?.version ?? '1.0.0'}`}
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  themeCard: {
    padding: 14,
    borderWidth: 1,
    gap: 14,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  segmented: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 10,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
  },
  segmentText: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  version: {
    fontFamily: MONO_FONT,
    fontSize: 10,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 24,
  },
});
