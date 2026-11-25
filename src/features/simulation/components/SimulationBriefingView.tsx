import React from 'react';
import { Play, ArrowLeft, Plane, ShieldAlert, Compass, CheckCircle2 } from 'lucide-react';
import { SimulationScenario } from '../types/simulation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface SimulationBriefingViewProps {
  scenario: SimulationScenario;
  onStartSimulation: () => void;
  onExit: () => void;
}

export const SimulationBriefingView: React.FC<SimulationBriefingViewProps> = ({
  scenario,
  onStartSimulation,
  onExit,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-950/12">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExit}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Investigation Dossier
          </Button>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <span>/</span>
            <span className="text-obsidian-950 font-semibold">{scenario.id}</span>
            <span>/</span>
            <span>Scenario Briefing</span>
          </div>
        </div>

        <Badge variant="accent" size="sm">
          DETERMINISTIC SIMULATION
        </Badge>
      </div>

      {/* Main Briefing Card */}
      <div className="rounded-card panel-surface p-6 sm:p-8 space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-obsidian-950 bg-lime-400/70 border border-lime-600/30 px-2.5 py-1 rounded-subtle">
              {scenario.id}
            </span>
            <Badge variant="mono" size="sm">
              {scenario.scenarioType.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="warning" size="sm">
              {scenario.provenance} MODEL
            </Badge>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-obsidian-950 tracking-tight leading-tight">
            {scenario.title}
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
            {scenario.briefing.overview}
          </p>
        </div>

        {/* Participant Role */}
        <div className="p-4 rounded-panel bg-obsidian-950 text-sand-50 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-panel bg-obsidian-850 border border-white/15 flex items-center justify-center text-lime-400 shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <span className="text-2xs font-mono uppercase text-lime-400 font-bold block">
              Assigned Participant Role
            </span>
            <strong className="text-sand-50 font-heading text-sm block">
              {scenario.userRole}
            </strong>
            <p className="text-stone-400 text-xs leading-relaxed">
              {scenario.briefing.roleDescription}
            </p>
          </div>
        </div>

        {/* Aircraft Fleet */}
        <div className="space-y-2.5 text-xs font-mono">
          <span className="text-2xs uppercase text-stone-500 font-bold block">
            Aircraft Involved in Convergence
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scenario.aircraftList.map((ac) => (
              <div
                key={ac.id}
                className="p-3.5 rounded-panel bg-sand-100/70 border border-obsidian-950/12 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-panel bg-obsidian-950 text-lime-400 flex items-center justify-center shrink-0">
                  <Plane className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <strong className="text-obsidian-950 font-bold">{ac.callsign}</strong>
                    <span className="text-2xs text-stone-500">({ac.type})</span>
                  </div>
                  <div className="text-2xs text-stone-600 flex items-center gap-2 mt-0.5">
                    <span>{ac.operator}</span>
                    <span>•</span>
                    <span className="text-obsidian-950 font-semibold">{ac.initialAltitude}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Initial Conditions */}
        <div className="space-y-2.5 text-xs font-mono">
          <span className="text-2xs uppercase text-stone-500 font-bold block">
            Initial Airspace Conditions
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-2xs">
            {[
              { label: 'Airspace Sector', val: scenario.initialConditions.airspace },
              { label: 'Weather & Visibility', val: scenario.initialConditions.weather },
              { label: 'Traffic Density', val: scenario.initialConditions.trafficDensity },
              { label: 'Surveillance & Alerts', val: scenario.initialConditions.surveillance },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-subtle bg-sand-100/70 border border-obsidian-950/10">
                <span className="text-stone-500 block mb-0.5">{item.label}:</span>
                <strong className="text-obsidian-950">{item.val}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Objectives */}
        <div className="space-y-2 text-xs">
          <span className="text-2xs font-mono uppercase text-stone-500 font-bold block">
            Simulation Objectives
          </span>
          <ul className="space-y-1.5 text-stone-600">
            {scenario.briefing.objectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="p-3.5 rounded-panel bg-amber-100/60 border border-amber-600/25 text-2xs font-mono text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{scenario.briefing.disclaimer}</span>
        </div>

        {/* Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-2xs font-mono text-stone-500">
            Interactive decision checkpoints active • Predefined branching enabled
          </span>

          <Button
            variant="accent"
            size="lg"
            onClick={onStartSimulation}
            rightIcon={<Play className="w-4 h-4 fill-current" />}
          >
            Start Scenario Playback
          </Button>
        </div>
      </div>
    </div>
  );
};
