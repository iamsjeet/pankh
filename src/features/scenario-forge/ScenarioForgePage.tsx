import React from 'react';
import {
  Workflow,
  Plus,
  Play,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';

export const ScenarioForgePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Scenario Forge
            </h1>
            <Badge variant="warning" size="sm">
              SYNTHESIS & VALIDATION
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Construct incident-informed scenarios, inject boundary conditions, and validate evidence chains.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" leftIcon={<Database className="w-3.5 h-3.5" />}>
            Import Incident
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Create Scenario
          </Button>
        </div>
      </div>

      {/* Main Canvas Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Panel
            title="Active Scenario Canvas"
            subtitle="SC-2024-DEL-01 • HIGH DENSITY CONVERGENCE"
            badge={<Badge variant="nominal" size="sm">Validated</Badge>}
            actionSlot={
              <Button variant="primary" size="xs" leftIcon={<Play className="w-3 h-3" />}>
                Execute in Sim Lab
              </Button>
            }
          >
            <div className="h-72 rounded-panel bg-navy-950/80 border border-navy-800 flex flex-col items-center justify-center text-center p-6 bg-tactical-grid">
              <Workflow className="w-10 h-10 text-cyan-400 mb-3 opacity-80" />
              <h3 className="font-heading font-semibold text-white mb-1">
                Scenario Graph Architecture
              </h3>
              <p className="text-xs text-slate-400 max-w-md mb-4">
                Node-based scenario builder mapping aircraft waypoints, altitude profiles, wind shear vectors, and communication loss triggers.
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Add Aircraft Node
                </Button>
                <Button variant="outline" size="sm">
                  Add Weather Constraint
                </Button>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Parameters Panel */}
        <div className="space-y-4">
          <Panel
            title="Environmental Parameters"
            subtitle="METEOROLOGICAL BOUNDARIES"
          >
            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-800">
                <span className="text-slate-400">Wind Velocity</span>
                <span className="text-cyan-300">280° @ 35 KT</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-800">
                <span className="text-slate-400">Turbulence Severity</span>
                <span className="text-amber-400">Moderate / Severe</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-800">
                <span className="text-slate-400">Cloud Base</span>
                <span className="text-slate-200">1,200 FT AGL</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-800">
                <span className="text-slate-400">TCAS Sensitivity</span>
                <span className="text-emerald-400">Tau 25s (Level 7)</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
