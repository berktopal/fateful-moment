import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../components/Text';
import { NavBar } from '../../components/NavBar';
import { ScreenContainer } from '../../components/ScreenContainer';
import { StatusBeacon } from '../../components/StatusBeacon';
import { Icon } from '../../components/Icon';
import { useHaptics } from '../../hooks/useHaptics';
import { getCommanderVitals, HEART_RATE_VITAL_ID } from '../../repositories/systemRepository';
import { useI18n } from '../../i18n';
import { useTheme, MONO_FONT } from '../../theme';

export default function VitalsScreen() {
  const { theme } = useTheme();
  const { t, language } = useI18n();
  const vitals = getCommanderVitals(language);
  const haptics = useHaptics();
  const [pulse, setPulse] = useState(84);

  // Dummy telemetry: nudge the heart rate within a plausible band on each refresh.
  const refreshTelemetry = () => {
    haptics.selection();
    const jitter = Math.floor(Math.random() * 5) - 2;
    setPulse((prev) => Math.max(78, Math.min(96, prev + jitter)));
  };

  return (
    <ScreenContainer
      header={
        <NavBar
          title={t.vitals.title}
          leftIcon="squiggle"
          rightIcon="refresh-cw"
          onRightPress={refreshTelemetry}
        />
      }>
      <View style={styles.header}>
        <View>
          <Icon name="activity" size={46} color={theme.colors.primary} strokeWidth={1.75} />
          <StatusBeacon status="online" size={10} style={styles.beacon} />
        </View>
        <Text style={[theme.typography.heading, styles.title, { color: theme.colors.textPrimary }]}>
          {t.vitals.heading}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{t.vitals.feed}</Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.xl },
        ]}>
        {vitals.map((vital, index) => (
          <View
            key={vital.id}
            accessible
            style={[
              styles.row,
              { borderBottomColor: theme.colors.border },
              index === vitals.length - 1 && styles.lastRow,
            ]}>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>{vital.label}</Text>
            <Text style={[styles.value, { color: vital.danger ? theme.colors.danger : theme.colors.primary }]}>
              {vital.id === HEART_RATE_VITAL_ID ? `${pulse} BPM` : vital.value}
            </Text>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  beacon: {
    position: 'absolute',
    top: -6,
    right: -14,
  },
  title: {
    marginTop: 14,
  },
  subtitle: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 15,
  },
  value: {
    fontFamily: MONO_FONT,
    fontSize: 14,
    fontWeight: '700',
  },
});
