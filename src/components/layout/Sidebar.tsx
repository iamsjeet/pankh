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
  X,
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
    description: 'Platform overview & illustrative radar',
  },
  {
    id: 'investigations',
    label: 'Incident Library',
    path: '/app/investigations',
    icon: FileSearch,
    badge: 'Curated',
    badgeVariant: 'active',
    description: 'Historical incident reports & dossiers',
  },
  {
    id: 'my-investigations',
    label: 'My Investigations',
    path: '/app/my-investigations',
    icon: History,
    badgeVariant: 'nominal',
    description: 'Progress & simulation debrief history',
  },
  {
    id: 'scenario-forge',
    label: 'Scenario Forge',
    path: '/app/scenario-forge',
    icon: Workflow,
    description: 'Scenario parameters & evidence links',
  },
  {
    id: 'simulation-lab',
    label: 'Simulation Lab',
    path: '/app/simulation-lab',
    icon: Plane,
    badgeVariant: 'nominal',
    description: 'Deterministic playback & checkpoints',
  },
  {
    id: 'experiments',
    label: 'Experiments',
    path: '/app/experiments',
    icon: FlaskConical,
    description: 'Research benchmarks & metrics',
  },
];

export const SECONDARY_NAV_ITEMS: NavItemDef[] = [
  {
    id: 'design-system',
    label: 'Design System',
    path: '/app/design-system',
    icon: Layers,
    description: 'UI tokens & component primitives',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/app/settings',
    icon: Settings,
    description: 'Preferences & workspace storage',
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggle = onToggleCollapse || (() => setInternalCollapsed((prev) => !prev));
  const location = useLocation();

  const sidebarContent = (isMobile: boolean) => {
    const collapsed = isMobile ? false : isCollapsed;

    return (
      <div className="h-full flex flex-col justify-between bg-sand-25 border-r border-obsidian-950/12 select-none">
        <div>
          {/* Top Branding */}
          <div className="h-14 px-3.5 flex items-center justify-between border-b border-obsidian-950/10">
            <NavLink
              to="/"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 overflow-hidden group"
            >
              <div className="w-8 h-8 rounded-subtle bg-obsidian-950 flex items-center justify-center shrink-0">
                <img src="/pankh-logo.svg" alt="PANKH" className="w-4 h-4 brightness-200" />
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-sm tracking-tight text-obsidian-950">
                      PANKH
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-lime-400 text-obsidian-950 text-2xs font-mono font-semibold">
                      MVP
                    </span>
                  </div>
                  <span className="text-2xs text-stone-500 font-mono tracking-wider uppercase truncate">
                    Research Studio
                  </span>
                </div>
              )}
            </NavLink>

            {isMobile ? (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-subtle text-stone-500 hover:text-obsidian-950 hover:bg-sand-100"
                aria-label="Close navigation menu"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={toggle}
                className="p-1.5 rounded-subtle text-stone-500 hover:text-obsidian-950 hover:bg-sand-100 transition-colors"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Primary Navigation */}
          <div className="p-2.5 space-y-1">
            <div
              className={cn(
                'px-2.5 py-1.5 text-2xs font-mono uppercase tracking-widest text-stone-500',
                collapsed && 'sr-only'
              )}
            >
              Research Modules
            </div>

            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              const linkContent = (
                <NavLink
                  to={item.path}
                  onClick={onCloseMobile}
                  className={cn(
                    'flex items-center gap-3 px-2.5 py-2 rounded-panel text-xs transition-all duration-150 relative group',
                    isActive
                      ? 'bg-obsidian-950 text-sand-50 font-medium shadow-editorial'
                      : 'text-stone-600 hover:text-obsidian-950 hover:bg-sand-100'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-lime-400 rounded-r" />
                  )}
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-lime-400' : 'text-stone-500 group-hover:text-obsidian-950'
                    )}
                  />
                  {!collapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <Badge variant={isActive ? 'accent' : item.badgeVariant || 'default'} size="sm">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </NavLink>
              );

              return collapsed ? (
                <Tooltip key={item.id} content={item.label} side="right">
                  {linkContent}
                </Tooltip>
              ) : (
                <div key={item.id}>{linkContent}</div>
              );
            })}
          </div>

          {/* Secondary Navigation */}
          <div className="p-2.5 space-y-1 border-t border-obsidian-950/10 mt-1">
            <div
              className={cn(
                'px-2.5 py-1.5 text-2xs font-mono uppercase tracking-widest text-stone-500',
                collapsed && 'sr-only'
              )}
            >
              System
            </div>

            {SECONDARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              const linkContent = (
                <NavLink
                  to={item.path}
                  onClick={onCloseMobile}
                  className={cn(
                    'flex items-center gap-3 px-2.5 py-2 rounded-panel text-xs transition-all duration-150 group',
                    isActive
                      ? 'bg-obsidian-950 text-sand-50 font-medium'
                      : 'text-stone-600 hover:text-obsidian-950 hover:bg-sand-100'
                  )}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-lime-400' : 'text-stone-500')} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );

              return collapsed ? (
                <Tooltip key={item.id} content={item.label} side="right">
                  {linkContent}
                </Tooltip>
              ) : (
                <div key={item.id}>{linkContent}</div>
              );
            })}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="p-2.5 border-t border-obsidian-950/10 bg-sand-50/80">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="p-2.5 rounded-panel bg-sand-100/80 border border-obsidian-950/10 text-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="font-mono uppercase tracking-wider">Mode</span>
                  <span className="inline-flex items-center gap-1 text-obsidian-950 font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                    RESEARCH
                  </span>
                </div>
                <p className="text-2xs text-stone-500 leading-tight">
                  Academic safety sandbox. Non-operational.
                </p>
              </div>

              <NavLink
                to="/"
                onClick={onCloseMobile}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-subtle text-2xs text-stone-600 hover:text-obsidian-950 hover:bg-sand-100 transition-colors"
              >
                <span>Public Landing Page</span>
                <ExternalLink className="w-3 h-3" />
              </NavLink>
            </div>
          ) : (
            <Tooltip content="Research Mode: Active" side="right">
              <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-panel bg-sand-100 border border-obsidian-950/10 text-obsidian-950">
                <Shield className="w-4 h-4" />
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside
        className={cn(
          'hidden md:block h-screen shrink-0 transition-all duration-300 z-30',
          isCollapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-obsidian-950/50 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-72 max-w-[85vw] h-full z-10 shadow-editorial-dark"
            >
              {sidebarContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
