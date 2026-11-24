import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  FileSearch,
  History,
  Workflow,
  Plane,
  FlaskConical,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Tooltip } from '@/components/ui/Tooltip';
import { Badge } from '@/components/ui/Badge';
import { type StatusLevel } from '@/tokens/designTokens';

export interface NavItemDef {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: StatusLevel;
  description: string;
}

export const MAIN_NAV_ITEMS: NavItemDef[] = [
  {
    id: 'mission-control',
    label: 'Mission Control',
    path: '/app/mission-control',
    icon: Radar,
    badgeVariant: 'active',
    description: 'Central dashboard & live telemetry overview',
  },
  {
    id: 'investigations',
    label: 'Incident Library',
    path: '/app/investigations',
    icon: FileSearch,
    badge: 'Curated',
    badgeVariant: 'active',
    description: 'Curated incident reports & investigation dossiers',
  },
  {
    id: 'my-investigations',
    label: 'My Investigations',
    path: '/app/my-investigations',
    icon: History,
    badgeVariant: 'nominal',
    description: 'Investigation progress & simulation debrief history',
  },
  {
    id: 'scenario-forge',
    label: 'Scenario Forge',
    path: '/app/scenario-forge',
    icon: Workflow,
    description: 'Incident-informed scenario builder',
  },
  {
    id: 'simulation-lab',
    label: 'Simulation Lab',
    path: '/app/simulation-lab',
    icon: Plane,
    badgeVariant: 'nominal',
    description: 'Simulation execution & trajectory inspection',
  },
  {
    id: 'experiments',
    label: 'Experiments',
    path: '/app/experiments',
    icon: FlaskConical,
    description: 'Controller stress tests & benchmark metrics',
  },
];

export const SECONDARY_NAV_ITEMS: NavItemDef[] = [
  {
    id: 'design-system',
    label: 'Design System',
    path: '/app/design-system',
    icon: Layers,
    description: 'UI tokens, primitives & interactive showcase',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/app/settings',
    icon: Settings,
    description: 'Preferences, telemetry & API keys',
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggle = onToggleCollapse || (() => setInternalCollapsed((prev) => !prev));
  const location = useLocation();

  return (
    <aside
      className={cn(
        'h-screen bg-navy-950/95 border-r border-navy-700/60 backdrop-blur-xl flex flex-col justify-between shrink-0 transition-all duration-300 z-30 select-none relative',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Top Branding Section */}
      <div>
        <div className="h-14 px-3 flex items-center justify-between border-b border-navy-700/60">
          <NavLink to="/" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="w-8 h-8 rounded-panel bg-navy-900 border border-cyan-500/40 flex items-center justify-center shrink-0 group-hover:border-cyan-400 shadow-glow-cyan-sm transition-colors">
              <img src="/pankh-logo.svg" alt="PANKH" className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  className="flex flex-col min-w-0"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-sm tracking-wider text-white">
                      PANKH
                    </span>
                    <span className="px-1 py-0.2 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 text-2xs font-mono">
                      v0.1
                    </span>
                  </div>
                  <span className="text-2xs text-slate-400 font-mono tracking-widest uppercase truncate">
                    Aero Intelligence
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>

          <button
            type="button"
            onClick={toggle}
            className="p-1.5 rounded-subtle text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Navigation Links */}
        <div className="p-2 space-y-1">
          <div className={cn('px-2 py-1.5 text-2xs font-mono uppercase tracking-widest text-slate-500', isCollapsed && 'sr-only')}>
            Research Modules
          </div>

          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            const linkContent = (
              <NavLink
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-2.5 py-2 rounded-panel text-xs transition-colors duration-150 relative group',
                  isActive
                    ? 'text-cyan-300 bg-navy-850 border border-cyan-500/30 font-medium shadow-glow-cyan-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900/80 border border-transparent'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <Badge variant={item.badgeVariant || 'default'} size="sm">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </NavLink>
            );

            return isCollapsed ? (
              <Tooltip key={item.id} content={item.label} side="right">
                {linkContent}
              </Tooltip>
            ) : (
              <div key={item.id}>{linkContent}</div>
            );
          })}
        </div>

        {/* Secondary Navigation Section */}
        <div className="p-2 space-y-1 border-t border-navy-800/80 mt-2">
          <div className={cn('px-2 py-1.5 text-2xs font-mono uppercase tracking-widest text-slate-500', isCollapsed && 'sr-only')}>
            Platform & Tools
          </div>

          {SECONDARY_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            const linkContent = (
              <NavLink
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-2.5 py-2 rounded-panel text-xs transition-colors duration-150 group',
                  isActive
                    ? 'text-cyan-300 bg-navy-850 border border-cyan-500/30 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900/80 border border-transparent'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-cyan-400' : 'text-slate-400')} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );

            return isCollapsed ? (
              <Tooltip key={item.id} content={item.label} side="right">
                {linkContent}
              </Tooltip>
            ) : (
              <div key={item.id}>{linkContent}</div>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-2 border-t border-navy-700/60 bg-navy-900/50">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="p-2 rounded-panel bg-navy-900 border border-navy-800 text-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="font-mono uppercase tracking-wider text-2xs">Mode</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  RESEARCH
                </span>
              </div>
              <p className="text-2xs text-slate-500 leading-tight">
                Academic safety simulation sandbox. Non-certified.
              </p>
            </div>

            <NavLink
              to="/"
              className="flex items-center justify-between px-2 py-1.5 rounded text-2xs text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <span>Public Landing Page</span>
              <ExternalLink className="w-3 h-3" />
            </NavLink>
          </div>
        ) : (
          <Tooltip content="Research Mode: Active" side="right">
            <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-panel bg-navy-900 border border-navy-800 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
          </Tooltip>
        )}
      </div>
    </aside>
  );
};
