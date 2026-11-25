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
      <div className="p-8 rounded-panel panel-surface border border-obsidian-950/12 text-center space-y-3">
        <FileSearch className="w-8 h-8 text-stone-500 mx-auto" />
        <h3 className="text-sm font-semibold text-stone-600">
          No Incidents Investigated Yet
        </h3>
        <p className="text-2xs text-stone-500 font-mono max-w-sm mx-auto">
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
          className="rounded-panel panel-surface border border-obsidian-950/12 hover:border-lime-600/35 p-5 transition-all space-y-4 shadow-sm"
        >
          {/* Top Row: ID, Badges, Last Visited */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-obsidian-950 bg-sand-100 px-2.5 py-1 rounded border border-lime-600/35">
                {item.incidentId}
              </span>
              <Badge variant={getSeverityVariant(item.severity) as any} size="sm">
                {item.severity}
              </Badge>
              <span className="text-2xs font-mono text-stone-500 bg-sand-100 border border-obsidian-950/12 px-2 py-0.5 rounded">
                {item.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-2xs font-mono text-stone-500">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>Last Visited: <strong className="text-stone-600">{item.lastVisitedFormatted}</strong></span>
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-heading font-semibold text-base text-obsidian-950">
              {item.incidentTitle}
            </h3>
          </div>

          {/* Progress Bar & Investigated Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-2xs font-mono">
              <span className="text-stone-500">Investigation Completeness:</span>
              <span className="text-obsidian-950 font-bold">{item.progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-sand-100 rounded-full overflow-hidden border border-obsidian-950/12">
              <div
                className="h-full bg-gradient-to-r from-aviation-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Investigated Sections & Evidence Counts */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-obsidian-950/12 text-2xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-500">Sections Inspected:</span>
              {item.sectionsViewed.map((sec) => (
                <span
                  key={sec}
                  className="px-2 py-0.5 rounded bg-sand-100 text-stone-600 border border-obsidian-950/12 capitalize"
                >
                  {sec}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-stone-500">
              {item.assistantQuestionsAsked > 0 && (
                <span className="flex items-center gap-1 text-obsidian-950">
                  <Bot className="w-3.5 h-3.5" />
                  {item.assistantQuestionsAsked} Q&A
                </span>
              )}
              {item.simulationCompleted && (
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
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
