import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bell,
  Clock,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';

export const Header: React.FC = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [utcTime, setUtcTime] = useState('');

  // Live UTC Aerospace Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute breadcrumb title based on path
  const getBreadcrumb = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Landing';
    if (segments[0] === 'app') {
      const page = segments[1] || 'mission-control';
      if (page === 'investigations') {
        if (segments[2]) {
          return `Incident Library / ${segments[2]}`;
        }
        return 'Incident Library';
      }
      return page
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  };

  return (
    <header className="h-14 bg-navy-950/80 border-b border-navy-700/60 backdrop-blur-md px-4 flex items-center justify-between gap-4 shrink-0 z-20">
      {/* Left: Breadcrumb & Context */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500 uppercase tracking-widest text-2xs">PANKH</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-300 font-semibold tracking-wider">{getBreadcrumb()}</span>
        </div>

        <div className="hidden lg:flex items-center">
          <Badge variant="mono" size="sm">
            FLIGHT RESEARCH
          </Badge>
        </div>
      </div>

      {/* Middle: Tactical Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Search incidents, aircraft codes, scenarios (⌘K)..."
        />
      </div>

      {/* Right: Live Telemetry, UTC Clock, Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* UTC Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-panel bg-navy-900 border border-navy-800 text-xs text-slate-300 font-telemetry">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{utcTime || '00:00:00 UTC'}</span>
        </div>

        {/* System Status Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-panel bg-navy-900/80 border border-navy-800 text-2xs font-mono text-emerald-400">
          <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
          <span>TELEMETRY SYNCED</span>
        </div>

        {/* Quick Actions */}
        <Tooltip content="Quick Settings">
          <button
            type="button"
            className="p-1.5 rounded-panel text-slate-400 hover:text-slate-100 hover:bg-navy-800 border border-transparent hover:border-navy-700 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Alert Feed (0 Critical)">
          <button
            type="button"
            className="p-1.5 rounded-panel text-slate-400 hover:text-slate-100 hover:bg-navy-800 border border-transparent hover:border-navy-700 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute top-1.5 right-1.5 shadow-glow-cyan-sm" />
          </button>
        </Tooltip>
      </div>
    </header>
  );
};
