export const INTEL_DATA = [
  { id: '1', title: 'Rogue Drone Activity', location: 'Sector 7G', threat: 'High' },
  { id: '2', title: 'Encrypted Transmission', location: 'Unknown', threat: 'Medium' },
  { id: '3', title: 'Supply Drop Inbound', location: 'Alpha Base', threat: 'Low' },
];

export const SYSTEM_MODULES = [
  { id: '1', name: 'Mainframe Uplink', status: 'ONLINE', icon: 'server' as const, isWarning: false },
  { id: '2', name: 'Firewall Protocol', status: 'ACTIVE', icon: 'shield' as const, isWarning: false },
  { id: '3', name: 'Communication Relay', status: 'INTERRUPTED', icon: 'radio' as const, isWarning: true },
  { id: '4', name: 'Power Grid', status: 'STABLE', icon: 'zap' as const, isWarning: false },
];

export const COMMANDER_VITALS = [
  { label: 'Core Temperature', value: '42°C' },
  { label: 'Heart Rate', value: '84 BPM', highlight: true },
  { label: 'Radiation Level', value: '0.02 Sv', danger: true },
  { label: 'System Integrity', value: '98.4%', highlight: true },
];

