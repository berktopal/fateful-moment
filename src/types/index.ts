import { Feather } from '@expo/vector-icons';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  duration: string;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  imageUrl: string;
  isActive: boolean;
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
  icon: keyof typeof Feather.glyphMap;
  isWarning: boolean;
}

export interface CommanderVital {
  label: string;
  value: string;
  highlight?: boolean;
  danger?: boolean;
}

export interface DecisionOption {
  id: string;
  text: string;
}

