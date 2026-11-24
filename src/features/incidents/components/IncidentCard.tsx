import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Plane,
  ChevronRight,
  Activity,
  FileText,
} from 'lucide-react';
import { Incident } from '../types/incident';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/utils/cn';

export interface IncidentCardProps {
  incident: Incident;
  className?: string;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, className }) => {
  const navigate = useNavigate();

  const handleOpenInvestigation = () => {
    navigate(`/app/investigations/${incident.id}`);
  };

  const severityBadgeVariant = (severity: Incident['severity']) => {
    switch (severity) {
      case 'Catastrophic':
        return 'critical';
      case 'Serious Incident':
        return 'warning';
      case 'Loss of Separation':
        return 'warning';
      default:
        return 'nominal';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group rounded-panel panel-surface p-5 border border-navy-700/70 hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between relative overflow-hidden',
        className
      )}
    >
      {/* Top Bar: Incident ID, Category, Severity & Provenance */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-navy-800/80 mb-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-cyan-400 bg-navy-900/90 px-2 py-0.5 rounded border border-cyan-500/30 tracking-wider">
              {incident.id}
            </span>

            <Badge variant={severityBadgeVariant(incident.severity)} size="sm" dot>
              {incident.severity}
            </Badge>

            <span className="text-2xs font-mono text-slate-400 border border-navy-700/60 px-2 py-0.5 rounded bg-navy-900/40">
              {incident.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {incident.provenance.isDemo && (
              <Tooltip content={incident.provenance.disclaimer}>
                <Badge variant="mono" size="sm">
                  DEMO BENCHMARK
                </Badge>
              </Tooltip>
            )}

            {incident.simulationReady && (
              <Tooltip content="Prerecorded trajectory simulation available">
                <span className="inline-flex items-center gap-1 text-2xs font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  SIM READY
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-3">
          <h2
            onClick={handleOpenInvestigation}
            className="font-heading text-base font-semibold text-white tracking-wide group-hover:text-cyan-300 transition-colors cursor-pointer leading-snug"
          >
            {incident.title}
          </h2>
          {incident.subtitle && (
            <p className="text-2xs font-mono text-slate-400 tracking-wide mt-1">
              {incident.subtitle}
            </p>
          )}
        </div>

        {/* Primary Meta Grid: Date, Location, Aircraft Fleet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 p-3 rounded-panel bg-navy-900/60 border border-navy-800/80 mb-3.5 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{incident.date}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-aviation-400 shrink-0" />
            <span className="truncate" title={incident.location.name}>
              {incident.location.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 sm:col-span-2 lg:col-span-1">
            <Plane className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate" title={incident.aircraft.map((a) => a.type).join(' & ')}>
              {incident.aircraft.map((a) => a.type).join(' & ')}
            </span>
          </div>
        </div>

        {/* Summary Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
          {incident.summary}
        </p>

        {/* Key Contributing Factors Tags */}
        {incident.keyFactors && incident.keyFactors.length > 0 && (
          <div className="mb-4">
            <span className="block text-2xs font-mono uppercase text-slate-500 tracking-wider mb-1.5">
              Key Causal Indicators:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {incident.keyFactors.slice(0, 3).map((factor, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded text-2xs font-mono bg-navy-900 text-slate-300 border border-navy-800 truncate max-w-xs"
                >
                  • {factor}
                </span>
              ))}
              {incident.keyFactors.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-2xs font-mono text-slate-500">
                  +{incident.keyFactors.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Provenance Source & Primary Action */}
      <div className="pt-3.5 border-t border-navy-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-2xs min-w-0">
          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate" title={`${incident.source.organization} (${incident.source.reportDocumentId || 'Report'})`}>
            Source: <strong className="text-slate-300">{incident.source.organization}</strong>
            {incident.source.reportDocumentId && ` • ${incident.source.reportDocumentId}`}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenInvestigation}
          rightIcon={<ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
          className="shrink-0 self-end sm:self-auto"
        >
          Open Investigation
        </Button>
      </div>
    </motion.div>
  );
};
