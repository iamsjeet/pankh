import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Plane,
  ShieldCheck,
  AlertTriangle,
  Info,
  Play,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Incident } from '@/features/incidents/types/incident';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';

export interface IncidentHeaderProps {
  incident: Incident;
}

export const IncidentHeader: React.FC<IncidentHeaderProps> = ({ incident }) => {
  const navigate = useNavigate();

  const severityVariant = (sev: Incident['severity']) => {
    switch (sev) {
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
    <div className="space-y-4">
      {/* Top Nav Action & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-700/60">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/investigations')}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Incident Library
          </Button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-600">/</span>
            <span className="text-cyan-300 font-semibold">{incident.id}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">Investigation Workspace</span>
          </div>
        </div>

        {/* Workflow Progression & Simulation Lab Button */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-2xs font-mono">
            <span className="text-slate-400">Workflow:</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
              Phase 2: Investigation Workspace
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/app/simulation/${incident.id}`)}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current text-white" />}
            className="shadow-glow-cyan text-xs font-mono"
          >
            Launch Interactive Simulation
          </Button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="rounded-panel panel-surface p-6 border border-cyan-500/30 relative overflow-hidden">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-cyan-400 bg-navy-900 px-2.5 py-1 rounded border border-cyan-500/40">
              {incident.id}
            </span>

            <Badge variant={severityVariant(incident.severity)} size="sm" dot>
              {incident.severity}
            </Badge>

            <span className="text-2xs font-mono text-slate-300 bg-navy-900 border border-navy-700 px-2.5 py-1 rounded">
              {incident.category}
            </span>

            {incident.provenance.verificationStatus === 'HISTORICAL_CURATED' ? (
              <Tooltip content={incident.provenance.disclaimer}>
                <span className="px-2.5 py-1 rounded text-2xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  HISTORICAL CURATED
                </span>
              </Tooltip>
            ) : incident.provenance.isDemo ? (
              <Tooltip content={incident.provenance.disclaimer}>
                <Badge variant="mono" size="sm">
                  DEMO BENCHMARK
                </Badge>
              </Tooltip>
            ) : null}
          </div>

          <div className="flex items-center gap-2 text-2xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span title={incident.source.reportTitle}>
              Source: <strong className="text-slate-200">{incident.source.organization}</strong>
              {incident.source.reportDocumentId && ` (${incident.source.reportDocumentId})`}
            </span>
            {incident.source.url && (
              <a
                href={incident.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 ml-1 underline underline-offset-2"
                title="Open official primary investigation document"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Report PDF</span>
              </a>
            )}
          </div>
        </div>

        {/* Title and Subtitle */}
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
          {incident.title}
        </h1>
        {incident.subtitle && (
          <p className="text-xs sm:text-sm font-mono text-slate-300 mt-1.5 leading-relaxed">
            {incident.subtitle}
          </p>
        )}

        {/* Flight & Location Meta Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-4 border-t border-navy-800/80 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Date: <strong className="text-white">{incident.date}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-aviation-400 shrink-0" />
            <span className="truncate" title={incident.location.name}>
              Location: <strong className="text-white">{incident.location.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Plane className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate" title={incident.aircraft.map((a) => a.type).join(' & ')}>
              Aircraft: <strong className="text-white">{incident.aircraft.map((a) => a.type).join(' & ')}</strong>
            </span>
          </div>
        </div>

        {/* Executive Summary Hierarchy */}
        {incident.executiveSummary && (
          <div className="mt-5 pt-4 border-t border-navy-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-panel bg-navy-900/70 border border-navy-800 space-y-1">
              <span className="text-2xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-semibold">
                <Info className="w-3.5 h-3.5" />
                Executive Synopsis
              </span>
              <p className="text-slate-300 leading-relaxed text-2xs">
                {incident.executiveSummary.overview}
              </p>
            </div>

            <div className="p-3 rounded-panel bg-navy-900/70 border border-navy-800 space-y-1">
              <span className="text-2xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Core Safety Issue
              </span>
              <p className="text-slate-300 leading-relaxed text-2xs">
                {incident.executiveSummary.safetyIssue}
              </p>
            </div>

            <div className="p-3 rounded-panel bg-navy-900/70 border border-navy-800 space-y-1">
              <span className="text-2xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Investigation Outcome
              </span>
              <p className="text-slate-300 leading-relaxed text-2xs">
                {incident.executiveSummary.outcome}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
