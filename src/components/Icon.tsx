import React from 'react';
import type { LucideIcon } from 'lucide-react-native';
// Deep imports keep the bundle limited to the icons we actually use (Metro does not tree-shake).
import Activity from 'lucide-react-native/icons/activity';
import AlarmClock from 'lucide-react-native/icons/alarm-clock';
import ArrowDown from 'lucide-react-native/icons/arrow-down';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import ArrowUp from 'lucide-react-native/icons/arrow-up';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import Atom from 'lucide-react-native/icons/atom';
import Bell from 'lucide-react-native/icons/bell';
import BellDot from 'lucide-react-native/icons/bell-dot';
import Briefcase from 'lucide-react-native/icons/briefcase';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import CircleCheck from 'lucide-react-native/icons/circle-check';
import Compass from 'lucide-react-native/icons/compass';
import Cpu from 'lucide-react-native/icons/cpu';
import Crosshair from 'lucide-react-native/icons/crosshair';
import Dna from 'lucide-react-native/icons/dna';
import FingerprintPattern from 'lucide-react-native/icons/fingerprint-pattern';
import Heart from 'lucide-react-native/icons/heart';
import Info from 'lucide-react-native/icons/info';
import LayoutGrid from 'lucide-react-native/icons/layout-grid';
import Leaf from 'lucide-react-native/icons/leaf';
import LineSquiggle from 'lucide-react-native/icons/line-squiggle';
import Lock from 'lucide-react-native/icons/lock';
import MapPin from 'lucide-react-native/icons/map-pin';
import Moon from 'lucide-react-native/icons/moon';
import Play from 'lucide-react-native/icons/play';
import Radio from 'lucide-react-native/icons/radio';
import RefreshCw from 'lucide-react-native/icons/refresh-cw';
import RotateCcwClock from 'lucide-react-native/icons/rotate-ccw-clock';
import Send from 'lucide-react-native/icons/send';
import Server from 'lucide-react-native/icons/server';
import Settings from 'lucide-react-native/icons/settings';
import Shield from 'lucide-react-native/icons/shield';
import ShieldAlert from 'lucide-react-native/icons/shield-alert';
import Smartphone from 'lucide-react-native/icons/smartphone';
import Sun from 'lucide-react-native/icons/sun';
import Timer from 'lucide-react-native/icons/timer';
import TrendingDown from 'lucide-react-native/icons/trending-down';
import TrendingUp from 'lucide-react-native/icons/trending-up';
import TriangleAlert from 'lucide-react-native/icons/triangle-alert';
import User from 'lucide-react-native/icons/user';
import Users from 'lucide-react-native/icons/users';
import Zap from 'lucide-react-native/icons/zap';

/**
 * Figma icon set (Lucide, 2px stroke) plus the few extra glyphs used by the screens.
 * `squiggle` is the brand mark used in the Nav Bar, Tab Bar and "Scenario Time" headers.
 */
const ICONS = {
  activity: Activity,
  'alarm-clock': AlarmClock,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-up-right': ArrowUpRight,
  atom: Atom,
  bell: Bell,
  'bell-dot': BellDot,
  briefcase: Briefcase,
  'check-circle': CircleCheck,
  'chevron-right': ChevronRight,
  compass: Compass,
  cpu: Cpu,
  crosshair: Crosshair,
  dna: Dna,
  fingerprint: FingerprintPattern,
  grid: LayoutGrid,
  heart: Heart,
  history: RotateCcwClock,
  info: Info,
  leaf: Leaf,
  lock: Lock,
  'map-pin': MapPin,
  moon: Moon,
  play: Play,
  radio: Radio,
  'refresh-cw': RefreshCw,
  send: Send,
  server: Server,
  settings: Settings,
  shield: Shield,
  'shield-alert': ShieldAlert,
  smartphone: Smartphone,
  squiggle: LineSquiggle,
  sun: Sun,
  timer: Timer,
  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  'alert-triangle': TriangleAlert,
  user: User,
  users: Users,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export interface IconProps {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
}

export const Icon = ({ name, size = 20, color, strokeWidth = 2 }: IconProps) => {
  const Glyph = ICONS[name];
  return <Glyph size={size} color={color} strokeWidth={strokeWidth} />;
};
