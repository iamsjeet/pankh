import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  Plane,
  AlertTriangle,
  Radio,
  Compass,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { MetricCard } from '@/components/ui/MetricCard';

export const MissionControlPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Mission Control
            </h1>
            <Badge variant="active" dot pulse size="sm">
              AIRSPACE MONITOR
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Platform telemetry overview, illustrative airspace radar, and live safety incident feed.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <NavLink to="/app/design-system">
            <Button variant="outline" size="sm">
              View Design System
            </Button>
          </NavLink>
          <Button variant="primary" size="sm" leftIcon={<Radio className="w-3.5 h-3.5" />}>
            Connect Telemetry
          </Button>
        </div>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Tracked Airborne Units"
          value="48"
          unit="Sim Units"
          delta={{ value: '+4', trend: 'up' }}
          icon={<Plane className="w-4 h-4 text-cyan-400" />}
          status="cyan"
          subtext="Illustrative radar feeds"
        />

        <MetricCard
          label="Separation Anomalies"
          value="2"
          unit="Events"
          delta={{ value: '-1', trend: 'down', label: 'resolved' }}
          icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
          status="warning"
          subtext="Loss of separation warning"
        />

        <MetricCard
          label="Simulation Engine"
          value="Nominal"
          unit="60 FPS"
          icon={<Activity className="w-4 h-4 text-emerald-400" />}
          status="nominal"
          subtext="Kinematic solver idle"
        />

        <MetricCard
          label="Curated Benchmark DB"
          value="4"
          unit="Records"
          icon={<ShieldCheck className="w-4 h-4 text-aviation-400" />}
          status="neutral"
          subtext="Demo benchmark repository"
        />
      </div>

      {/* Main Grid: Radar Preview & Flight Strip List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Illustrative Radar Visualization Canvas */}
        <div className="lg:col-span-2">
          <Panel
            title="Interactive Airspace Radar"
            subtitle="ILLUSTRATIVE FRONTEND SWEEP • SECTOR VIDF_CTR"
            badge={<Badge variant="active" size="sm">250 NM</Badge>}
            actionSlot={
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="xs">
                  Range: 120 NM
                </Button>
                <Button variant="outline" size="xs" leftIcon={<Compass className="w-3 h-3" />}>
                  Recenter
                </Button>
              </div>
            }
          >
            {/* Illustrative Radar Viewport */}
            <div className="relative w-full h-80 sm:h-96 rounded-panel bg-navy-950 border border-navy-800 flex items-center justify-center overflow-hidden bg-tactical-dots">
              {/* Concentric Range Rings */}
              <div className="absolute w-72 h-72 rounded-full border border-cyan-500/10 pointer-events-none" />
              <div className="absolute w-52 h-52 rounded-full border border-cyan-500/15 pointer-events-none" />
              <div className="absolute w-32 h-32 rounded-full border border-cyan-500/20 pointer-events-none" />
              <div className="absolute w-12 h-12 rounded-full border border-cyan-500/25 pointer-events-none" />

              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/10 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/10 pointer-events-none" />

              {/* Animated Radar Sweep */}
              <div className="absolute w-80 h-80 rounded-full animate-radar-sweep pointer-events-none">
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/20 to-transparent origin-bottom-right rounded-tl-full" />
              </div>

              {/* Illustrative Aircraft Markers */}
              <div className="absolute top-1/3 left-1/3 flex items-center gap-1.5 cursor-pointer group">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan-sm animate-pulse" />
                <div className="p-1 rounded bg-navy-900/90 border border-navy-700 text-2xs font-telemetry text-cyan-300">
                  AIC101 • FL340 • 460KT
                </div>
              </div>

              <div className="absolute bottom-1/3 right-1/3 flex items-center gap-1.5 cursor-pointer group">
                <div className="w-2 h-2 rounded-full bg-amber-400 shadow-glow-amber animate-pulse" />
                <div className="p-1 rounded bg-navy-900/90 border border-amber-500/40 text-2xs font-telemetry text-amber-300">
                  UAE204 • FL320 • 440KT
                </div>
              </div>

              {/* Disclaimer Notice */}
              <div className="absolute bottom-3 left-3 text-2xs font-mono text-slate-500">
                ILLUSTRATIVE FRONTEND RADAR • NOT LINKED TO SIM ENGINE
              </div>
            </div>
          </Panel>
        </div>

        {/* Right 1 Col: Recent Incident Feed & Flight Strips */}
        <div className="space-y-4">
          <Panel
            title="Active Flight Strips"
            subtitle="TELEMETRY READOUTS"
            badge={<Badge variant="default" size="sm">6 Monitored</Badge>}
          >
            <div className="space-y-2.5 text-xs font-mono">
              {[
                { callsign: 'AIC-101', type: 'B788', alt: 'FL340', spd: '460 KT', status: 'nominal' as const },
                { callsign: 'UAE-204', type: 'A388', alt: 'FL320', spd: '440 KT', status: 'warning' as const },
                { callsign: 'DLH-472', type: 'A359', alt: 'FL360', spd: '475 KT', status: 'nominal' as const },
                { callsign: 'IGO-621', type: 'A320', alt: 'FL280', spd: '410 KT', status: 'nominal' as const },
              ].map((flight) => (
                <div
                  key={flight.callsign}
                  className="p-2.5 rounded-panel bg-navy-900/80 border border-navy-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{flight.callsign}</span>
                      <span className="text-2xs text-slate-400">{flight.type}</span>
                    </div>
                    <div className="text-2xs text-slate-400 flex items-center gap-2 mt-0.5">
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

          <Panel
            title="Safety Research Notes"
            subtitle="CURRENT BENCHMARK"
          >
            <p className="text-xs text-slate-300 leading-relaxed">
              Scenario <strong>SC-2024-08</strong> evaluates collision avoidance latency under adverse wind shear in high-density terminal airspace.
            </p>
            <div className="mt-3 pt-3 border-t border-navy-800 flex justify-between items-center text-2xs text-cyan-300 font-mono">
              <NavLink to="/app/scenario-forge" className="inline-flex items-center gap-1 hover:underline">
                <span>Open in Scenario Forge</span>
                <ArrowUpRight className="w-3 h-3" />
              </NavLink>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
