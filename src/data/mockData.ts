import { Scenario, IntelItem, SystemModule, CommanderVital, DecisionOption } from '../types';

export const FEATURED_SCENARIO: Scenario = {
  id: 'featured-1',
  title: 'Global Crisis',
  description: 'A worldwide alert has been triggered. Assemble your team, analyze the threat vectors, and execute the protocol that will define the fate of millions.',
  duration: '45:00 min',
  threatLevel: 'CRITICAL',
  imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop',
  isActive: true,
};

export const SCENARIOS: Scenario[] = [
  {
    id: '1',
    title: 'Operation Midnight',
    description: 'Infiltrate the secure compound and extract the VIP before dawn. Stealth is critical, every choice matters.',
    duration: '15:00 min',
    threatLevel: 'HIGH',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2000&auto=format&fit=crop',
    isActive: true,
  },
  {
    id: '2',
    title: 'Cyber Heist',
    description: 'Breach the mainframe of a mega-corporation. Hack the firewalls, avoid detection, and secure the encrypted payload.',
    duration: '25:00 min',
    threatLevel: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop',
    isActive: false, // Locked / passive
  },
  {
    id: '3',
    title: 'Fallout Rescue',
    description: 'Navigate through a post-apocalyptic wasteland to rescue operatives trapped in a compromised subterranean bunker.',
    duration: '40:00 min',
    threatLevel: 'CRITICAL',
    imageUrl: 'https://images.unsplash.com/photo-1483086431886-3590a88317fe?q=80&w=2000&auto=format&fit=crop',
    isActive: false, // Locked / passive
  },
];

export const DECISION_OPTIONS: DecisionOption[] = [
  { id: '1', text: 'Hold tactical position & observe' },
  { id: '2', text: 'Initiate satellite scanning protocol' },
  { id: '3', text: 'Authorize direct engagement' },
];

export const INTEL_DATA: IntelItem[] = [
  { id: '1', title: 'Rogue Drone Activity', location: 'Sector 7G', threat: 'High' },
  { id: '2', title: 'Encrypted Transmission', location: 'Unknown', threat: 'Medium' },
  { id: '3', title: 'Supply Drop Inbound', location: 'Alpha Base', threat: 'Low' },
];

export const SYSTEM_MODULES: SystemModule[] = [
  { id: '1', name: 'Mainframe Uplink', status: 'ONLINE', icon: 'server' as const, isWarning: false },
  { id: '2', name: 'Firewall Protocol', status: 'ACTIVE', icon: 'shield' as const, isWarning: false },
  { id: '3', name: 'Communication Relay', status: 'INTERRUPTED', icon: 'radio' as const, isWarning: true },
  { id: '4', name: 'Power Grid', status: 'STABLE', icon: 'zap' as const, isWarning: false },
];

export const COMMANDER_VITALS: CommanderVital[] = [
  { label: 'Core Temperature', value: '42°C' },
  { label: 'Heart Rate', value: '84 BPM', highlight: true },
  { label: 'Radiation Level', value: '0.02 Sv', danger: true },
  { label: 'System Integrity', value: '98.4%', highlight: true },
];
