import { memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { View, StyleSheet, Alert, BackHandler, ScrollView } from 'react-native';
import { Text } from '../../../components/Text';
import { router, useLocalSearchParams } from 'expo-router';
import { NavBar } from '../../../components/NavBar';
import { ScreenContainer } from '../../../components/ScreenContainer';
import { ScreenFooter } from '../../../components/ScreenFooter';
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
import { useI18n } from '../../../i18n';
import type { Scenario } from '../../../types';

export default function SimulationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, language } = useI18n();
  const scenario = findScenario(id, language);

  if (!scenario || !scenario.isActive || scenario.steps.length === 0) {
    return (
      <ScreenContainer
        header={
          <NavBar
            title={t.play.title}
            left={{ icon: 'arrow-left', onPress: () => router.back(), accessibilityLabel: t.common.back }}
          />
        }
        error={t.play.unavailable}
        onRetry={() => router.back()}
        retryLabel={t.common.goBack}
      />
    );
  }

  return <Simulation scenario={scenario} />;
}

function Simulation({ scenario }: { scenario: Scenario }) {
  const { theme } = useTheme();
  const { t, upper } = useI18n();
  const haptics = useHaptics();
  const appActive = useAppActive();
  const [state, dispatch] = useReducer(simulationReducer, initialSimulationState);
  // Stable id for this run, so the outcome screen records it exactly once.
  const [runId] = useState(() => `${scenario.id}-${Date.now()}`);
  // The clock stops while the abort confirmation is open: reading a dialog must not cost the decision.
  const [confirmingAbort, setConfirmingAbort] = useState(false);

  const stepCount = scenario.steps.length;
  const step = scenario.steps[state.stepIndex];
  const isReviewing = state.phase === 'reviewing';

  const handleExpire = useCallback(() => {
    haptics.warning();
    dispatch({ type: 'TIMEOUT' });
  }, [haptics]);

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
    setConfirmingAbort(true);
    const resume = () => setConfirmingAbort(false);
    Alert.alert(
      t.play.abortTitle,
      t.play.abortBody,
      [
        { text: t.play.continue, style: 'cancel', onPress: resume },
        { text: t.play.abort, style: 'destructive', onPress: () => router.back() },
      ],
      // Android: back / tapping outside dismisses the dialog without pressing a button.
      { cancelable: true, onDismiss: resume },
    );
    return true;
  }, [t]);

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
      header={
        <NavBar
          title={scenario.title}
          left={{ icon: 'arrow-left', onPress: confirmAbort, accessibilityLabel: t.common.back }}
        />
      }
      footer={
        <ScreenFooter>
          {/* One Button for both actions, on purpose: its double-tap guard then also stops the
              second tap of a "Lock In" double tap from skipping straight past the consequence. */}
          <Button
            title={isReviewing ? (isLastStep ? t.play.viewOutcome : t.play.nextDecision) : t.play.lockIn}
            icon={isReviewing ? 'arrow-right' : 'send'}
            size="lg"
            disabled={!isReviewing && !state.selectedId}
            onPress={() => {
              if (isReviewing) {
                haptics.selection();
                dispatch({ type: 'NEXT', stepCount });
              } else {
                haptics.impact();
                dispatch({ type: 'CONFIRM' });
              }
            }}
          />
        </ScreenFooter>
      }>
      <View style={styles.progressRow}>
        <Text style={[styles.hud, { color: theme.colors.primary }]}>
          {t.play.counter(state.stepIndex + 1, stepCount)}
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

      <DecisionTimer
        totalMs={step.timeLimitSec * 1000}
        running={state.phase === 'deciding' && appActive && !confirmingAbort}
        resetKey={step.id}
        onExpire={handleExpire}
        label={isReviewing ? t.play.orderLocked : t.play.decisionWindow}
      />

      {/* Keyed by step so each new decision animates in. */}
      <View key={step.id}>
        <FadeIn>
          <HudCard
            tag={t.play.sitrep(upper(step.id))}
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
            tag={committed.option ? t.play.executedTag : t.play.timeoutTag}
            title={committed.option ? t.play.consequence : t.play.noOrder}
            description={committed.option?.consequence ?? t.play.timeoutConsequence}
            chips={[
              t.metrics.stabilityDelta(impact.stability),
              t.metrics.trustDelta(impact.trust),
            ]}
            alert={!committed.option}
            style={styles.consequence}>
            <View style={styles.metrics}>
              <MetricBar label={t.metrics.stability} value={run.metrics.stability} delta={impact.stability} />
              <MetricBar label={t.metrics.trust} value={run.metrics.trust} delta={impact.trust} />
            </View>
          </HudCard>
        </FadeIn>
      )}
    </ScreenContainer>
  );
}

interface DecisionTimerProps {
  totalMs: number;
  running: boolean;
  resetKey: string;
  onExpire: () => void;
  label: string;
}

/**
 * Owns the ticking countdown. It updates 10× a second; kept in the screen, that state re-rendered
 * every card and option on each tick. Memoised, so the screen's own re-renders don't reach it
 * either unless its props change.
 */
const DecisionTimer = memo(function DecisionTimer({
  totalMs,
  running,
  resetKey,
  onExpire,
  label,
}: DecisionTimerProps) {
  const remainingMs = useCountdown(totalMs, running, resetKey, onExpire);
  return (
    <TimerBar
      progress={remainingMs / totalMs}
      label={label}
      trailingLabel={formatCountdown(remainingMs)}
      criticalBelow={0.3}
      animationMs={100}
      countdown
      style={styles.timer}
    />
  );
});

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
});
