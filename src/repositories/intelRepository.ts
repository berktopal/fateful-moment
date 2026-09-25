import type { IntelItem, ProtocolOption } from '../types';
import { INTEL_DATA, PROTOCOL_OPTIONS } from '../data/mockData';
import { simulateLatency } from './latency';

export const getIntelData = async (): Promise<IntelItem[]> => {
  await simulateLatency();
  return INTEL_DATA;
};

export const getProtocolOptions = async (): Promise<ProtocolOption[]> => {
  await simulateLatency();
  return PROTOCOL_OPTIONS;
};
