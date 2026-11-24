import React from 'react';
import {
  Play,
  ArrowLeft,
  Plane,
  ShieldAlert,
  Compass,
  CheckCircle2,
} from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExit}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Investigation Dossier
          </Button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-600">/</span>
            <span className="text-cyan-300 font-semibold">{scenario.id}</span>
            <span className="text-slate-600">/</span>
            <span>Scenario Briefing</span>
          </div>
        </div>

        <Badge variant="active" size="sm">
          PHASE 4 SIMULATION
        </Badge>
      </div>

      {/* Main Briefing Dossier Card */}
      <div className="rounded-panel panel-surface-elevated border border-cyan-500/30 p-6 space-y-6">
        {/* Title & Badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-navy-900 border border-cyan-500/40 px-2.5 py-1 rounded">
              {scenario.id}
            </span>
            <Badge variant="mono" size="sm">
              {scenario.scenarioType.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="warning" size="sm">
              {scenario.provenance} MODEL
            </Badge>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            {scenario.title}
          </h1>

          <p className="text-xs font-mono text-slate-300 leading-relaxed max-w-3xl">
            {scenario.briefing.overview}
          </p>
        </div>

        {/* User Role Card */}
        <div className="p-4 rounded-panel bg-navy-900/90 border border-cyan-500/30 flex items-start gap-3">
          <div className="w-9 h-9 rounded-panel bg-navy-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-glow-cyan-sm mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <span className="text-2xs font-mono uppercase text-cyan-400 font-bold block">
              Assigned Participant Role:
            </span>
            <strong className="text-white font-heading text-sm block">
              {scenario.userRole}
            </strong>
            <p className="text-slate-300 text-2xs leading-relaxed font-mono">
              {scenario.briefing.roleDescription}
            </p>
          </div>
        </div>

        {/* Aircraft Involved Fleet */}
        <div className="space-y-2 text-xs font-mono">
          <span className="text-2xs uppercase text-slate-500 font-bold block">
            Aircraft Involved in Convergence:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scenario.aircraftList.map((ac) => (
              <div
                key={ac.id}
                className="p-3 rounded bg-navy-900/60 border border-navy-800 flex items-center gap-3"
              >
                <div
                  className="w-8 h-8 rounded-panel flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${ac.color}15`,
                    borderColor: `${ac.color}50`,
                    color: ac.color,
                  }}
                >
                  <Plane className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <strong className="text-white font-bold">{ac.callsign}</strong>
                    <span className="text-2xs text-slate-400">({ac.type})</span>
                  </div>
                  <div className="text-2xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{ac.operator}</span>
                    <span>•</span>
                    <span className="text-cyan-300">{ac.initialAltitude}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Initial Environmental Conditions Grid */}
        <div className="space-y-2 text-xs font-mono">
          <span className="text-2xs uppercase text-slate-500 font-bold block">
            Initial Airspace Conditions:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
            <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
              <span className="text-slate-500 block mb-0.5">Airspace Sector:</span>
              <strong className="text-slate-200">{scenario.initialConditions.airspace}</strong>
            </div>
            <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
              <span className="text-slate-500 block mb-0.5">Weather & Visibility:</span>
              <strong className="text-slate-200">{scenario.initialConditions.weather}</strong>
            </div>
            <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
              <span className="text-slate-500 block mb-0.5">Traffic Density:</span>
              <strong className="text-slate-200">{scenario.initialConditions.trafficDensity}</strong>
            </div>
            <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
              <span className="text-slate-500 block mb-0.5">Surveillance & Alerts:</span>
              <strong className="text-slate-200">{scenario.initialConditions.surveillance}</strong>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="space-y-2 text-xs font-mono">
          <span className="text-2xs uppercase text-slate-500 font-bold block">
            Simulation Scenario Objectives:
          </span>
          <ul className="space-y-1.5 text-slate-300">
            {scenario.briefing.objectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Provenance & Methodology Disclaimer */}
        <div className="p-3.5 rounded bg-navy-950 border border-amber-500/30 text-2xs font-mono text-amber-200/90 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{scenario.briefing.disclaimer}</span>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-2xs font-mono text-slate-500">
            Interactive decision checkpoints active • Predefined branching enabled
          </span>

          <Button
            variant="primary"
            size="lg"
            onClick={onStartSimulation}
            rightIcon={<Play className="w-4 h-4 text-navy-950" />}
          >
            Start Scenario Playback
          </Button>
        </div>
      </div>
    </div>
  );
};
