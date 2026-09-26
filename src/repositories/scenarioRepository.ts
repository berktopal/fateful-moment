import type { Scenario } from '../types';
import type { Language } from '../i18n/languages';
import { FEATURED_SCENARIO_ID, SCENARIOS } from '../data/mockData';
import { simulateLatency } from './latency';
import { localizeScenario } from './localize';

export const getFeaturedScenario = async (language: Language): Promise<Scenario> => {
  await simulateLatency();
  const featured = SCENARIOS.find((s) => s.id === FEATURED_SCENARIO_ID);
  if (!featured) throw new Error(`Featured scenario "${FEATURED_SCENARIO_ID}" is missing.`);
  return localizeScenario(featured, language);
};

/** All scenarios except the featured one, which the Home screen renders as the hero card. */
export const getScenarios = async (language: Language): Promise<Scenario[]> => {
  await simulateLatency();
  return SCENARIOS.filter((s) => s.id !== FEATURED_SCENARIO_ID).map((s) =>
    localizeScenario(s, language)
  );
};

/**
 * Synchronous lookup for route screens. The data is local, so screens that receive an id
 * from the URL can render on the first frame instead of flashing a spinner.
 */
export const findScenario = (id: string | undefined, language: Language): Scenario | undefined => {
  const source = SCENARIOS.find((s) => s.id === id);
  return source && localizeScenario(source, language);
};
