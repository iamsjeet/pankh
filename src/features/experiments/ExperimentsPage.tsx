import React from 'react';
import {
  FileText,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';

export const ExperimentsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Experiments & Benchmarking
            </h1>
            <Badge variant="critical" size="sm">
              CONTROLLER EVALUATION
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Compare autonomous conflict resolution controllers, run stress tests, and generate scientific research reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />}>
            Export LaTeX Report
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Play className="w-3.5 h-3.5" />}>
            New Experiment
          </Button>
        </div>
      </div>

      {/* Controller Comparison Table Stub */}
      <Panel
        title="Autonomous Controller Benchmark Matrix"
        subtitle="1,000 MONTE CARLO ITERATIONS PER ALGORITHM"
        badge={<Badge variant="nominal" size="sm">Complete</Badge>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-navy-700 text-2xs text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Controller Architecture</th>
                <th className="py-2.5 px-3">Separation Violations</th>
                <th className="py-2.5 px-3">Mean Deviation (NM)</th>
                <th className="py-2.5 px-3">Inference Time</th>
                <th className="py-2.5 px-3">Safety Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800 text-slate-300">
              <tr className="hover:bg-navy-900/40">
                <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  PANKH-Neural-ACAS (Transformer + RL)
                </td>
                <td className="py-3 px-3 text-emerald-400">0.00 %</td>
                <td className="py-3 px-3">1.42 NM</td>
                <td className="py-3 px-3 text-cyan-300">12.4 ms</td>
                <td className="py-3 px-3"><Badge variant="nominal" size="sm">99.98%</Badge></td>
              </tr>
              <tr className="hover:bg-navy-900/40">
                <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-aviation-400" />
                  Baseline TCAS II (Resolution Advisory)
                </td>
                <td className="py-3 px-3 text-amber-400">0.18 %</td>
                <td className="py-3 px-3">2.84 NM</td>
                <td className="py-3 px-3 text-slate-400">1.2 ms</td>
                <td className="py-3 px-3"><Badge variant="warning" size="sm">98.42%</Badge></td>
              </tr>
              <tr className="hover:bg-navy-900/40">
                <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Rule-based Velocity Obstacle (VO)
                </td>
                <td className="py-3 px-3 text-crimson-400">0.45 %</td>
                <td className="py-3 px-3">3.10 NM</td>
                <td className="py-3 px-3 text-slate-400">4.8 ms</td>
                <td className="py-3 px-3"><Badge variant="critical" size="sm">95.10%</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};
