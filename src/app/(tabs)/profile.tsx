import { useMemo } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { NavBar } from '../../components/NavBar';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Button } from '../../components/Button';
import { StatusBeacon } from '../../components/StatusBeacon';
import { findScenario } from '../../repositories/scenarioRepository';
import { ratingColor } from '../../features/simulation/presentation';
import { OPERATIVE_AVATAR } from '../../data/mockData';
import { useAppStore } from '../../store/AppStore';
import { useTheme, MONO_FONT } from '../../theme';

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(undefined, { day: '2-digit', month: 'short' });

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { history, clearHistory } = useAppStore();

  const stats = useMemo(() => {
    if (!history.length) return { missions: 0, average: '—', best: '—' };
    const scores = history.map((r) => r.score);
    return {
      missions: history.length,
      average: String(Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)),
      best: String(Math.max(...scores)),
    };
  }, [history]);

  const confirmReset = () =>
    Alert.alert('Reset progress?', 'All mission history on this device will be erased.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: clearHistory },
    ]);

  const statItems = [
    { label: 'MISSIONS', value: String(stats.missions) },
    { label: 'AVG SCORE', value: stats.average, highlight: true },
    { label: 'BEST', value: stats.best },
  ];

  return (
    <ScreenContainer header={<NavBar title="Profile" leftIcon="squiggle" />} contentStyle={styles.content}>
      <View style={styles.identity}>
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarRing, { borderColor: theme.colors.primary }]}>
            <Image
              source={OPERATIVE_AVATAR}
              contentFit="cover"
              style={styles.avatar}
              accessibilityLabel="Operative portrait"
            />
          </View>
          <StatusBeacon status="online" size={12} style={styles.beacon} />
        </View>
        <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>AGENT 47</Text>
        <Text style={[styles.rank, { color: theme.colors.primary }]}>SENIOR FIELD OPERATIVE</Text>
      </View>

      <View
        style={[
          styles.stats,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.xl },
        ]}>
        {statItems.map((item, index) => (
          <View key={item.label} style={styles.statRow}>
            {index > 0 && <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />}
            <View style={styles.stat}>
              <Text
                style={[
                  styles.statValue,
                  { color: item.highlight ? theme.colors.primary : theme.colors.textPrimary },
                ]}>
                {item.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{item.label}</Text>
            </View>
          </View>
        ))}
      </View>

      <SectionHeader title="Recent Missions" style={styles.section} />
      {history.length === 0 ? (
        <View style={[styles.empty, { borderColor: theme.colors.border }]}>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted, textAlign: 'center' }]}>
            No missions completed yet. Your after-action reports will appear here.
          </Text>
          <Button title="Open War Room" icon="arrow-right" variant="soft" onPress={() => router.navigate('/')} />
        </View>
      ) : (
        history.slice(0, 5).map((record) => (
          <View
            key={record.id}
            style={[
              styles.mission,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}>
            <View style={styles.missionInfo}>
              <Text style={[styles.missionTitle, { color: theme.colors.textPrimary }]}>
                {findScenario(record.scenarioId)?.title ?? 'Archived scenario'}
              </Text>
              <Text style={[styles.missionMeta, { color: theme.colors.textMuted }]}>
                {formatDate(record.completedAt)}
              </Text>
            </View>
            <View style={styles.missionResult}>
              <Text style={[styles.missionRating, { color: ratingColor(theme, record.rating) }]}>
                {record.rating}
              </Text>
              <Text style={[styles.missionScore, { color: theme.colors.textPrimary }]}>{record.score}</Text>
            </View>
          </View>
        ))
      )}

      {history.length > 0 && (
        <Button
          title="Reset Progress"
          variant="danger"
          appearance="outline"
          onPress={confirmReset}
          style={styles.reset}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  identity: {
    alignItems: 'center',
    marginTop: 8,
  },
  avatarWrapper: {
    marginBottom: 14,
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 2,
    padding: 3,
  },
  avatar: {
    flex: 1,
    borderRadius: 50,
  },
  beacon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  rank: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 24,
    paddingVertical: 16,
    borderWidth: 1,
  },
  statRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  statLabel: {
    fontFamily: MONO_FONT,
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 4,
  },
  section: {
    marginTop: 28,
  },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    alignItems: 'center',
  },
  mission: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 10,
  },
  missionInfo: {
    flex: 1,
    gap: 2,
  },
  missionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  missionMeta: {
    fontFamily: MONO_FONT,
    fontSize: 11,
  },
  missionResult: {
    alignItems: 'flex-end',
  },
  missionRating: {
    fontFamily: MONO_FONT,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  missionScore: {
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  reset: {
    marginTop: 12,
  },
});
