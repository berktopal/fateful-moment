import { ReactNode } from 'react';
import { View, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { Text } from '../../components/Text';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { NavBar } from '../../components/NavBar';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Icon, IconName } from '../../components/Icon';
import { useAppStore } from '../../store/AppStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme, MONO_FONT, ThemePreference } from '../../theme';
import { LANGUAGE_NAMES, LANGUAGES, toUpper, useI18n } from '../../i18n';

const THEMES: ThemePreference[] = ['dark', 'light', 'system'];

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

interface SegmentOption<T extends string> {
  value: T;
  label: string;
  accessibilityLabel: string;
}

interface SegmentedCardProps<T extends string> {
  icon: IconName;
  title: string;
  subtitle: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Card with a header row and a single-choice segmented control (theme, language). */
const SegmentedCard = <T extends string>({
  icon,
  title,
  subtitle,
  options,
  value,
  onChange,
}: SegmentedCardProps<T>) => {
  const { theme } = useTheme();
  const haptics = useHaptics();

  return (
    <View
      style={[
        styles.segmentedCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg },
      ]}>
      <View style={styles.segmentedHeader}>
        <View style={[styles.rowIcon, { backgroundColor: theme.colors.primaryTint }]}>
          <Icon name={icon} size={18} color={theme.colors.primary} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.rowSubtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
        </View>
      </View>
      <View style={[styles.segmented, { backgroundColor: theme.colors.surfaceElevated }]} accessibilityRole="radiogroup">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => {
                if (active) return;
                haptics.selection();
                onChange(option.value);
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              accessibilityLabel={option.accessibilityLabel}
              style={[
                styles.segment,
                { borderRadius: theme.radius.md, backgroundColor: active ? theme.colors.primary : 'transparent' },
              ]}>
              <Text
                style={[styles.segmentText, { color: active ? theme.colors.onPrimary : theme.colors.textMuted }]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default function SettingsScreen() {
  const { theme, preference, setPreference, isDark } = useTheme();
  const { t, language, setLanguage } = useI18n();
  const { preferences, setPreference: setStorePreference } = useAppStore();

  const switchColors = {
    trackColor: { false: theme.colors.border, true: theme.colors.primary },
    ios_backgroundColor: theme.colors.border,
  };

  const themeOptions = THEMES.map((value) => ({
    value,
    label: t.settings.themes[value],
    accessibilityLabel: t.settings.themeLabel(t.settings.themes[value]),
  }));

  // Each language is labelled in its own name, so it stays recognisable whichever is active.
  const languageOptions = LANGUAGES.map((value) => ({
    value,
    label: toUpper(LANGUAGE_NAMES[value], value),
    accessibilityLabel: LANGUAGE_NAMES[value],
  }));

  return (
    <ScreenContainer header={<NavBar title={t.settings.title} left="squiggle" />}>
      <SectionHeader title={t.settings.appearance} />
      <SegmentedCard
        icon={isDark ? 'moon' : 'sun'}
        title={t.settings.themeTitle}
        subtitle={preference === 'system' ? t.settings.themeFollowing(isDark) : t.settings.themeSaved}
        options={themeOptions}
        value={preference}
        onChange={setPreference}
      />

      <SectionHeader title={t.settings.language} style={styles.section} />
      <SegmentedCard
        icon="languages"
        title={t.settings.languageTitle}
        subtitle={t.settings.languageSubtitle}
        options={languageOptions}
        value={language}
        onChange={setLanguage}
      />

      <SectionHeader title={t.settings.preferences} style={styles.section} />
      <SettingRow
        icon="smartphone"
        title={t.settings.haptics}
        subtitle={t.settings.hapticsSubtitle}
        trailing={
          <Switch
            value={preferences.haptics}
            onValueChange={(value) => setStorePreference('haptics', value)}
            thumbColor={preferences.haptics ? theme.colors.onAccent : theme.colors.switchThumbOff}
            accessibilityLabel={t.settings.haptics}
            {...switchColors}
          />
        }
      />
      <SettingRow
        icon="bell"
        title={t.settings.alerts}
        subtitle={t.settings.alertsSubtitle}
        trailing={
          <Switch
            value={preferences.notifications}
            onValueChange={(value) => setStorePreference('notifications', value)}
            thumbColor={preferences.notifications ? theme.colors.onAccent : theme.colors.switchThumbOff}
            accessibilityLabel={t.settings.alerts}
            {...switchColors}
          />
        }
      />

      <SectionHeader title={t.settings.account} style={styles.section} />
      <SettingRow
        icon="shield"
        title={t.settings.security}
        subtitle={t.settings.securitySubtitle}
        onPress={() => Alert.alert(t.settings.security, t.settings.securityBody)}
      />
      <SettingRow
        icon="fingerprint"
        title={t.settings.clearance}
        subtitle={t.settings.clearanceSubtitle}
        onPress={() => Alert.alert(t.settings.clearanceTitle, t.settings.clearanceBody)}
      />

      <SectionHeader title={t.settings.developer} style={styles.section} />
      <SettingRow
        icon="grid"
        title={t.settings.gallery}
        subtitle={t.settings.gallerySubtitle}
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
  segmentedCard: {
    padding: 14,
    borderWidth: 1,
    gap: 14,
  },
  segmentedHeader: {
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
    minHeight: 44,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
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
