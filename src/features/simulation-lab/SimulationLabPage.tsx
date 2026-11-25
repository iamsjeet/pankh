import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldAlert, Plane, Activity, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { MetricCard } from '@/components/ui/MetricCard';

export const SimulationLabPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-obsidian-950/12">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="accent" size="sm">
              DETERMINISTIC PLAYBACK
            </Badge>
            <Badge variant="mono" size="sm">
              2 SCENARIOS READY
            </Badge>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-obsidian-950">
            Simulation Lab
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Launch predefined, incident-informed 2D playback scenarios with decision checkpoints and outcome debriefs.
          </p>
        </div>
      </div>

      {/* Featured Interactive Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-card panel-dark p-6 flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm">SCEN-2002-UBL</Badge>
              <span className="text-2xs font-mono text-stone-400">ILLUSTRATIVE • 90s</span>
            </div>
            <h2 className="font-heading text-xl font-bold text-sand-50">
              Überlingen Mid-Air Collision (2002)
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              Experience the T+00:45 checkpoint where BTC 2937 receives a TCAS Climb RA and a simultaneous verbal ATC descent clearance.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-2xs font-mono text-lime-400">3 Branching Outcomes</span>
            <Button
              variant="accent"
              size="sm"
              onClick={() => navigate('/app/simulation/HIST-2002-UBL')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Launch Überlingen
            </Button>
          </div>
        </div>

        <div className="rounded-card panel-surface p-6 flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="mono" size="sm">SCEN-1996-CHRK</Badge>
              <span className="text-2xs font-mono text-stone-500">REPORT SUPPORTED • 60s</span>
            </div>
            <h2 className="font-heading text-xl font-bold text-obsidian-950">
              Charkhi Dadri Airway G460 Conflict (1996)
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Evaluate altitude capture at FL150 in a bidirectional corridor without Mode C secondary radar.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-obsidian-950/10">
            <span className="text-2xs font-mono text-stone-500">3 Branching Outcomes</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/app/simulation/HIST-1996-CHRK')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Launch Charkhi Dadri
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Simulation Fidelity"
          value="Deterministic"
          icon={<Compass className="w-4 h-4" />}
          status="cyan"
          subtext="Predefined frame playback"
        />
        <MetricCard
          label="Active Scenarios"
          value="2"
          unit="Cases"
          icon={<Plane className="w-4 h-4" />}
          status="nominal"
          subtext="HIST-2002-UBL & HIST-1996-CHRK"
        />
        <MetricCard
          label="Physics Engine"
          value="None"
          icon={<Activity className="w-4 h-4 text-amber-600" />}
          status="warning"
          subtext="Not a certified flight simulator"
        />
      </div>

      <Panel title="Simulation Methodology Notice" subtitle="TRANSPARENCY">
        <div className="flex items-start gap-3 text-xs text-stone-600">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            PANKH Simulation Lab runs deterministic, data-driven 2D playback sequences and predefined decision branches. It does not execute a real-time aerodynamics solver or reinforcement learning agent.
          </p>
        </div>
      </Panel>
    </div>
  );
};
