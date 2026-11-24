import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Activity,
  Sliders,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { MetricCard } from '@/components/ui/MetricCard';

export const SimulationLabPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Featured Interactive Experience Banner */}
      <div className="rounded-panel p-4 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-cyan-500/40 shadow-glow-cyan-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-300">
                PHASE 4 BENCHMARK
              </span>
              <span className="text-2xs font-mono text-slate-400">
                SCEN-2002-UBL
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-100">
              Interactive Incident Simulation: Überlingen Mid-Air Collision (2002)
            </p>
            <p className="text-2xs text-slate-400 font-mono">
              Deterministic 2D tactical airspace playback with pilot decision branching and outcome debrief.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/app/simulation/HIST-2002-UBL')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          className="shrink-0 font-mono text-xs shadow-glow-cyan"
        >
          Launch Interactive Scenario
        </Button>
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Simulation Lab
            </h1>
            <Badge variant="nominal" size="sm">
              ENGINE READY
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Execute Monte Carlo simulation batches, inspect 3D trajectories, and analyze conflict resolution maneuvers.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(false)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
          <Button
            variant={isPlaying ? 'warning' : 'primary'}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            leftIcon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isPlaying ? 'Pause Sim' : 'Run Simulation'}
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<FastForward className="w-3.5 h-3.5" />}>
            4x Speed
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Simulation Time (T+)"
          value={isPlaying ? '00:04:18' : '00:00:00'}
          unit="Elapsed"
          icon={<Activity className="w-4 h-4 text-cyan-400" />}
          status="cyan"
        />
        <MetricCard
          label="Active Separation"
          value="4.8"
          unit="Nautical Miles"
          delta={{ value: 'Lateral Safe', trend: 'up' }}
          icon={<Plane className="w-4 h-4 text-emerald-400" />}
          status="nominal"
        />
        <MetricCard
          label="Collision Probability"
          value="0.0003"
          unit="P(loss)"
          delta={{ value: '< 1e-4 target', trend: 'neutral' }}
          icon={<Sliders className="w-4 h-4 text-slate-400" />}
          status="neutral"
        />
      </div>

      {/* 3D Trajectory Viewport Stub */}
      <Panel
        title="3D Flight Trajectory Viewport"
        subtitle="THREE.JS / REACT THREE FIBER CONTAINER STUB"
        badge={<Badge variant="active" size="sm">WebGL</Badge>}
        footerSlot="Cinematic 3D flight trajectory visualization container. Configured with fallback for low-power GPUs."
      >
        <div className="w-full h-80 sm:h-96 rounded-panel bg-navy-950 border border-navy-800 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden bg-tactical-dots">
          <div className="w-16 h-16 rounded-full bg-navy-900 border border-cyan-500/30 flex items-center justify-center mb-3 shadow-glow-cyan-sm">
            <Plane className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="font-heading font-semibold text-white mb-1">
            Flight Trajectory WebGL Inspector
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            Interactive R3F camera view with altitude corridors, waypoint vectors, and minimum separation alert spheres.
          </p>
        </div>
      </Panel>
    </div>
  );
};
