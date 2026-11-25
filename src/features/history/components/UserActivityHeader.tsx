import React from 'react';
import {
  FileSearch,
  Plane,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { UserActivityStats } from '../types/history';
import { Button } from '@/components/ui/Button';

export interface UserActivityHeaderProps {
  stats: UserActivityStats;
  onClearHistory: () => void;
}

export const UserActivityHeader: React.FC<UserActivityHeaderProps> = ({
  stats,
  onClearHistory,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-950/12">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-obsidian-950">
              My Investigations & Simulation History
            </h1>
            <span className="px-2 py-0.5 rounded text-2xs font-mono font-bold bg-lime-400/50 text-obsidian-950 border border-lime-600/35">
              AUDIT LOG
            </span>
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Track investigated incidents, review decision branch attempts, and compare simulation outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-stone-500 hover:text-crimson-600 text-xs font-mono"
            title="Clear stored investigation and simulation history"
          >
            Reset History
          </Button>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/12 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono text-stone-500 uppercase tracking-wider">
              Dossiers Explored
            </span>
            <FileSearch className="w-4 h-4 text-obsidian-950" />
          </div>
          <div className="text-2xl font-bold font-telemetry text-obsidian-950">
            {stats.totalIncidentsOpened}
          </div>
          <span className="text-3xs font-mono text-stone-500 block">
            Aviation safety incidents opened
          </span>
        </div>

        <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/12 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono text-stone-500 uppercase tracking-wider">
              Simulations Run
            </span>
            <Plane className="w-4 h-4 text-aviation-400" />
          </div>
          <div className="text-2xl font-bold font-telemetry text-obsidian-950">
            {stats.totalSimulationsRun}
          </div>
          <span className="text-3xs font-mono text-stone-500 block">
            {stats.completedSimulations} fully completed
          </span>
        </div>

        <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/12 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono text-stone-500 uppercase tracking-wider">
              Safe Separation
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-telemetry text-emerald-700">
            {stats.safeOutcomesCount}
          </div>
          <span className="text-3xs font-mono text-stone-500 block">
            TCAS compliant resolutions
          </span>
        </div>

        <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/12 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono text-stone-500 uppercase tracking-wider">
              Hazardous Outcomes
            </span>
            <AlertTriangle className="w-4 h-4 text-crimson-600" />
          </div>
          <div className="text-2xl font-bold font-telemetry text-crimson-600">
            {stats.hazardousOutcomesCount}
          </div>
          <span className="text-3xs font-mono text-stone-500 block">
            Near misses & collision branches
          </span>
        </div>
      </div>
    </div>
  );
};
