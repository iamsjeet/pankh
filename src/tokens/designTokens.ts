/**
 * PANKH Aviation Research Studio Design Tokens
 * Light-first editorial palette (#F3F1EB / #17191B / #C8F169) with selective dark surfaces.
 */

export const PANKH_COLORS = {
  background: {
    light: '#F3F1EB',
    paper: '#FAF9F6',
    muted: '#E7E5DE',
    dark: '#17191B',
    darkElevated: '#222529',
  },
  borders: {
    hairline: 'rgba(23, 25, 27, 0.12)',
    strong: 'rgba(23, 25, 27, 0.24)',
    darkHairline: 'rgba(243, 241, 235, 0.12)',
    accentLime: 'rgba(166, 217, 74, 0.5)',
  },
  accents: {
    lime: '#C8F169',
    limeDark: '#A6D94A',
    amber: '#D97706',
    crimson: '#DC2626',
    emerald: '#16A34A',
  },
  text: {
    primary: '#17191B',
    secondary: '#747570',
    muted: '#9A9B95',
    onDark: '#F3F1EB',
    onDarkMuted: '#9A9B95',
  },
} as const;

export type StatusLevel = 'nominal' | 'active' | 'investigating' | 'warning' | 'critical' | 'idle';

export interface StatusConfig {
  label: string;
  dotColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  glow?: string;
}

export const STATUS_CONFIGS: Record<StatusLevel, StatusConfig> = {
  nominal: {
    label: 'Nominal',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-100/80',
    badgeBorder: 'border-emerald-600/25',
    badgeText: 'text-emerald-700',
  },
  active: {
    label: 'Active',
    dotColor: 'bg-lime-500',
    badgeBg: 'bg-lime-400/35',
    badgeBorder: 'border-lime-600/35',
    badgeText: 'text-obsidian-950',
  },
  investigating: {
    label: 'Investigating',
    dotColor: 'bg-obsidian-700',
    badgeBg: 'bg-sand-100',
    badgeBorder: 'border-obsidian-950/20',
    badgeText: 'text-obsidian-950',
  },
  warning: {
    label: 'Caution / Advisory',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-100/80',
    badgeBorder: 'border-amber-600/30',
    badgeText: 'text-amber-700',
  },
  critical: {
    label: 'Critical',
    dotColor: 'bg-crimson-500',
    badgeBg: 'bg-crimson-100/80',
    badgeBorder: 'border-crimson-600/30',
    badgeText: 'text-crimson-700',
  },
  idle: {
    label: 'Standby',
    dotColor: 'bg-stone-400',
    badgeBg: 'bg-sand-100',
    badgeBorder: 'border-obsidian-950/15',
    badgeText: 'text-stone-600',
  },
};

export const LAYOUT = {
  sidebarWidthExpanded: 256,
  sidebarWidthCollapsed: 68,
  headerHeight: 60,
  maxContentWidth: 1560,
} as const;
