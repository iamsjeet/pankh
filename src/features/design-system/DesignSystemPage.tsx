import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Sparkles,
  Plane,
  ShieldAlert,
  Activity,
  Terminal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  RefreshCw,
  Compass,
  ArrowUpRight,
  Database,
} from 'lucide-react';
import {
  Button,
  Badge,
  Panel,
  MetricCard,
  Input,
  SearchBar,
  Tabs,
  Select,
  Tooltip,
} from '@/components/ui';
import { useReducedMotion } from '@/animations/useReducedMotion';
import { staggerContainer } from '@/animations/variants';

export const DesignSystemPage: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState('primitives');
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedAirspace, setSelectedAirspace] = useState('delhi-fir');

  const demoTabs = [
    { id: 'primitives', label: 'Core Primitives', icon: <Layers className="w-3.5 h-3.5" />, badge: '6' },
    { id: 'tokens', label: 'Color & Tokens', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'telemetry', label: 'Telemetry & Cards', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'motion', label: 'Motion & Access', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              PANKH Design System
            </h1>
            <Badge variant="accent" size="sm">
              SPEC v1.0
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono tracking-wide">
            Precision aerospace tokens, components, typography and motion primitives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={prefersReduced ? 'warning' : 'nominal'} dot pulse>
            {prefersReduced ? 'REDUCED MOTION ACTIVE' : 'FULL MOTION ACTIVE'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setBtnLoading(true);
              setTimeout(() => setBtnLoading(false), 1200);
            }}
            isLoading={btnLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Test State
          </Button>
        </div>
      </div>

      {/* Showcase Navigation Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Tabs tabs={demoTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* TAB 1: CORE PRIMITIVES */}
      {activeTab === 'primitives' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.06)}
          className="space-y-8"
        >
          {/* Button Matrix */}
          <Panel
            title="Buttons & Actions"
            subtitle="VARIANTS, SIZES, SLOTS & STATES"
            badge={<Badge variant="active" size="sm">Interactive</Badge>}
          >
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h4 className="text-2xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  1. Color Variants
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" leftIcon={<Zap className="w-3.5 h-3.5" />}>
                    Primary Cyan
                  </Button>
                  <Button variant="secondary" leftIcon={<Plane className="w-3.5 h-3.5" />}>
                    Secondary Navy
                  </Button>
                  <Button variant="outline" leftIcon={<Terminal className="w-3.5 h-3.5" />}>
                    Outline Technical
                  </Button>
                  <Button variant="ghost">Ghost Action</Button>
                  <Button variant="danger" leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}>
                    Critical Danger
                  </Button>
                  <Button variant="warning" leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}>
                    Caution Warning
                  </Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-2xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  2. Sizing Scale
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="xs">XS (24px)</Button>
                  <Button variant="primary" size="sm">SM (32px)</Button>
                  <Button variant="primary" size="md">MD (36px Standard)</Button>
                  <Button variant="primary" size="lg">LG (44px Hero)</Button>
                </div>
              </div>

              {/* Interactive Loading and Tooltips */}
              <div>
                <h4 className="text-2xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  3. Loading, Tooltips & Disabled States
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" isLoading>
                    Processing
                  </Button>
                  <Button variant="secondary" disabled leftIcon={<Plane className="w-3.5 h-3.5" />}>
                    Disabled Action
                  </Button>
                  <Tooltip content="Dispatches Monte Carlo collision detection" shortcut="⌘R">
                    <Button variant="outline" leftIcon={<Compass className="w-3.5 h-3.5" />}>
                      Hover for Tooltip
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </Panel>

          {/* Badges & Status Indicators */}
          <Panel
            title="Tactical Badges & Telemetry Status"
            subtitle="RESTRICTED FLIGHT & INCIDENT CLASSIFICATIONS"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="nominal" dot pulse>
                  Nominal Track
                </Badge>
                <Badge variant="active" dot pulse>
                  Active Radar Lock
                </Badge>
                <Badge variant="investigating" dot>
                  AI Investigation
                </Badge>
                <Badge variant="warning" dot pulse>
                  TCAS Resolution Advisory
                </Badge>
                <Badge variant="critical" dot pulse>
                  Near Mid-Air Collision
                </Badge>
                <Badge variant="idle" dot>
                  Standby
                </Badge>
                <Badge variant="accent">Electric Cyan</Badge>
                <Badge variant="mono">ICAO: VIDP-VABB</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-2xs font-mono text-slate-400">Small Variant:</span>
                <Badge variant="nominal" size="sm" dot>Nominal</Badge>
                <Badge variant="active" size="sm" dot>Active</Badge>
                <Badge variant="warning" size="sm" dot>Warning</Badge>
                <Badge variant="critical" size="sm" dot>Critical</Badge>
              </div>
            </div>
          </Panel>

          {/* Inputs & Selectors */}
          <Panel title="Form Controls & Inputs" subtitle="AEROSPACE MONOSPACE AND COMMAND INPUTS">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-2xs font-mono uppercase text-slate-400 mb-1">
                  Flight Call-sign (Mono Input)
                </label>
                <Input
                  mono
                  placeholder="e.g. AIC-101 / ICAO VIDP"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  leftIcon={<Plane className="w-3.5 h-3.5" />}
                />
              </div>

              <div>
                <label className="block text-2xs font-mono uppercase text-slate-400 mb-1">
                  Airspace Sector
                </label>
                <Select
                  options={[
                    { value: 'delhi-fir', label: 'Delhi FIR (VIDF) — High Density' },
                    { value: 'mumbai-fir', label: 'Mumbai FIR (VABF) — Oceanic En-route' },
                    { value: 'kolkata-fir', label: 'Kolkata FIR (VECF) — Cross-border' },
                    { value: 'chennai-fir', label: 'Chennai FIR (VOMF) — Bay of Bengal' },
                  ]}
                  value={selectedAirspace}
                  onChange={(e) => setSelectedAirspace(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-2xs font-mono uppercase text-slate-400 mb-1">
                  Command Search Bar
                </label>
                <SearchBar
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Filter incident library..."
                />
              </div>
            </div>
          </Panel>
        </motion.div>
      )}

      {/* TAB 2: COLOR TOKENS */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          <Panel title="Aviation Intelligence Color System" subtitle="PALETTE MATRIX & CONTRAST RATIOS">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Midnight Navy Scale */}
              <div className="p-4 rounded-panel bg-navy-900 border border-navy-700/80 space-y-2">
                <span className="text-xs font-heading font-semibold text-white">Midnight Navy (Backgrounds)</span>
                <div className="space-y-1.5 pt-2 text-2xs font-mono">
                  <div className="flex items-center justify-between p-1.5 rounded bg-navy-950 border border-navy-800">
                    <span>Abyss (Canvas Ground)</span>
                    <span>#050811</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-navy-900 border border-navy-800">
                    <span>Base Shell</span>
                    <span>#090E1A</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-navy-850 border border-navy-700">
                    <span>Panel Surface</span>
                    <span>#0D1525</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-navy-800 border border-navy-700">
                    <span>Elevated Surface</span>
                    <span>#121D33</span>
                  </div>
                </div>
              </div>

              {/* Electric Cyan Accent */}
              <div className="p-4 rounded-panel bg-navy-900 border border-navy-700/80 space-y-2">
                <span className="text-xs font-heading font-semibold text-cyan-300">Electric Cyan (Primary Accent)</span>
                <div className="space-y-1.5 pt-2 text-2xs font-mono">
                  <div className="p-2 rounded bg-cyan-500 text-navy-950 font-bold flex justify-between">
                    <span>Primary Cyan</span>
                    <span>#00F0FF</span>
                  </div>
                  <div className="p-2 rounded bg-cyan-400 text-navy-950 font-semibold flex justify-between">
                    <span>Cyan 400</span>
                    <span>#22D3EE</span>
                  </div>
                  <div className="p-2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex justify-between">
                    <span>Cyan Glow/Subtle</span>
                    <span>rgba(0,240,255,0.1)</span>
                  </div>
                </div>
              </div>

              {/* Aviation Blue */}
              <div className="p-4 rounded-panel bg-navy-900 border border-navy-700/80 space-y-2">
                <span className="text-xs font-heading font-semibold text-aviation-300">Aviation Blue (Secondary)</span>
                <div className="space-y-1.5 pt-2 text-2xs font-mono">
                  <div className="p-2 rounded bg-aviation-500 text-white font-semibold flex justify-between">
                    <span>Aviation 500</span>
                    <span>#3B82F6</span>
                  </div>
                  <div className="p-2 rounded bg-aviation-700 text-slate-100 flex justify-between">
                    <span>Aviation Deep</span>
                    <span>#1D4ED8</span>
                  </div>
                  <div className="p-2 rounded bg-aviation-900 text-aviation-300 border border-aviation-500/30 flex justify-between">
                    <span>Aviation Surface</span>
                    <span>#172554</span>
                  </div>
                </div>
              </div>

              {/* Restrained Amber & Critical Crimson */}
              <div className="p-4 rounded-panel bg-navy-900 border border-navy-700/80 space-y-2">
                <span className="text-xs font-heading font-semibold text-amber-300">Warning & Critical</span>
                <div className="space-y-1.5 pt-2 text-2xs font-mono">
                  <div className="p-2 rounded bg-amber-500 text-navy-950 font-bold flex justify-between">
                    <span>Caution Amber</span>
                    <span>#F59E0B</span>
                  </div>
                  <div className="p-2 rounded bg-crimson-600 text-white font-bold flex justify-between">
                    <span>Critical Alert</span>
                    <span>#DC2626</span>
                  </div>
                  <div className="p-2 rounded bg-emerald-500 text-navy-950 font-bold flex justify-between">
                    <span>Nominal Green</span>
                    <span>#10B981</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* Typography Scale */}
          <Panel title="Typography & Font Hierarchy" subtitle="SPACE GROTESK + INTER + JETBRAINS MONO">
            <div className="space-y-4">
              <div className="p-4 rounded bg-navy-900 border border-navy-800">
                <span className="text-2xs font-mono text-cyan-400">Heading 1 • Space Grotesk Bold</span>
                <h1 className="font-heading text-3xl font-bold text-white mt-1">
                  Airspace Incident Replay & Safety Simulation
                </h1>
              </div>
              <div className="p-4 rounded bg-navy-900 border border-navy-800">
                <span className="text-2xs font-mono text-cyan-400">Heading 2 • Space Grotesk SemiBold</span>
                <h2 className="font-heading text-xl font-semibold text-slate-200 mt-1">
                  Trajectory Conflict Analysis & Loss of Separation Matrix
                </h2>
              </div>
              <div className="p-4 rounded bg-navy-900 border border-navy-800">
                <span className="text-2xs font-mono text-cyan-400">Interface Body • Inter Regular</span>
                <p className="font-sans text-sm text-slate-300 mt-1 leading-relaxed">
                  The primary collision avoidance advisory was synthesized based on flight recorder telemetry.
                  Altitude deviation of 450 feet was detected under gust turbulence conditions at waypoint KARMA.
                </p>
              </div>
              <div className="p-4 rounded bg-navy-900 border border-navy-800">
                <span className="text-2xs font-mono text-cyan-400">Telemetry Data • JetBrains Mono</span>
                <p className="font-telemetry text-xs text-cyan-300 mt-1">
                  LAT: 28°34'07"N | LON: 077°06'44"E | ALT: FL340 (34,000 FT) | MACH: 0.81 | HDG: 247°
                </p>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* TAB 3: TELEMETRY & CARDS */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Tracked Incidents"
              value="1,428"
              unit="Reports"
              delta={{ value: '+12%', trend: 'up', label: 'vs Q3' }}
              icon={<Database className="w-4 h-4 text-cyan-400" />}
              status="cyan"
              subtext="NTSB, AAIB, DGCA archives"
              interactive
            />

            <MetricCard
              label="Simulation Risk Score"
              value="0.042"
              unit="Loss/h"
              delta={{ value: '-8.4%', trend: 'down', label: 'improved' }}
              icon={<ShieldAlert className="w-4 h-4 text-emerald-400" />}
              status="nominal"
              subtext="Monte Carlo 10,000 runs"
              interactive
            />

            <MetricCard
              label="Near Mid-Air Advisories"
              value="3"
              unit="Active"
              delta={{ value: '+1', trend: 'up', label: 'critical' }}
              icon={<Flame className="w-4 h-4 text-crimson-400" />}
              status="critical"
              subtext="Separation < 2.5 nm"
              interactive
            />

            <MetricCard
              label="Mean Controller Latency"
              value="148"
              unit="ms"
              delta={{ value: '0.0%', trend: 'neutral', label: 'steady' }}
              icon={<Activity className="w-4 h-4 text-amber-400" />}
              status="warning"
              subtext="RL model response time"
              interactive
            />
          </div>

          {/* Layered Aerospace Surface Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel
              variant="default"
              title="Standard Layer 1 Surface (panel-surface)"
              subtitle="BG-NAVY-850 + SUBTLE GLASS + 1PX LOW CONTRAST BORDER"
              actionSlot={
                <Button variant="ghost" size="xs">
                  Inspect
                </Button>
              }
              footerSlot="Used for secondary charts, logs, incident listing rows and sidebar widgets."
            >
              <p className="text-xs text-slate-300 leading-relaxed">
                Layered panels provide clean visual grouping without distracting high-contrast card borders.
                Glassmorphism is restrained to 12px blur, ensuring zero lag on integrated Intel GPUs.
              </p>
            </Panel>

            <Panel
              variant="elevated"
              title="Elevated Layer 2 Surface (panel-surface-elevated)"
              subtitle="BG-NAVY-800 + BLUR-16PX + HIGH ELEVATION SHADOW"
              badge={<Badge variant="accent" size="sm">Elevated</Badge>}
              actionSlot={
                <Button variant="primary" size="xs">
                  Active
                </Button>
              }
              footerSlot="Used for modal dialogues, floating control panels and active inspection inspectors."
            >
              <p className="text-xs text-slate-300 leading-relaxed">
                Higher elevation surface for foreground widgets, scenario inspectors and simulation execution controls.
              </p>
            </Panel>
          </div>
        </div>
      )}

      {/* TAB 4: MOTION & ACCESSIBILITY */}
      {activeTab === 'motion' && (
        <div className="space-y-6">
          <Panel
            title="Motion Standards & Reduced Motion Fallbacks"
            subtitle="MOTION FOR REACT EASE CURVES & SYSTEM ACCESSIBILITY"
          >
            <div className="space-y-6">
              <div className="p-4 rounded-panel bg-navy-900 border border-navy-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-semibold text-white mb-1">Accessibility First</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Animations automatically adapt if the user has enabled "Reduce Motion" in Windows Settings.
                    All transform/slide transitions collapse to instant or fast opacity fades via our{' '}
                    <code className="text-cyan-400 font-mono">useReducedMotion</code> hook.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-panel bg-navy-850 border border-navy-700/80 hover:border-cyan-500/50 cursor-pointer transition-colors"
                >
                  <h5 className="font-heading font-semibold text-sm text-cyan-300 mb-1">
                    Hover Lift
                  </h5>
                  <p className="text-2xs text-slate-400">
                    Smooth 200ms cubic-bezier transition on card surfaces.
                  </p>
                </motion.div>

                <div className="p-4 rounded-panel bg-navy-850 border border-navy-700/80 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-heading font-semibold text-sm text-emerald-300">
                      Radar Pulse
                    </h5>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <p className="text-2xs text-slate-400">
                    Subtle periodic beacon pulse for live telemetry nodes.
                  </p>
                </div>

                <div className="p-4 rounded-panel bg-navy-850 border border-navy-700/80 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-heading font-semibold text-sm text-amber-300">
                      Stagger Fade
                    </h5>
                    <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xs text-slate-400">
                    Calculated staggered cascade (50ms per item) for dense datasets.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
};
