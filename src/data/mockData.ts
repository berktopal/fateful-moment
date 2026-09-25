import type {
  ArchiveNode,
  CommanderVital,
  IntelItem,
  ProtocolOption,
  Scenario,
  SystemModule,
} from '../types';

// Imagery is bundled (not fetched) so the app works offline and cards never render empty.
const IMAGES = {
  globalCrisis: require('../../assets/images/global-crisis.jpg'),
  operationMidnight: require('../../assets/images/operation-midnight.jpg'),
  cyberHeist: require('../../assets/images/cyber-heist.jpg'),
  falloutRescue: require('../../assets/images/fallout-rescue.jpg'),
  alphaNode: require('../../assets/images/alpha-node.jpg'),
  betaNode: require('../../assets/images/beta-node.jpg'),
  deltaNode: require('../../assets/images/delta-node.jpg'),
  omegaNode: require('../../assets/images/omega-node.jpg'),
};

export const TERRAIN_MAP_IMAGE = require('../../assets/images/terrain-map.jpg');
export const OPERATIVE_AVATAR = require('../../assets/images/operative-avatar.jpg');

export const FEATURED_SCENARIO_ID = 'global-crisis';

export const SCENARIOS: Scenario[] = [
  {
    id: 'global-crisis',
    title: 'Global Crisis',
    description:
      'A worldwide alert has been triggered. Assemble your team, analyze the threat vectors, and execute the protocol that will define the fate of millions.',
    duration: '45:00 min',
    threatLevel: 'CRITICAL',
    image: IMAGES.globalCrisis,
    isActive: true,
    steps: [
      {
        id: 'gc-1',
        prompt: 'Satellite grid goes dark',
        context:
          'Three orbital relays stopped responding 90 seconds ago. Markets open in one hour and the press has already noticed.',
        timeLimitSec: 20,
        options: [
          {
            id: 'gc-1-a',
            text: 'Issue a calm public statement, investigate quietly',
            impact: { stability: 5, trust: 15 },
            consequence: 'Markets wobble but hold. The public appreciates the transparency.',
          },
          {
            id: 'gc-1-b',
            text: 'Impose a media blackout until the cause is known',
            impact: { stability: 10, trust: -15 },
            consequence: 'Rumours spread faster than facts. Order holds for now.',
          },
          {
            id: 'gc-1-c',
            text: 'Blame a foreign actor to rally the nation',
            impact: { stability: -15, trust: -10 },
            consequence: 'Tensions spike overnight and allies demand evidence you do not have.',
          },
        ],
      },
      {
        id: 'gc-2',
        prompt: 'Cyber intrusion confirmed',
        context:
          'Forensics traces the outage to a worm inside the ground stations. It is spreading to the power grid control network.',
        timeLimitSec: 18,
        options: [
          {
            id: 'gc-2-a',
            text: 'Isolate the grid and accept rolling blackouts',
            impact: { stability: 15, trust: -5 },
            consequence: 'The worm is contained. Millions sit in the dark for six hours.',
          },
          {
            id: 'gc-2-b',
            text: 'Keep the grid online and hunt the worm live',
            impact: { stability: -10, trust: 10 },
            consequence: 'Lights stay on, but two regional substations are lost.',
          },
          {
            id: 'gc-2-c',
            text: 'Request joint response from allied cyber commands',
            impact: { stability: 10, trust: 10 },
            consequence: 'Allied teams patch the stations within hours. A costly favour is owed.',
          },
        ],
      },
      {
        id: 'gc-3',
        prompt: 'The attacker makes contact',
        context:
          'An encrypted message demands a ransom to release the remaining satellites. The deadline is sunrise.',
        timeLimitSec: 15,
        options: [
          {
            id: 'gc-3-a',
            text: 'Refuse and launch replacement satellites',
            impact: { stability: 5, trust: 10 },
            consequence: 'Coverage returns in 48 hours. The world sees resolve, not weakness.',
          },
          {
            id: 'gc-3-b',
            text: 'Pay quietly and trace the funds',
            impact: { stability: 15, trust: -20 },
            consequence: 'Satellites return by dawn. The payment leaks a week later.',
          },
          {
            id: 'gc-3-c',
            text: 'Counter-hack the attacker infrastructure',
            impact: { stability: -5, trust: 5 },
            consequence: 'Half the network is recovered; the attackers vanish with the rest.',
          },
        ],
      },
    ],
  },
  {
    id: 'operation-midnight',
    title: 'Operation Midnight',
    description:
      'Infiltrate the secure compound and extract the VIP before dawn. Stealth is critical, every choice matters.',
    duration: '15:00 min',
    threatLevel: 'HIGH',
    image: IMAGES.operationMidnight,
    isActive: true,
    steps: [
      {
        id: 'om-1',
        prompt: 'Approach vector',
        context: 'Fog covers the valley. Thermal drones patrol the east wall every four minutes.',
        timeLimitSec: 20,
        options: [
          {
            id: 'om-1-a',
            text: 'Move through the river culvert',
            impact: { stability: 10, trust: 5 },
            consequence: 'Cold and slow, but the team reaches the wall unseen.',
          },
          {
            id: 'om-1-b',
            text: 'Jam the drones and go over the east wall',
            impact: { stability: -10, trust: 5 },
            consequence: 'The jammer works — and alerts the guard captain to interference.',
          },
          {
            id: 'om-1-c',
            text: 'Wait for the next patrol gap',
            impact: { stability: 5, trust: -5 },
            consequence: 'Safe, but twenty precious minutes are gone.',
          },
        ],
      },
      {
        id: 'om-2',
        prompt: 'Guard at the inner gate',
        context: 'A lone sentry blocks the only route to the VIP cell. He has not raised his radio.',
        timeLimitSec: 15,
        options: [
          {
            id: 'om-2-a',
            text: 'Create a distraction on the far side',
            impact: { stability: 5, trust: 10 },
            consequence: 'The sentry wanders off. Nobody is hurt.',
          },
          {
            id: 'om-2-b',
            text: 'Neutralise the guard silently',
            impact: { stability: 10, trust: -10 },
            consequence: 'The path is clear, but the shift change will find him.',
          },
          {
            id: 'om-2-c',
            text: 'Bluff through wearing a captured uniform',
            impact: { stability: -10, trust: 5 },
            consequence: 'He hesitates, then calls it in. The clock just got shorter.',
          },
        ],
      },
      {
        id: 'om-3',
        prompt: 'Extraction',
        context: 'VIP secured. Alarms are sounding in the north tower and the helicopter is 6 minutes out.',
        timeLimitSec: 12,
        options: [
          {
            id: 'om-3-a',
            text: 'Hold position and wait for air extraction',
            impact: { stability: -5, trust: 10 },
            consequence: 'A tense firefight, but everyone makes the helicopter.',
          },
          {
            id: 'om-3-b',
            text: 'Exfiltrate on foot back through the culvert',
            impact: { stability: 10, trust: 5 },
            consequence: 'The team disappears into the fog. The compound never finds them.',
          },
          {
            id: 'om-3-c',
            text: 'Commandeer a vehicle and break out',
            impact: { stability: -15, trust: -5 },
            consequence: 'The gate is rammed, the VIP is injured, and the mission goes loud.',
          },
        ],
      },
    ],
  },
  {
    id: 'cyber-heist',
    title: 'Cyber Heist',
    description:
      'Breach the mainframe of a mega-corporation. Hack the firewalls, avoid detection, and secure the encrypted payload.',
    duration: '25:00 min',
    threatLevel: 'MEDIUM',
    image: IMAGES.cyberHeist,
    isActive: true,
    steps: [
      {
        id: 'ch-1',
        prompt: 'Initial foothold',
        context: 'The perimeter firewall is patched. A contractor laptop still has VPN access.',
        timeLimitSec: 20,
        options: [
          {
            id: 'ch-1-a',
            text: 'Phish the contractor for credentials',
            impact: { stability: 10, trust: -5 },
            consequence: 'Credentials arrive within minutes. Someone will get fired for this.',
          },
          {
            id: 'ch-1-b',
            text: 'Exploit a zero-day in the VPN appliance',
            impact: { stability: -5, trust: 10 },
            consequence: 'Clean entry — but the zero-day is burned forever.',
          },
          {
            id: 'ch-1-c',
            text: 'Brute-force the admin portal',
            impact: { stability: -15, trust: -5 },
            consequence: 'The intrusion detection system lights up like a stadium.',
          },
        ],
      },
      {
        id: 'ch-2',
        prompt: 'Security team is hunting',
        context: 'A blue-team analyst flags unusual traffic and starts pulling logs.',
        timeLimitSec: 15,
        options: [
          {
            id: 'ch-2-a',
            text: 'Go dormant for an hour',
            impact: { stability: 10, trust: 5 },
            consequence: 'The analyst files it as a false positive.',
          },
          {
            id: 'ch-2-b',
            text: 'Wipe the logs and keep moving',
            impact: { stability: -10, trust: 0 },
            consequence: 'Missing logs are more suspicious than the traffic was.',
          },
          {
            id: 'ch-2-c',
            text: 'Plant a decoy intrusion elsewhere',
            impact: { stability: 5, trust: -5 },
            consequence: 'The team chases the decoy. A side system is damaged.',
          },
        ],
      },
      {
        id: 'ch-3',
        prompt: 'Payload exfiltration',
        context: 'The payload is 40 GB. Egress is monitored above 1 GB per hour.',
        timeLimitSec: 12,
        options: [
          {
            id: 'ch-3-a',
            text: 'Trickle it out over two days',
            impact: { stability: 10, trust: 5 },
            consequence: 'Slow and invisible. The payload is secured.',
          },
          {
            id: 'ch-3-b',
            text: 'Grab only the index and decryption keys',
            impact: { stability: 5, trust: 10 },
            consequence: 'The most valuable 2% leaves the building unnoticed.',
          },
          {
            id: 'ch-3-c',
            text: 'Pull everything at once',
            impact: { stability: -15, trust: -10 },
            consequence: 'The transfer is cut at 60% and the breach makes the news.',
          },
        ],
      },
    ],
  },
  {
    id: 'fallout-rescue',
    title: 'Fallout Rescue',
    description:
      'Navigate through a post-apocalyptic wasteland to rescue operatives trapped in a compromised subterranean bunker.',
    duration: '40:00 min',
    threatLevel: 'CRITICAL',
    image: IMAGES.falloutRescue,
    isActive: false, // Locked — demonstrates the Figma passive card state.
    steps: [],
  },
];

export const ARCHIVE_NODES: ArchiveNode[] = [
  { id: 'alpha', title: 'Alpha Node', scenarioCount: 12, image: IMAGES.alphaNode },
  { id: 'beta', title: 'Beta Node', scenarioCount: 8, image: IMAGES.betaNode },
  { id: 'delta', title: 'Delta Node', scenarioCount: 4, image: IMAGES.deltaNode },
  { id: 'omega', title: 'Omega Node', scenarioCount: 1, image: IMAGES.omegaNode },
];

export const PROTOCOL_OPTIONS: ProtocolOption[] = [
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
  { id: '1', name: 'Mainframe Uplink', status: 'ONLINE', icon: 'server', isWarning: false },
  { id: '2', name: 'Firewall Protocol', status: 'ACTIVE', icon: 'shield', isWarning: false },
  { id: '3', name: 'Communication Relay', status: 'INTERRUPTED', icon: 'radio', isWarning: true },
  { id: '4', name: 'Power Grid', status: 'STABLE', icon: 'zap', isWarning: false },
];

export const COMMANDER_VITALS: CommanderVital[] = [
  { label: 'Core Temperature', value: '42°C' },
  { label: 'Heart Rate', value: '84 BPM', highlight: true },
  { label: 'Radiation Level', value: '0.02 Sv', danger: true },
  { label: 'System Integrity', value: '98.4%', highlight: true },
];
