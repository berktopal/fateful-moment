import type { ChoiceOption, DecisionStep, Metrics, Rating, Scenario } from '../../types';

/** `null` means the decision timer expired before an option was committed. */
export type Choice = string | null;

export interface StepResult {
  step: DecisionStep;
  option: ChoiceOption | null;
  metricsAfter: Metrics;
}

export interface RunResult {
  metrics: Metrics;
  score: number;
  rating: Rating;
  timeouts: number;
  timeline: StepResult[];
}

export const INITIAL_METRICS: Metrics = { stability: 50, trust: 50 };

/** Indecision is itself a decision: a timed-out step costs both dials. */
export const TIMEOUT_PENALTY: Metrics = { stability: -10, trust: -10 };
export const TIMEOUT_CONSEQUENCE = 'No order was issued in time. Command paralysis costs ground.';

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export const applyImpact = (metrics: Metrics, impact: Metrics): Metrics => ({
  stability: clamp(metrics.stability + impact.stability),
  trust: clamp(metrics.trust + impact.trust),
});

export const scoreOf = (metrics: Metrics): number =>
  Math.round((metrics.stability + metrics.trust) / 2);

export const ratingFor = (score: number): Rating => {
  if (score >= 70) return 'DECISIVE';
  if (score >= 50) return 'CONTAINED';
  if (score >= 30) return 'COMPROMISED';
  return 'CATASTROPHIC';
};

export const RATING_COPY: Record<Rating, string> = {
  DECISIVE: 'Your command held the line. History will remember this night as a turning point.',
  CONTAINED: 'The crisis is contained, though not without cost. Order has been restored.',
  COMPROMISED: 'You survived the night, but trust and stability are badly shaken.',
  CATASTROPHIC: 'The situation spiralled beyond control. The consequences will echo for years.',
};

/**
 * Replays a run from the scenario definition and the committed choices. The outcome screen
 * derives everything from this, so results are reproducible from the URL alone.
 */
export const evaluateRun = (scenario: Scenario, choices: Choice[]): RunResult => {
  let metrics = INITIAL_METRICS;
  let timeouts = 0;

  const timeline = scenario.steps.map((step, index) => {
    const option = step.options.find((o) => o.id === choices[index]) ?? null;
    if (!option) timeouts += 1;
    metrics = applyImpact(metrics, option ? option.impact : TIMEOUT_PENALTY);
    return { step, option, metricsAfter: metrics };
  });

  const score = scoreOf(metrics);
  return { metrics, score, rating: ratingFor(score), timeouts, timeline };
};

const TIMEOUT_TOKEN = '-';

export const encodeChoices = (choices: Choice[]): string =>
  choices.map((c) => c ?? TIMEOUT_TOKEN).join(',');

export const decodeChoices = (param: string | string[] | undefined): Choice[] => {
  const raw = Array.isArray(param) ? param[0] : param;
  if (!raw) return [];
  return raw.split(',').map((c) => (c === TIMEOUT_TOKEN || c === '' ? null : c));
};

export const formatDelta = (value: number): string => (value > 0 ? `+${value}` : `${value}`);
