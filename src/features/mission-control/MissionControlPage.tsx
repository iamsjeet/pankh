import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  Plane,
  AlertTriangle,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  FileSearch,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { MetricCard } from '@/components/ui/MetricCard';

export const MissionControlPage: React.FC = () => {
  const [rangeNm, setRangeNm] = useState<120 | 250>(250);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-obsidian-950/12">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="accent" dot size="sm">
              PLATFORM OVERVIEW
            </Badge>
            <Badge variant="mono" size="sm">
              ILLUSTRATIVE RADAR
            </Badge>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-obsidian-950">
            Mission Control
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Research repository overview, illustrative frontend radar visualization, and quick module access.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <NavLink to="/app/design-system">
            <Button variant="outline" size="sm">
              Design System
            </Button>
          </NavLink>
          <NavLink to="/app/investigations">
            <Button variant="primary" size="sm" leftIcon={<FileSearch className="w-3.5 h-3.5" />}>
              Incident Library
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Curated Historical Cases"
          value="3"
          unit="Reports"
          icon={<ShieldCheck className="w-4 h-4" />}
          status="cyan"
          subtext="BFU • BEA • DGCA India"
        />

        <MetricCard
          label="Demo Benchmark"
          value="1"
          unit="Record"
          icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
          status="warning"
          subtext="DEMO-2017-SFO retained"
        />

        <MetricCard
          label="Branching Scenarios"
          value="2"
          unit="Ready"
          icon={<Activity className="w-4 h-4 text-emerald-600" />}
          status="nominal"
          subtext="Überlingen & Charkhi Dadri"
        />

        <MetricCard
          label="Illustrative Radar"
          value={`${rangeNm}`}
          unit="NM Range"
          icon={<Plane className="w-4 h-4" />}
          status="neutral"
          subtext="Frontend visual only"
        />
      </div>

      {/* Main Grid: Illustrative Radar & Flight Strips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Selective Dark Radar Viewport */}
        <div className="lg:col-span-2">
          <Panel
            variant="dark"
            title="Illustrative Airspace Radar"
            subtitle="FRONTEND VISUALIZATION ONLY • NOT CONNECTED TO SIM ENGINE OR LIVE ATC"
            badge={<Badge variant="accent" size="sm">{rangeNm} NM</Badge>}
            actionSlot={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setRangeNm((r) => (r === 250 ? 120 : 250))}
                  className="border-white/20 text-sand-50 hover:bg-white/10"
                >
                  Range: {rangeNm} NM
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setRangeNm(250)}
                  leftIcon={<Compass className="w-3 h-3" />}
                  className="border-white/20 text-sand-50 hover:bg-white/10"
                >
                  Recenter
                </Button>
              </div>
            }
          >
            <div className="relative w-full h-80 sm:h-96 rounded-panel bg-obsidian-950 border border-white/10 flex items-center justify-center overflow-hidden bg-dark-grid">
              {/* Concentric Range Rings */}
              <div className="absolute w-72 h-72 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute w-52 h-52 rounded-full border border-white/15 pointer-events-none" />
              <div className="absolute w-32 h-32 rounded-full border border-lime-400/25 pointer-events-none" />
              <div className="absolute w-12 h-12 rounded-full border border-lime-400/40 pointer-events-none" />

              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/10 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/10 pointer-events-none" />

              {/* Animated Radar Sweep */}
              <div className="absolute w-80 h-80 rounded-full animate-radar-sweep pointer-events-none">
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-lime-400/20 to-transparent origin-bottom-right rounded-tl-full" />
              </div>

              {/* Illustrative Aircraft Markers */}
              <div className="absolute top-1/3 left-1/3 flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-lime-400" />
                <div className="px-2 py-1 rounded-subtle bg-obsidian-850/90 border border-lime-400/40 text-2xs font-telemetry text-lime-400">
                  DEMO-01 • FL340 • 460KT
                </div>
              </div>

              <div className="absolute bottom-1/3 right-1/3 flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="px-2 py-1 rounded-subtle bg-obsidian-850/90 border border-amber-500/40 text-2xs font-telemetry text-amber-300">
                  DEMO-02 • FL320 • 440KT
                </div>
              </div>

              <div className="absolute bottom-3 left-3 px-2 py-1 rounded-subtle bg-obsidian-850/90 border border-white/10 text-2xs font-mono text-stone-400">
                ILLUSTRATIVE FRONTEND RADAR • NOT LINKED TO SIM ENGINE
              </div>
            </div>
          </Panel>
        </div>

        {/* Right 1 Col: Illustrative Strips & Direct Links */}
        <div className="space-y-4">
          <Panel
            title="Illustrative Traffic Strips"
            subtitle="STATIC DEMONSTRATION DATA"
            badge={<Badge variant="mono" size="sm">4 Demo</Badge>}
          >
            <div className="space-y-2.5 text-xs font-mono">
              {[
                { callsign: 'DEMO-101', type: 'B788', alt: 'FL340', spd: '460 KT', status: 'nominal' as const },
                { callsign: 'DEMO-204', type: 'A388', alt: 'FL320', spd: '440 KT', status: 'warning' as const },
                { callsign: 'DEMO-472', type: 'A359', alt: 'FL360', spd: '475 KT', status: 'nominal' as const },
                { callsign: 'DEMO-621', type: 'A320', alt: 'FL280', spd: '410 KT', status: 'nominal' as const },
              ].map((flight) => (
                <div
                  key={flight.callsign}
                  className="p-3 rounded-subtle bg-sand-100/80 border border-obsidian-950/10 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-obsidian-950">{flight.callsign}</span>
                      <span className="text-2xs text-stone-500">{flight.type}</span>
                    </div>
                    <div className="text-2xs text-stone-500 flex items-center gap-2 mt-0.5">
                      <span>ALT: {flight.alt}</span>
                      <span>SPD: {flight.spd}</span>
                    </div>
                  </div>
                  <Badge variant={flight.status} size="sm" dot>
                    {flight.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Quick Launch" subtitle="RESEARCH WORKFLOW">
            <p className="text-xs text-stone-600 leading-relaxed">
              Jump directly to the interactive Überlingen (2002) deterministic simulation or inspect
              saved investigation sessions.
            </p>
            <div className="mt-4 pt-3 border-t border-obsidian-950/10 flex flex-col gap-2 text-xs font-mono">
              <NavLink
                to="/app/simulation/HIST-2002-UBL"
                className="inline-flex items-center justify-between text-obsidian-950 font-semibold hover:underline"
              >
                <span>Launch Überlingen Simulation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </NavLink>
              <NavLink
                to="/app/my-investigations"
                className="inline-flex items-center justify-between text-stone-600 hover:text-obsidian-950"
              >
                <span>Open My Investigations</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
