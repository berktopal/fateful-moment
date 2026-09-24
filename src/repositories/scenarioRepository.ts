import { Scenario } from '../types';
import { FEATURED_SCENARIO, SCENARIOS } from '../data/mockData';

export const getFeaturedScenario = async (): Promise<Scenario> => {
  // Simulated async latency for production network emulation
  await new Promise((resolve) => setTimeout(resolve, 50));
  return FEATURED_SCENARIO;
};

export const getScenarios = async (): Promise<Scenario[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return SCENARIOS;
};

