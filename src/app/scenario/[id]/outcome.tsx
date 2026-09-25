import { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/Text';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavBar } from '../../../components/NavBar';
import { ScreenContainer } from '../../../components/ScreenContainer';
import { SectionHeader } from '../../../components/SectionHeader';
import { MetricBar } from '../../../components/MetricBar';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { ScanlineOverlay } from '../../../components/ScanlineOverlay';
import { findScenario } from '../../../repositories/scenarioRepository';
import {
  decodeChoices,
  evaluateRun,
  formatDelta,
  INITIAL_METRICS,
  RATING_COPY,
  TIMEOUT_PENALTY,
} from '../../../features/simulation/engine';
import { ratingColor } from '../../../features/simulation/presentation';
import { useAppStore } from '../../../store/AppStore';
import { useHaptics } from '../../../hooks/useHaptics';
import { useCountUp } from '../../../hooks/useCountUp';
import { FadeIn } from '../../../components/FadeIn';
import { useTheme, MONO_FONT } from '../../../theme';

const returnHome = () => {
  if (router.canDismiss()) router.dismissAll();
  else router.replace('/');
};

export default function OutcomeScreen() {
  const { id, choices, runId } = useLocalSearchParams<{
    id: string;
    choices?: string;
    runId?: string;
  }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const { recordMission } = useAppStore();
  const scenario = findScenario(id);

  const run = useMemo(() => {
    const decoded = decodeChoices(choices);
    if (!scenario || decoded.length !== scenario.steps.length) return null;
    return evaluateRun(scenario, decoded);
  }, [scenario, choices]);

  const displayedScore = useCountUp(run?.score ?? 0);

  // Record the run once. `runId` comes from the simulation screen, so re-renders or deep links
  // to an old result never create duplicate history entries.
  useEffect(() => {
    if (!run || !runId || !scenario) return;
    recordMission({
      id: runId,
      scenarioId: scenario.id,
      score: run.score,
      rating: run.rating,
      completedAt: Date.now(),
    });
    haptics.success();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  const header = <NavBar title="After Action Report" />;

  if (!scenario || !run) {
    return (
      <ScreenContainer
        header={header}
        error="This result could not be loaded."
        onRetry={returnHome}
        retryLabel="Return to War Room"
      />
    );
  }

  const accent = ratingColor(theme, run.rating);

  return (
    <ScreenContainer
      header={header}
      footer={
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + 12,
              backgroundColor: theme.colors.background,
              borderTopColor: theme.colors.border,
            },
          ]}>
          <Button
            title="Retry"
            icon="history"
            variant="secondary"
            size="lg"
            style={styles.footerButton}
            onPress={() => router.replace(`/scenario/${scenario.id}/play`)}
          />
          <Button
            title="War Room"
            icon="arrow-right"
            size="lg"
            style={styles.footerButton}
            onPress={returnHome}
          />
        </View>
      }>
      <FadeIn>
        <View
          style={[
            styles.hero,
            {
              backgroundColor: theme.colors.surfaceHud,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xxl + 4,
            },
          ]}>
          <ScanlineOverlay />
          <Text style={[styles.hud, { color: theme.colors.primary }]}>
            {`MISSION OUTCOME // ${scenario.title.toUpperCase()}`}
          </Text>
          <Text
            style={[theme.typography.displayLarge, styles.rating, { color: accent }]}
            accessibilityRole="header">
            {run.rating}
          </Text>
          <View style={styles.scoreRow}>
            <Text
              style={[styles.score, { color: theme.colors.textPrimary }]}
              accessibilityLabel={`Score ${run.score} out of 100`}>
              {displayedScore}
            </Text>
            <Text style={[styles.scoreMax, { color: theme.colors.textMuted }]}>/ 100</Text>
          </View>
          <Text style={[theme.typography.body, styles.copy, { color: theme.colors.textMuted }]}>
            {RATING_COPY[run.rating]}
          </Text>
        </View>
      </FadeIn>

      <FadeIn delay={120}>
        <SectionHeader title="Final Metrics" />
        <MetricBar
          label="STABILITY"
          value={run.metrics.stability}
          delta={run.metrics.stability - INITIAL_METRICS.stability}
        />
        <MetricBar
          label="PUBLIC TRUST"
          value={run.metrics.trust}
          delta={run.metrics.trust - INITIAL_METRICS.trust}
        />
      </FadeIn>

      <SectionHeader
        title="Decision Timeline"
        style={styles.timelineHeader}
        accessory={
          run.timeouts > 0 ? (
            <Text style={[styles.timeouts, { color: theme.colors.danger }]}>
              {`${run.timeouts} TIMEOUT${run.timeouts > 1 ? 'S' : ''}`}
            </Text>
          ) : undefined
        }
      />
      {run.timeline.map(({ step, option }, index) => {
        const impact = option?.impact ?? TIMEOUT_PENALTY;
        return (
          <FadeIn key={step.id} delay={240 + index * 70}>
            <View
              style={[
                styles.timelineItem,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
              ]}>
              <View style={[styles.timelineIndex, { backgroundColor: theme.colors.primaryTint }]}>
                <Text style={[styles.timelineIndexText, { color: theme.colors.primary }]}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.timelineBody}>
                <Text style={[styles.timelinePrompt, { color: theme.colors.textPrimary }]}>
                  {step.prompt}
                </Text>
                <View style={styles.timelineChoice}>
                  <Icon
                    name={option ? 'check-circle' : 'alert-triangle'}
                    size={13}
                    color={option ? theme.colors.primary : theme.colors.danger}
                  />
                  <Text
                    style={[
                      styles.timelineChoiceText,
                      { color: option ? theme.colors.textMuted : theme.colors.danger },
                    ]}>
                    {option?.text ?? 'Timed out — no order issued'}
                  </Text>
                </View>
                <Text style={[styles.timelineDelta, { color: theme.colors.textMuted }]}>
                  {`STB ${formatDelta(impact.stability)}  ·  TRS ${formatDelta(impact.trust)}`}
                </Text>
              </View>
            </View>
          </FadeIn>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    padding: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  hud: {
    fontFamily: MONO_FONT,
    fontSize: 10,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },
  rating: {
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginVertical: 8,
  },
  score: {
    fontFamily: MONO_FONT,
    fontSize: 44,
    fontWeight: '700',
  },
  scoreMax: {
    fontFamily: MONO_FONT,
    fontSize: 16,
  },
  copy: {
    textAlign: 'center',
  },
  timelineHeader: {
    marginTop: 12,
  },
  timeouts: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 10,
  },
  timelineIndex: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIndexText: {
    fontFamily: MONO_FONT,
    fontSize: 12,
    fontWeight: '700',
  },
  timelineBody: {
    flex: 1,
    gap: 4,
  },
  timelinePrompt: {
    fontSize: 15,
    fontWeight: '700',
  },
  timelineChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timelineChoiceText: {
    flex: 1,
    fontSize: 13,
  },
  timelineDelta: {
    fontFamily: MONO_FONT,
    fontSize: 10,
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerButton: {
    flex: 1,
  },
});
