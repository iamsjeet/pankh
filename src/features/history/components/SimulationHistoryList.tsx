import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { SimulationAttempt } from '../types/history';
import { Button } from '@/components/ui/Button';

export interface SimulationHistoryListProps {
  attempts: SimulationAttempt[];
}

export const SimulationHistoryList: React.FC<SimulationHistoryListProps> = ({ attempts }) => {
  const navigate = useNavigate();

  const getOutcomeBadge = (classification?: string) => {
    switch (classification) {
      case 'SAFE_SEPARATION':
        return (
          <span className="px-2.5 py-1 rounded text-2xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            SAFE SEPARATION
          </span>
        );
      case 'CATASTROPHIC_COLLISION':
        return (
          <span className="px-2.5 py-1 rounded text-2xs font-mono font-bold bg-crimson-950 text-crimson-300 border border-crimson-500/40 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-crimson-400" />
            CATASTROPHIC COLLISION
          </span>
        );
      case 'NEAR_MID_AIR_COLLISION':
        return (
          <span className="px-2.5 py-1 rounded text-2xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            NEAR MID-AIR COLLISION
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-mono text-slate-400 bg-navy-900 border border-navy-800">
            INCOMPLETE RUN
          </span>
        );
    }
  };

  if (attempts.length === 0) {
    return (
      <div className="p-8 rounded-panel panel-surface border border-navy-800 text-center space-y-3">
        <Plane className="w-8 h-8 text-slate-500 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-300">
          No Simulation Attempts Recorded Yet
        </h3>
        <p className="text-2xs text-slate-400 font-mono max-w-sm mx-auto">
          Participate in interactive branching scenarios to evaluate conflict resolution and view outcome debriefs.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/app/simulation/HIST-2002-UBL')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Launch Überlingen 2002 Benchmark
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {attempts.map((attempt) => (
        <div
          key={attempt.id}
          className="rounded-panel panel-surface border border-navy-800 hover:border-cyan-500/40 p-5 transition-all space-y-4 shadow-sm"
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-navy-900 px-2 py-0.5 rounded border border-cyan-500/40">
                {attempt.incidentId}
              </span>
              <span className="text-2xs font-mono text-slate-400 bg-navy-900 border border-navy-800 px-2 py-0.5 rounded">
                {attempt.scenarioId}
              </span>
              {attempt.completed ? (
                <span className="px-2 py-0.5 rounded text-3xs font-mono font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  COMPLETED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-3xs font-mono font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/30">
                  {attempt.status}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {getOutcomeBadge(attempt.outcome?.classification)}
              <div className="flex items-center gap-1.5 text-2xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{attempt.timestampFormatted}</span>
              </div>
            </div>
          </div>

          {/* Title & Selected Branch */}
          <div className="space-y-1">
            <h3 className="font-heading font-semibold text-base text-white">
              {attempt.scenarioTitle}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-2xs font-mono text-slate-300 pt-1">
              <span className="text-slate-500">Selected Path:</span>
              <span className="font-bold text-cyan-300">
                {attempt.decisions[0]?.branchTitle || attempt.selectedBranchId || 'Initial Trajectory'}
              </span>
              {attempt.selectedOptionId && (
                <span className="text-3xs text-slate-400 bg-navy-900 px-1.5 py-0.2 rounded border border-navy-800">
                  {attempt.selectedOptionId}
                </span>
              )}
            </div>
          </div>

          {/* Telemetry Separation Readouts */}
          {attempt.minSeparationReached && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded bg-navy-900/60 border border-navy-800 text-2xs font-mono">
              <div>
                <span className="text-slate-500 block mb-0.5">Min Lateral Separation:</span>
                <strong className="text-slate-200 font-telemetry">
                  {attempt.minSeparationReached.horizontal}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Min Vertical Separation:</span>
                <strong className="text-emerald-400 font-telemetry">
                  {attempt.minSeparationReached.vertical}
                </strong>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-navy-800/80">
            <div className="text-3xs font-mono text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <span>{attempt.provenance} SIMULATION</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/app/investigations/${attempt.incidentId}`)}
                className="font-mono text-xs"
              >
                Inspect Incident
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/app/simulation/${attempt.incidentId}`)}
                leftIcon={<FileText className="w-3.5 h-3.5" />}
                className="font-mono text-xs shadow-glow-cyan"
              >
                Open Full Debrief
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
