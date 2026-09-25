import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { View, StyleSheet, Alert, BackHandler, ScrollView } from 'react-native';
import { Text } from '../../../components/Text';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavBar } from '../../../components/NavBar';
import { ScreenContainer } from '../../../components/ScreenContainer';
import { TimerBar } from '../../../components/TimerBar';
import { OptionCard, OptionCardState } from '../../../components/OptionCard';
import { FadeIn } from '../../../components/FadeIn';
import { HudCard } from '../../../components/HudCard';
import { MetricBar } from '../../../components/MetricBar';
import { Button } from '../../../components/Button';
import { findScenario } from '../../../repositories/scenarioRepository';
import {
  encodeChoices,
  evaluateRun,
  formatDelta,
  TIMEOUT_CONSEQUENCE,
  TIMEOUT_PENALTY,
} from '../../../features/simulation/engine';
import {
  initialSimulationState,
  simulationReducer,
} from '../../../features/simulation/simulationReducer';
import { formatCountdown, useCountdown } from '../../../features/simulation/useCountdown';
import { useHaptics } from '../../../hooks/useHaptics';
import { useAppActive } from '../../../hooks/useAppActive';
import { useTheme, MONO_FONT } from '../../../theme';
import type { Scenario } from '../../../types';

export default function SimulationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scenario = findScenario(id);

  if (!scenario || !scenario.isActive || scenario.steps.length === 0) {
    return (
      <ScreenContainer
        header={
          <NavBar title="Simulation" leftIcon="arrow-left" onLeftPress={() => router.back()} />
        }
        error="This scenario is not available."
        onRetry={() => router.back()}
        retryLabel="Go Back"
      />
    );
  }

  return <Simulation scenario={scenario} />;
}

function Simulation({ scenario }: { scenario: Scenario }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const appActive = useAppActive();
  const [state, dispatch] = useReducer(simulationReducer, initialSimulationState);
  // Stable id for this run, so the outcome screen records it exactly once.
  const [runId] = useState(() => `${scenario.id}-${Date.now()}`);

  const stepCount = scenario.steps.length;
  const step = scenario.steps[state.stepIndex];
  const isReviewing = state.phase === 'reviewing';

  const handleExpire = useCallback(() => {
    haptics.warning();
    dispatch({ type: 'TIMEOUT' });
  }, [haptics]);

  const remainingMs = useCountdown(
    step.timeLimitSec * 1000,
    state.phase === 'deciding' && appActive,
    step.id,
    handleExpire,
  );

  // Running totals, replayed from the committed choices.
  const run = useMemo(
    () =>
      evaluateRun(
        { ...scenario, steps: scenario.steps.slice(0, state.choices.length) },
        state.choices,
      ),
    [scenario, state.choices],
  );
  const committed = isReviewing ? run.timeline[run.timeline.length - 1] : undefined;

  useEffect(() => {
    if (state.phase !== 'complete') return;
    router.replace({
      pathname: '/scenario/[id]/outcome',
      params: { id: scenario.id, choices: encodeChoices(state.choices), runId },
    });
  }, [state.phase, state.choices, scenario.id, runId]);

  const confirmAbort = useCallback(() => {
    Alert.alert('Abort simulation?', 'Progress in this run will be lost.', [
      { text: 'Continue', style: 'cancel' },
      { text: 'Abort', style: 'destructive', onPress: () => router.back() },
    ]);
    return true;
  }, []);

  // Android hardware back goes through the same confirmation as the nav bar button.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', confirmAbort);
    return () => subscription.remove();
  }, [confirmAbort]);

  const scrollRef = useRef<ScrollView>(null);

  // Bring the consequence into view once an order is locked; start each new step at the top.
  useEffect(() => {
    if (state.phase === 'reviewing') {
      const id = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
      return () => clearTimeout(id);
    }
    if (state.phase === 'deciding') scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [state.phase, state.stepIndex]);

  const optionState = (optionId: string): OptionCardState => {
    if (isReviewing) return committed?.option?.id === optionId ? 'active' : 'dimmed';
    return state.selectedId === optionId ? 'active' : 'default';
  };

  const impact = committed?.option?.impact ?? TIMEOUT_PENALTY;
  const isLastStep = state.stepIndex === stepCount - 1;

  return (
    <ScreenContainer
      scrollRef={scrollRef}
      header={<NavBar title={scenario.title} leftIcon="arrow-left" onLeftPress={confirmAbort} />}
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
          {isReviewing ? (
            <Button
              title={isLastStep ? 'View Outcome' : 'Next Decision'}
              icon="arrow-right"
              size="lg"
              onPress={() => {
                haptics.selection();
                dispatch({ type: 'NEXT', stepCount });
              }}
            />
          ) : (
            <Button
              title="Lock In Decision"
              icon="send"
              size="lg"
              disabled={!state.selectedId}
              onPress={() => {
                haptics.impact();
                dispatch({ type: 'CONFIRM' });
              }}
            />
          )}
        </View>
      }>
      <View style={styles.progressRow}>
        <Text style={[styles.hud, { color: theme.colors.primary }]}>
          {`DECISION ${String(state.stepIndex + 1).padStart(2, '0')} / ${String(stepCount).padStart(2, '0')}`}
        </Text>
        <View style={styles.stepDots}>
          {scenario.steps.map((s, i) => (
            <View
              key={s.id}
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    i <= state.stepIndex ? theme.colors.primary : theme.colors.surfaceElevated,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <TimerBar
        progress={remainingMs / (step.timeLimitSec * 1000)}
        label={isReviewing ? 'ORDER LOCKED' : 'DECISION WINDOW'}
        trailingLabel={formatCountdown(remainingMs)}
        criticalBelow={0.3}
        animationMs={100}
        countdown
        style={styles.timer}
      />

      {/* Keyed by step so each new decision animates in. */}
      <View key={step.id}>
        <FadeIn>
          <HudCard
            tag={`SITREP // ${step.id.toUpperCase()}`}
            title={step.prompt}
            description={step.context}
          />
        </FadeIn>

        <View accessibilityRole="radiogroup">
          {step.options.map((option, index) => (
            <FadeIn key={option.id} delay={80 + index * 60}>
              <OptionCard
                text={option.text}
                state={optionState(option.id)}
                onPress={() => {
                  if (isReviewing) return;
                  haptics.selection();
                  dispatch({ type: 'SELECT', optionId: option.id });
                }}
              />
            </FadeIn>
          ))}
        </View>
      </View>

      {isReviewing && committed && (
        <FadeIn>
          <HudCard
            tag={committed.option ? 'OUTCOME // ORDER EXECUTED' : 'OUTCOME // TIMEOUT'}
            title={committed.option ? 'Consequence' : 'No order issued'}
            description={committed.option?.consequence ?? TIMEOUT_CONSEQUENCE}
            chips={[
              `STABILITY ${formatDelta(impact.stability)}`,
              `TRUST ${formatDelta(impact.trust)}`,
            ]}
            alert={!committed.option}
            style={styles.consequence}>
            <View style={styles.metrics}>
              <MetricBar label="STABILITY" value={run.metrics.stability} delta={impact.stability} />
              <MetricBar label="PUBLIC TRUST" value={run.metrics.trust} delta={impact.trust} />
            </View>
          </HudCard>
        </FadeIn>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hud: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    letterSpacing: 2,
  },
  stepDots: {
    flexDirection: 'row',
    gap: 6,
  },
  stepDot: {
    width: 18,
    height: 4,
    borderRadius: 2,
  },
  timer: {
    marginBottom: 16,
  },
  consequence: {
    marginTop: 8,
  },
  metrics: {
    marginTop: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
