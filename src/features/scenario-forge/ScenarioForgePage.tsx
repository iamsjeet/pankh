import React from 'react';
import { NavLink } from 'react-router-dom';
import { Workflow, ArrowRight, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';

export const ScenarioForgePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-obsidian-950/12">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="warning" size="sm">
              FUTURE MODULE PREVIEW
            </Badge>
            <Badge variant="mono" size="sm">
              CONCEPT
            </Badge>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-obsidian-950">
            Scenario Forge
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Architectural preview for incident-informed scenario authoring and boundary parameter configuration.
          </p>
        </div>

        <NavLink to="/app/investigations">
          <Button variant="primary" size="sm" leftIcon={<Database className="w-3.5 h-3.5" />}>
            Browse Curated Incidents
          </Button>
        </NavLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Panel
            title="Scenario Graph Workspace"
            subtitle="DESIGN PREVIEW • READ-ONLY IN MVP"
            badge={<Badge variant="idle" size="sm">Preview</Badge>}
            actionSlot={
              <NavLink to="/app/simulation/HIST-2002-UBL">
                <Button variant="primary" size="xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
                  Open Active Scenario
                </Button>
              </NavLink>
            }
          >
            <div className="h-72 rounded-panel bg-sand-100/70 border border-obsidian-950/12 flex flex-col items-center justify-center text-center p-6 bg-tactical-grid">
              <Workflow className="w-10 h-10 text-obsidian-950 mb-3 opacity-80" />
              <h3 className="font-heading font-semibold text-base text-obsidian-950 mb-1">
                Scenario Authoring Pipeline (Planned Capability)
              </h3>
              <p className="text-xs text-stone-600 max-w-md mb-4 leading-relaxed">
                In the current MVP, scenarios are curated directly from historical dossiers (`SCEN-2002-UBL` and `SCEN-1996-CHRK`). Interactive node authoring is reserved for future backend integration.
              </p>
            </div>
          </Panel>
        </div>

        <Panel title="Example Boundary Parameters" subtitle="REFERENCE SCHEMA">
          <div className="space-y-2.5 text-xs font-mono">
            {[
              { label: 'Airspace Sector', val: 'Zurich ACC / Delhi FIR' },
              { label: 'Surveillance Mode', val: 'Secondary / Primary' },
              { label: 'TCAS Logic', val: 'Version 7.0 (Tau 25s)' },
              { label: 'Branching Model', val: 'Deterministic Predefined' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between p-2.5 rounded-subtle bg-sand-100 border border-obsidian-950/10"
              >
                <span className="text-stone-500">{row.label}</span>
                <span className="text-obsidian-950 font-semibold">{row.val}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};
