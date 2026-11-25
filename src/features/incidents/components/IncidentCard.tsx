import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Incident } from '../types/incident';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InteractiveSurface } from '@/components/ui/InteractiveSurface';
import { cn } from '@/utils/cn';

export interface IncidentCardProps {
  incident: Incident;
  className?: string;
}

const ARCHIVE_MOTIFS: Record<string, React.ReactNode> = {
  'HIST-2002-UBL': (
    <svg viewBox="0 0 100 44" className="w-20 h-9 text-stone-400 group-hover:text-obsidian-950 transition-colors" aria-hidden="true">
      <line x1="8" y1="22" x2="92" y2="22" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 2" />
      <line x1="50" y1="4" x2="50" y2="40" stroke="#A6D94A" strokeWidth="1.75" />
      <circle cx="50" cy="22" r="3.5" fill="#C8F169" stroke="#17191B" strokeWidth="1.25" />
    </svg>
  ),
  'HIST-2009-AF447': (
    <svg viewBox="0 0 100 44" className="w-20 h-9 text-stone-400 group-hover:text-obsidian-950 transition-colors" aria-hidden="true">
      <path d="M 8 28 Q 38 6 58 18 T 92 38" fill="none" stroke="#A6D94A" strokeWidth="1.75" />
      <circle cx="58" cy="18" r="3" fill="#C8F169" stroke="#17191B" strokeWidth="1.25" />
    </svg>
  ),
  'HIST-1996-CHRK': (
    <svg viewBox="0 0 100 44" className="w-20 h-9 text-stone-400 group-hover:text-obsidian-950 transition-colors" aria-hidden="true">
      <line x1="8" y1="16" x2="92" y2="16" stroke="currentColor" strokeWidth="1.25" />
      <line x1="92" y1="28" x2="8" y2="28" stroke="#A6D94A" strokeWidth="1.75" />
      <circle cx="50" cy="28" r="3" fill="#DC2626" />
    </svg>
  ),
};

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, className }) => {
  const navigate = useNavigate();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleOpenInvestigation = () => {
    navigate(`/app/investigations/${incident.id}`);
  };

  const severityBadgeVariant = (severity: Incident['severity']) => {
    switch (severity) {
      case 'Catastrophic':
        return 'critical';
      case 'Serious Incident':
      case 'Loss of Separation':
        return 'warning';
      default:
        return 'nominal';
    }
  };

  return (
    <InteractiveSurface
      tilt
      spotlight
      maxTilt={3.5}
      className={cn(
        'group rounded-card panel-surface p-6 sm:p-7 hover:border-obsidian-950/35 hover:shadow-editorial-hover flex flex-col justify-between relative overflow-hidden',
        className
      )}
    >
      <div className="relative z-10">
        {/* Top Row: Large Editorial Year + Minimal Provenance + Trajectory Motif */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-obsidian-950/10 mb-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-2xs font-semibold text-obsidian-950 bg-lime-400/65 px-2 py-0.5 rounded-subtle border border-lime-600/25">
                {incident.id}
              </span>
              <Badge variant={severityBadgeVariant(incident.severity)} size="sm" dot>
                {incident.severity}
              </Badge>
              {incident.provenance.isDemo ? (
                <Badge variant="warning" size="sm">DEMO</Badge>
              ) : (
                <Badge variant="nominal" size="sm">HISTORICAL</Badge>
              )}
            </div>
            <div className="font-heading text-3xl font-bold text-stone-400 group-hover:text-obsidian-950 transition-colors tracking-tight">
              {incident.date.slice(0, 4)}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {ARCHIVE_MOTIFS[incident.id] || (
              <svg viewBox="0 0 100 44" className="w-20 h-9 text-stone-400" aria-hidden="true">
                <line x1="10" y1="22" x2="90" y2="22" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 3" />
                <circle cx="70" cy="22" r="3" fill="#D97706" />
              </svg>
            )}
            {incident.simulationReady && (
              <span className="inline-flex items-center gap-1 text-2xs font-mono text-obsidian-950">
                <Activity className="w-3 h-3 text-emerald-600" />
                SIM READY
              </span>
            )}
          </div>
        </div>

        {/* Title & Minimal Metadata */}
        <div className="mb-4">
          <span className="block text-2xs font-mono uppercase tracking-widest text-stone-500 mb-1.5">
            {incident.location.name} • {incident.aircraft.map((a) => a.model).join(' / ')}
          </span>
          <h2
            onClick={handleOpenInvestigation}
            className="font-heading text-xl sm:text-2xl font-bold text-obsidian-950 tracking-tight cursor-pointer leading-snug"
          >
            {incident.title}
          </h2>
        </div>

        {/* Summary: Subtle default, full clarity on hover or mobile tap */}
        <div className="md:hidden mb-3">
          <button
            type="button"
            onClick={() => setMobileExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 text-2xs font-mono uppercase tracking-wider text-obsidian-950 font-semibold"
          >
            {mobileExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Hide Summary
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Preview Summary
              </>
            )}
          </button>
        </div>

        <p
          className={cn(
            'text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3 mb-5 transition-opacity duration-200',
            mobileExpanded ? 'block' : 'hidden md:block md:opacity-75 md:group-hover:opacity-100'
          )}
        >
          {incident.summary}
        </p>
      </div>

      {/* Footer: Source & Investigation Action */}
      <div className="relative z-10 pt-4 border-t border-obsidian-950/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-stone-500 font-mono text-2xs min-w-0">
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {incident.source.organization.split('(')[0].trim()}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          magnetic
          onClick={handleOpenInvestigation}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          className="shrink-0"
        >
          Explore Investigation
        </Button>
      </div>
    </InteractiveSurface>
  );
};
