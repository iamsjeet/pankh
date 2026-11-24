import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSearch,
  Plane,
  ArrowRight,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const HistoryEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-navy-900 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-glow-cyan-sm">
        <History className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-heading font-bold text-white">
          No Investigation or Simulation Activity Yet
        </h2>
        <p className="text-xs text-slate-400 font-mono max-w-md mx-auto leading-relaxed">
          PANKH records your investigation progress, evidence findings, assistant Q&A sessions, and interactive simulation branches as you explore.
        </p>
      </div>

      {/* Suggested Quick Starts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
        <div className="p-5 rounded-panel panel-surface border border-navy-800 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="w-9 h-9 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-cyan-400">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm text-white">
              Incident Library
            </h3>
            <p className="text-2xs text-slate-400 font-mono mt-1">
              Investigate 4 deep aviation accident records including Überlingen, AF447, and Charkhi Dadri.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/investigations')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="w-full text-xs font-mono"
          >
            Open Library
          </Button>
        </div>

        <div className="p-5 rounded-panel panel-surface border border-navy-800 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="w-9 h-9 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-aviation-400">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm text-white">
              Interactive Simulation
            </h3>
            <p className="text-2xs text-slate-400 font-mono mt-1">
              Participate in the Überlingen 2002 mid-air collision scenario with decision branching.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/app/simulation/HIST-2002-UBL')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="w-full text-xs font-mono shadow-glow-cyan"
          >
            Launch Benchmark
          </Button>
        </div>
      </div>
    </div>
  );
};
