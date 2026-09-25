import type { Scenario } from '../types';
import { FEATURED_SCENARIO_ID, SCENARIOS } from '../data/mockData';
import { simulateLatency } from './latency';

export const getFeaturedScenario = async (): Promise<Scenario> => {
  await simulateLatency();
  const featured = SCENARIOS.find((s) => s.id === FEATURED_SCENARIO_ID);
  if (!featured) throw new Error(`Featured scenario "${FEATURED_SCENARIO_ID}" is missing.`);
  return featured;
};

/** All scenarios except the featured one, which the Home screen renders as the hero card. */
export const getScenarios = async (): Promise<Scenario[]> => {
  await simulateLatency();
  return SCENARIOS.filter((s) => s.id !== FEATURED_SCENARIO_ID);
};

/**
 * Synchronous lookup for route screens. The data is local, so screens that receive an id
 * from the URL can render on the first frame instead of flashing a spinner.
 */
export const findScenario = (id: string | undefined): Scenario | undefined =>
  SCENARIOS.find((s) => s.id === id);
