import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSearch,
  Bot,
  Plane,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { InvestigationProgress } from '../types/history';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface IncidentHistoryListProps {
  records: InvestigationProgress[];
}

export const IncidentHistoryList: React.FC<IncidentHistoryListProps> = ({ records }) => {
  const navigate = useNavigate();

  const getSeverityVariant = (sev: string) => {
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

  if (records.length === 0) {
    return (
      <div className="p-8 rounded-panel panel-surface border border-navy-800 text-center space-y-3">
        <FileSearch className="w-8 h-8 text-slate-500 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-300">
          No Incidents Investigated Yet
        </h3>
        <p className="text-2xs text-slate-400 font-mono max-w-sm mx-auto">
          Start exploring incidents in the Incident Library to record evidence findings and timeline investigations.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/app/investigations')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Browse Incident Library
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((item) => (
        <div
          key={item.incidentId}
          className="rounded-panel panel-surface border border-navy-800 hover:border-cyan-500/40 p-5 transition-all space-y-4 shadow-sm"
        >
          {/* Top Row: ID, Badges, Last Visited */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-navy-900 px-2.5 py-1 rounded border border-cyan-500/40">
                {item.incidentId}
              </span>
              <Badge variant={getSeverityVariant(item.severity) as any} size="sm">
                {item.severity}
              </Badge>
              <span className="text-2xs font-mono text-slate-400 bg-navy-900 border border-navy-800 px-2 py-0.5 rounded">
                {item.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-2xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Last Visited: <strong className="text-slate-300">{item.lastVisitedFormatted}</strong></span>
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-heading font-semibold text-base text-white">
              {item.incidentTitle}
            </h3>
          </div>

          {/* Progress Bar & Investigated Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-2xs font-mono">
              <span className="text-slate-400">Investigation Completeness:</span>
              <span className="text-cyan-300 font-bold">{item.progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden border border-navy-800">
              <div
                className="h-full bg-gradient-to-r from-aviation-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Investigated Sections & Evidence Counts */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-navy-800/80 text-2xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500">Sections Inspected:</span>
              {item.sectionsViewed.map((sec) => (
                <span
                  key={sec}
                  className="px-2 py-0.5 rounded bg-navy-900 text-slate-300 border border-navy-800 capitalize"
                >
                  {sec}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              {item.assistantQuestionsAsked > 0 && (
                <span className="flex items-center gap-1 text-cyan-400">
                  <Bot className="w-3.5 h-3.5" />
                  {item.assistantQuestionsAsked} Q&A
                </span>
              )}
              {item.simulationCompleted && (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sim Completed
                </span>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/app/investigations/${item.incidentId}`)}
              leftIcon={<FileSearch className="w-3.5 h-3.5" />}
              className="font-mono text-xs"
            >
              Reopen Dossier
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/app/simulation/${item.incidentId}`)}
              leftIcon={<Plane className="w-3.5 h-3.5" />}
              className="font-mono text-xs shadow-glow-cyan"
            >
              Launch Simulation
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
