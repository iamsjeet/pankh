import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Menu, SlidersHorizontal } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';

interface HeaderProps {
  onOpenMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBreadcrumb = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Landing';
    if (segments[0] === 'app') {
      const page = segments[1] || 'mission-control';
      if (page === 'investigations') {
        return segments[2] ? `Incident Library / ${segments[2]}` : 'Incident Library';
      }
      if (page === 'simulation') {
        return segments[2] ? `Simulation / ${segments[2]}` : 'Simulation Lab';
      }
      return page
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate('/app/investigations');
    }
  };

  return (
    <header className="h-14 bg-sand-25/90 border-b border-obsidian-950/10 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-20">
      {/* Left: Mobile Trigger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-1.5 rounded-subtle text-obsidian-950 hover:bg-sand-100 border border-obsidian-950/15"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 min-w-0">
          <span className="uppercase tracking-widest text-2xs hidden sm:inline">PANKH</span>
          <span className="text-stone-400 hidden sm:inline">/</span>
          <span className="text-obsidian-950 font-semibold tracking-tight truncate">
            {getBreadcrumb()}
          </span>
        </div>

        <div className="hidden xl:flex items-center">
          <Badge variant="mono" size="sm">
            RESEARCH SANDBOX
          </Badge>
        </div>
      </div>

      {/* Middle: Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4" onKeyDown={handleSearchKeyDown}>
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Quick jump to Incident Library..."
        />
      </div>

      {/* Right: UTC Clock & Settings */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-panel bg-sand-100 border border-obsidian-950/10 text-xs text-obsidian-950 font-telemetry">
          <Clock className="w-3.5 h-3.5 text-stone-500" />
          <span>{utcTime || '00:00:00 UTC'}</span>
        </div>

        <Tooltip content="Workspace Settings">
          <button
            type="button"
            onClick={() => navigate('/app/settings')}
            className="p-2 rounded-panel text-stone-600 hover:text-obsidian-950 hover:bg-sand-100 border border-transparent hover:border-obsidian-950/15 transition-colors"
            aria-label="Workspace Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    </header>
  );
};
