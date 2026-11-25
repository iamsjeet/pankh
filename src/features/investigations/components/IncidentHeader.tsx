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
      case 'Loss of Separation':
        return 'warning';
      default:
        return 'nominal';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Nav Action & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-obsidian-950/12">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/investigations')}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Incident Library
          </Button>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 min-w-0">
            <span>/</span>
            <span className="text-obsidian-950 font-semibold truncate">{incident.id}</span>
            <span className="hidden sm:inline">/</span>
            <span className="hidden sm:inline truncate">Investigation Workspace</span>
          </div>
        </div>

        {/* Simulation Launch Action */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="accent"
            size="sm"
            onClick={() => navigate(`/app/simulation/${incident.id}`)}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Launch Interactive Simulation
          </Button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="rounded-card panel-surface p-6 sm:p-7 relative overflow-hidden">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-obsidian-950 bg-lime-400/65 px-2.5 py-1 rounded-subtle border border-lime-600/30">
              {incident.id}
            </span>

            <Badge variant={severityVariant(incident.severity)} size="sm" dot>
              {incident.severity}
            </Badge>

            <span className="text-2xs font-mono text-stone-600 bg-sand-100 border border-obsidian-950/10 px-2.5 py-1 rounded-subtle">
              {incident.category}
            </span>

            {incident.provenance.verificationStatus === 'HISTORICAL_CURATED' ? (
              <Tooltip content={incident.provenance.disclaimer}>
                <span className="px-2.5 py-1 rounded-subtle text-2xs font-mono font-bold bg-emerald-100/80 text-emerald-700 border border-emerald-600/25 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  HISTORICAL CURATED
                </span>
              </Tooltip>
            ) : incident.provenance.isDemo ? (
              <Tooltip content={incident.provenance.disclaimer}>
                <Badge variant="warning" size="sm">
                  DEMO BENCHMARK
                </Badge>
              </Tooltip>
            ) : null}
          </div>

          <div className="flex items-center gap-2 text-2xs font-mono text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span title={incident.source.reportTitle}>
              Source: <strong className="text-obsidian-950">{incident.source.organization}</strong>
              {incident.source.reportDocumentId && ` (${incident.source.reportDocumentId})`}
            </span>
            {incident.source.url && (
              <a
                href={incident.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-obsidian-950 font-semibold hover:underline decoration-lime-500 decoration-2 underline-offset-2 ml-1"
                title="Open official primary investigation document"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Report PDF</span>
              </a>
            )}
          </div>
        </div>

        {/* Title and Subtitle */}
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-obsidian-950 tracking-tight leading-tight">
          {incident.title}
        </h1>
        {incident.subtitle && (
          <p className="text-xs sm:text-sm font-mono text-stone-500 mt-1.5 leading-relaxed">
            {incident.subtitle}
          </p>
        )}

        {/* Flight & Location Meta Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-5 border-t border-obsidian-950/10 text-xs font-mono">
          <div className="flex items-center gap-2 text-stone-600">
            <Calendar className="w-4 h-4 text-obsidian-950 shrink-0" />
            <span>
              Date: <strong className="text-obsidian-950">{incident.date}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-stone-600">
            <MapPin className="w-4 h-4 text-obsidian-950 shrink-0" />
            <span className="truncate" title={incident.location.name}>
              Location: <strong className="text-obsidian-950">{incident.location.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-stone-600">
            <Plane className="w-4 h-4 text-obsidian-950 shrink-0" />
            <span className="truncate" title={incident.aircraft.map((a) => a.type).join(' & ')}>
              Aircraft:{' '}
              <strong className="text-obsidian-950">
                {incident.aircraft.map((a) => a.type).join(' & ')}
              </strong>
            </span>
          </div>
        </div>

        {/* Executive Summary Hierarchy */}
        {incident.executiveSummary && (
          <div className="mt-5 pt-5 border-t border-obsidian-950/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/10 space-y-1.5">
              <span className="text-2xs font-mono uppercase tracking-wider text-obsidian-950 flex items-center gap-1.5 font-semibold">
                <Info className="w-3.5 h-3.5 text-obsidian-950" />
                Executive Synopsis
              </span>
              <p className="text-stone-600 leading-relaxed text-xs">
                {incident.executiveSummary.overview}
              </p>
            </div>

            <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/10 space-y-1.5">
              <span className="text-2xs font-mono uppercase tracking-wider text-amber-700 flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Core Safety Issue
              </span>
              <p className="text-stone-600 leading-relaxed text-xs">
                {incident.executiveSummary.safetyIssue}
              </p>
            </div>

            <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/10 space-y-1.5">
              <span className="text-2xs font-mono uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Investigation Outcome
              </span>
              <p className="text-stone-600 leading-relaxed text-xs">
                {incident.executiveSummary.outcome}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
