import React, { useState } from 'react';
import { Save, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { Select } from '@/components/ui/Select';
import { useReducedMotion } from '@/animations/useReducedMotion';

export const SettingsPage: React.FC = () => {
  const systemReducedMotion = useReducedMotion();
  const [telemetryRate, setTelemetryRate] = useState('10hz');
  const [graphicsTier, setGraphicsTier] = useState('standard');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleReset = () => {
    setTelemetryRate('10hz');
    setGraphicsTier('standard');
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-obsidian-950/12">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="default" size="sm">CONFIG</Badge>
            {savedNotice && (
              <Badge variant="nominal" size="sm">
                <CheckCircle2 className="w-3 h-3" /> Preferences Saved
              </Badge>
            )}
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-obsidian-950">
            Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Rendering quality, motion accessibility status, and playback preferences.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Defaults
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} leftIcon={<Save className="w-3.5 h-3.5" />}>
            Save Preferences
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Panel
          title="Graphics & Performance"
          subtitle="OPTIMIZED FOR INTEGRATED INTEL ARC / LAPTOP HARDWARE"
          badge={<Badge variant="nominal" size="sm">Adaptive</Badge>}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-2xs font-mono uppercase text-stone-500 mb-1.5">
                WebGL / 3D Rendering Tier
              </label>
              <Select
                options={[
                  { value: 'standard', label: 'Standard (Integrated GPU — low-poly geometry, capped DPR)' },
                  { value: 'low', label: 'Power Saver (Static SVG orbital fallback)' },
                ]}
                value={graphicsTier}
                onChange={(e) => setGraphicsTier(e.target.value)}
              />
            </div>

            <div className="p-3.5 rounded-panel bg-sand-100 border border-obsidian-950/10 flex items-center justify-between">
              <div>
                <span className="font-semibold text-obsidian-950">System Reduced Motion</span>
                <p className="text-2xs text-stone-500 mt-0.5">
                  Automatically respects OS accessibility preferences (`prefers-reduced-motion`).
                </p>
              </div>
              <Badge variant={systemReducedMotion ? 'warning' : 'nominal'} dot>
                {systemReducedMotion ? 'ACTIVE' : 'INACTIVE'}
              </Badge>
            </div>
          </div>
        </Panel>

        <Panel
          title="Playback Sampling"
          subtitle="DETERMINISTIC SCENARIO TIMELINE"
        >
          <div className="space-y-2 text-xs">
            <label className="block text-2xs font-mono uppercase text-stone-500">
              Frame Interpolation Frequency
            </label>
            <Select
              options={[
                { value: '5hz', label: '5 Hz (Low CPU)' },
                { value: '10hz', label: '10 Hz (Standard Playback)' },
              ]}
              value={telemetryRate}
              onChange={(e) => setTelemetryRate(e.target.value)}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
};
