import type { ArchiveNode, CommanderVital, SystemModule } from '../types';
import type { Language } from '../i18n/languages';
import { ARCHIVE_NODES, COMMANDER_VITALS, SYSTEM_MODULES } from '../data/mockData';
import { localizeArchive, localizeModule, localizeVital } from './localize';

export { HEART_RATE_VITAL_ID } from '../data/mockData';

// Static dashboards: synchronous so the System and Vitals tabs render on the first frame.

export const getArchiveNodes = (language: Language): ArchiveNode[] =>
  ARCHIVE_NODES.map((node) => localizeArchive(node, language));

export const getSystemModules = (language: Language): SystemModule[] =>
  SYSTEM_MODULES.map((mod) => localizeModule(mod, language));

export const getCommanderVitals = (language: Language): CommanderVital[] =>
  COMMANDER_VITALS.map((vital) => localizeVital(vital, language));
