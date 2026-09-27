import type { ImageProps } from 'expo-image';
import type { IconName } from '../components/Icon';
import type { LocalizedText } from '../i18n/languages';

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
  id: string;
  label: string;
  value: string;
  highlight?: boolean;
  danger?: boolean;
}

/** Explore tab "Decision Matrix" protocol toggle. */
export interface ProtocolOption {
  id: string;
  text: string;
  /** The protocol shown as active until the player picks another. */
  isDefault?: boolean;
}

/*
 * Source records as authored in the data layer: every piece of copy exists in all supported
 * languages. Repositories resolve them into the single-language shapes above.
 */

export type Localize<T, K extends keyof T> = Omit<T, K> & { [P in K]: LocalizedText };

export type ChoiceOptionSource = Localize<ChoiceOption, 'text' | 'consequence'>;

export interface DecisionStepSource
  extends Omit<Localize<DecisionStep, 'prompt' | 'context'>, 'options'> {
  options: ChoiceOptionSource[];
}

export interface ScenarioSource
  extends Omit<Localize<Scenario, 'title' | 'description'>, 'duration' | 'steps'> {
  durationMin: number;
  steps: DecisionStepSource[];
}

export type IntelItemSource = Localize<IntelItem, 'title' | 'location'>;
export type SystemModuleSource = Localize<SystemModule, 'name' | 'status'>;
export type ArchiveNodeSource = Localize<ArchiveNode, 'title'>;
export type CommanderVitalSource = Localize<CommanderVital, 'label' | 'value'>;
export type ProtocolOptionSource = Localize<ProtocolOption, 'text'>;
