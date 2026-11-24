import React, { useState } from 'react';
import {
  Key,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useReducedMotion } from '@/animations/useReducedMotion';

export const SettingsPage: React.FC = () => {
  const systemReducedMotion = useReducedMotion();
  const [telemetryRate, setTelemetryRate] = useState('10hz');
  const [apiKey, setApiKey] = useState('sk-pankh-research-demo-key');
  const [graphicsTier, setGraphicsTier] = useState('standard');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Platform Settings
            </h1>
            <Badge variant="default" size="sm">
              CONFIG
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Telemetry ingestion rates, GPU rendering quality, motion preferences, and research credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Defaults
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Settings Panels */}
      <div className="space-y-4">
        {/* Visual & Graphics Performance */}
        <Panel
          title="Graphics & Performance"
          subtitle="OPTIMIZED FOR LAPTOP WITH INTEGRATED INTEL GRAPHICS"
          badge={<Badge variant="nominal" size="sm">Adaptive</Badge>}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-2xs font-mono uppercase text-slate-400 mb-1">
                WebGL / 3D Graphics Tier
              </label>
              <Select
                options={[
                  { value: 'standard', label: 'Standard (Integrated GPU - Cap at 60 FPS, reduced shaders)' },
                  { value: 'high', label: 'High Fidelity (Discrete GPU - Bloom, shadows, high sample count)' },
                  { value: 'low', label: 'Power Saver / Low (2D fallbacks, minimal draw calls)' },
                ]}
                value={graphicsTier}
                onChange={(e) => setGraphicsTier(e.target.value)}
              />
            </div>

            <div className="p-3 rounded bg-navy-900 border border-navy-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">System Reduced Motion</span>
                <p className="text-2xs text-slate-400">
                  Respects Windows OS accessibility preferences for reduced motion.
                </p>
              </div>
              <Badge variant={systemReducedMotion ? 'warning' : 'nominal'} dot>
                {systemReducedMotion ? 'ACTIVE' : 'INACTIVE'}
              </Badge>
            </div>
          </div>
        </Panel>

        {/* Telemetry & Solver Ingestion */}
        <Panel
          title="Simulation & Telemetry Ingestion"
          subtitle="UPDATE FREQUENCY & REPLAY SAMPLING"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-2xs font-mono uppercase text-slate-400 mb-1">
                Telemetry Streaming Frequency
              </label>
              <Select
                options={[
                  { value: '1hz', label: '1 Hz (Low Bandwidth / Long Sessions)' },
                  { value: '5hz', label: '5 Hz (Balanced Tactical View)' },
                  { value: '10hz', label: '10 Hz (Real-time Flight Dynamics Replay)' },
                  { value: '20hz', label: '20 Hz (High Precision Aerodynamic Analysis)' },
                ]}
                value={telemetryRate}
                onChange={(e) => setTelemetryRate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-2xs font-mono uppercase text-slate-400 mb-1">
                AI Investigation API Key
              </label>
              <Input
                mono
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                leftIcon={<Key className="w-3.5 h-3.5" />}
              />
              <span className="text-2xs text-slate-500 font-mono mt-1 block">
                Local research session key. Not transmitted to external public endpoints without consent.
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};
