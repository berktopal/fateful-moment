import { IntelItem, DecisionOption } from '../types';
import { INTEL_DATA, DECISION_OPTIONS } from '../data/mockData';

export const getIntelData = async (): Promise<IntelItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return INTEL_DATA;
};

export const getDecisionOptions = async (): Promise<DecisionOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return DECISION_OPTIONS;
};

