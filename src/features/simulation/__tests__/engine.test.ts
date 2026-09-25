import {
  applyImpact,
  decodeChoices,
  encodeChoices,
  evaluateRun,
  formatDelta,
  INITIAL_METRICS,
  ratingFor,
  TIMEOUT_PENALTY,
} from '../engine';
import type { Scenario } from '../../../types';

const scenario: Scenario = {
  id: 'test',
  title: 'Test',
  description: '',
  duration: '1:00 min',
  threatLevel: 'LOW',
  image: null,
  isActive: true,
  steps: [
    {
      id: 's1',
      prompt: 'One',
      context: '',
      timeLimitSec: 10,
      options: [
        { id: 'good', text: 'Good', impact: { stability: 20, trust: 20 }, consequence: '' },
        { id: 'bad', text: 'Bad', impact: { stability: -40, trust: -40 }, consequence: '' },
      ],
    },
    {
      id: 's2',
      prompt: 'Two',
      context: '',
      timeLimitSec: 10,
      options: [{ id: 'ok', text: 'Ok', impact: { stability: 5, trust: -5 }, consequence: '' }],
    },
  ],
};

describe('applyImpact', () => {
  it('adds deltas', () => {
    expect(applyImpact({ stability: 50, trust: 50 }, { stability: 10, trust: -20 })).toEqual({
      stability: 60,
      trust: 30,
    });
  });

  it('clamps to the 0–100 range', () => {
    expect(applyImpact({ stability: 95, trust: 5 }, { stability: 20, trust: -20 })).toEqual({
      stability: 100,
      trust: 0,
    });
  });
});

describe('ratingFor', () => {
  it.each([
    [100, 'DECISIVE'],
    [70, 'DECISIVE'],
    [69, 'CONTAINED'],
    [50, 'CONTAINED'],
    [49, 'COMPROMISED'],
    [30, 'COMPROMISED'],
    [29, 'CATASTROPHIC'],
    [0, 'CATASTROPHIC'],
  ])('maps score %i to %s', (score, rating) => {
    expect(ratingFor(score)).toBe(rating);
  });
});

describe('evaluateRun', () => {
  it('replays choices into final metrics, score and rating', () => {
    const result = evaluateRun(scenario, ['good', 'ok']);
    expect(result.metrics).toEqual({ stability: 75, trust: 65 });
    expect(result.score).toBe(70);
    expect(result.rating).toBe('DECISIVE');
    expect(result.timeouts).toBe(0);
    expect(result.timeline.map((t) => t.option?.id)).toEqual(['good', 'ok']);
  });

  it('applies the timeout penalty for null or unknown choices', () => {
    const result = evaluateRun(scenario, [null, 'does-not-exist']);
    expect(result.timeouts).toBe(2);
    expect(result.metrics).toEqual({
      stability: INITIAL_METRICS.stability + 2 * TIMEOUT_PENALTY.stability,
      trust: INITIAL_METRICS.trust + 2 * TIMEOUT_PENALTY.trust,
    });
  });

  it('records the running metrics after each step', () => {
    const result = evaluateRun(scenario, ['bad', 'ok']);
    expect(result.timeline[0].metricsAfter).toEqual({ stability: 10, trust: 10 });
    expect(result.timeline[1].metricsAfter).toEqual({ stability: 15, trust: 5 });
    expect(result.rating).toBe('CATASTROPHIC');
  });
});

describe('choice encoding', () => {
  it('round-trips choices including timeouts', () => {
    const choices = ['a', null, 'c'];
    expect(encodeChoices(choices)).toBe('a,-,c');
    expect(decodeChoices(encodeChoices(choices))).toEqual(choices);
  });

  it('handles missing and array params', () => {
    expect(decodeChoices(undefined)).toEqual([]);
    expect(decodeChoices(['x,y', 'ignored'])).toEqual(['x', 'y']);
  });
});

it('formats signed deltas', () => {
  expect(formatDelta(5)).toBe('+5');
  expect(formatDelta(-5)).toBe('-5');
  expect(formatDelta(0)).toBe('0');
});
