import type { IntelItem, ProtocolOption } from '../types';
import type { Language } from '../i18n/languages';
import { INTEL_DATA, PROTOCOL_OPTIONS } from '../data/mockData';
import { simulateLatency } from './latency';
import { localizeIntel, localizeProtocol } from './localize';

export const getIntelData = async (language: Language): Promise<IntelItem[]> => {
  await simulateLatency();
  return INTEL_DATA.map((item) => localizeIntel(item, language));
};

export const getProtocolOptions = async (language: Language): Promise<ProtocolOption[]> => {
  await simulateLatency();
  return PROTOCOL_OPTIONS.map((option) => localizeProtocol(option, language));
};
