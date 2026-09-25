import type { ImageProps } from 'expo-image';
import type { IconName } from '../components/Icon';

/** Anything `expo-image` can render: bundled `require()` assets or remote URIs. */
export type MediaSource = ImageProps['source'];

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** The two dials every decision moves. Both run from 0 to 100. */
export interface Metrics {
  stability: number;
  trust: number;
}

export interface ChoiceOption {
  id: string;
  text: string;
  /** Deltas applied to the running metrics when this option is locked in. */
  impact: Metrics;
  consequence: string;
}

export interface DecisionStep {
  id: string;
  prompt: string;
  context: string;
  timeLimitSec: number;
  options: ChoiceOption[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  /** Display string in the Figma HUD format, e.g. "15:00 min". */
  duration: string;
  threatLevel: ThreatLevel;
  image: MediaSource;
  isActive: boolean;
  steps: DecisionStep[];
}

export type Rating = 'DECISIVE' | 'CONTAINED' | 'COMPROMISED' | 'CATASTROPHIC';

export interface MissionRecord {
  id: string;
  scenarioId: string;
  score: number;
  rating: Rating;
  completedAt: number;
}

export interface IntelItem {
  id: string;
  title: string;
  location: string;
  threat: 'Low' | 'Medium' | 'High';
}

export interface SystemModule {
  id: string;
  name: string;
  status: string;
  icon: IconName;
  isWarning: boolean;
}

export interface ArchiveNode {
  id: string;
  title: string;
  scenarioCount: number;
  image: MediaSource;
}

export interface CommanderVital {
  label: string;
  value: string;
  highlight?: boolean;
  danger?: boolean;
}

/** Explore tab "Decision Matrix" protocol toggle. */
export interface ProtocolOption {
  id: string;
  text: string;
}
