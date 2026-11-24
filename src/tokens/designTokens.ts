/**
 * PANKH Aviation Intelligence Design Tokens
 * Centralized design constants matching the aerospace & satellite intelligence visual language.
 */

export const PANKH_COLORS = {
  background: {
    abyss: '#050811',      // Viewport ground
    canvas: '#090e1a',     // Base platform backdrop
    panel: '#0d1525',      // Standard surface
    panelElevated: '#121d33', // Raised cards & modals
    panelHover: '#172540', // Hover state
  },
  borders: {
    subtle: 'rgba(255, 255, 255, 0.07)',
    medium: '#1f3152',
    interactive: '#2b426d',
    activeCyan: 'rgba(0, 240, 255, 0.4)',
    warningAmber: 'rgba(245, 158, 11, 0.4)',
    criticalCrimson: 'rgba(239, 68, 68, 0.4)',
  },
  accents: {
    cyan: {
      primary: '#00f0ff',
      hover: '#38bdf8',
      glow: 'rgba(0, 240, 255, 0.25)',
      subtle: 'rgba(0, 240, 255, 0.08)',
    },
    aviation: {
      primary: '#3b82f6',
      subtle: 'rgba(59, 130, 246, 0.1)',
      deep: '#1e3a5f',
    },
    amber: {
      warning: '#f59e0b',
      subtle: 'rgba(245, 158, 11, 0.1)',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
    crimson: {
      critical: '#ef4444',
      subtle: 'rgba(239, 68, 68, 0.12)',
      glow: 'rgba(239, 68, 68, 0.25)',
    },
    emerald: {
      nominal: '#10b981',
      subtle: 'rgba(16, 185, 129, 0.1)',
    },
  },
  text: {
    heading: '#f8fafc',
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    muted: '#64748b',
    faint: '#475569',
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
    dotColor: 'bg-emerald-400',
    badgeBg: 'bg-emerald-950/40',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-300',
    glow: 'shadow-glow-emerald',
  },
  active: {
    label: 'Active Tracking',
    dotColor: 'bg-cyan-400',
    badgeBg: 'bg-cyan-950/40',
    badgeBorder: 'border-cyan-500/40',
    badgeText: 'text-cyan-300',
    glow: 'shadow-glow-cyan-sm',
  },
  investigating: {
    label: 'Investigating',
    dotColor: 'bg-aviation-400',
    badgeBg: 'bg-aviation-950/40',
    badgeBorder: 'border-aviation-500/30',
    badgeText: 'text-aviation-300',
  },
  warning: {
    label: 'Caution / Advisory',
    dotColor: 'bg-amber-400',
    badgeBg: 'bg-amber-950/40',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    glow: 'shadow-glow-amber',
  },
  critical: {
    label: 'Critical Alert',
    dotColor: 'bg-crimson-500',
    badgeBg: 'bg-crimson-950/40',
    badgeBorder: 'border-crimson-500/40',
    badgeText: 'text-crimson-300',
    glow: 'shadow-glow-crimson',
  },
  idle: {
    label: 'Standby',
    dotColor: 'bg-slate-500',
    badgeBg: 'bg-navy-800/60',
    badgeBorder: 'border-navy-700/60',
    badgeText: 'text-slate-400',
  },
};

export const LAYOUT = {
  sidebarWidthExpanded: 260,
  sidebarWidthCollapsed: 68,
  headerHeight: 56,
  maxContentWidth: 1680,
} as const;
