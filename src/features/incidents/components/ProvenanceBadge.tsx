import React from 'react';
import { ProvenanceType } from '../types/incident';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/utils/cn';

export interface ProvenanceBadgeProps {
  provenance: ProvenanceType;
  size?: 'sm' | 'md';
  className?: string;
  showTooltip?: boolean;
}

interface ProvenanceConfig {
  label: string;
  shortLabel: string;
  badgeClass: string;
  dotColor: string;
  description: string;
}

const PROVENANCE_MAP: Record<ProvenanceType, ProvenanceConfig> = {
  REPORTED_FACT: {
    label: 'Reported Fact',
    shortLabel: 'FACT',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    description: 'Direct factual evidence verified by flight data, voice recorders, or radar telemetry.',
  },
  OFFICIAL_FINDING: {
    label: 'Official Finding',
    shortLabel: 'OFFICIAL',
    badgeClass: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-glow-cyan-sm',
    dotColor: 'bg-cyan-400',
    description: 'Formal causal or contributory finding determined by state accident investigation boards.',
  },
  AI_INTERPRETATION: {
    label: 'AI Interpretation',
    shortLabel: 'AI MODEL',
    badgeClass: 'bg-purple-950/60 text-purple-300 border-purple-500/30',
    dotColor: 'bg-purple-400',
    description: 'Algorithmic pattern correlation or automated trajectory reconstruction.',
  },
  HUMAN_ASSUMPTION: {
    label: 'Human Assumption',
    shortLabel: 'ASSUMPTION',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
    dotColor: 'bg-amber-400',
    description: 'Witness recollection, retrospective hypothesis, or unrecorded physiological estimation.',
  },
  UNKNOWN: {
    label: 'Unknown / Unresolved',
    shortLabel: 'UNKNOWN',
    badgeClass: 'bg-navy-900 text-slate-400 border-navy-700',
    dotColor: 'bg-slate-400',
    description: 'Unresolved anomaly, telemetry gap, or inconclusive investigation finding.',
  },
  DEMO_DATA: {
    label: 'Demonstration Data',
    shortLabel: 'DEMO',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/40 border-dashed',
    dotColor: 'bg-amber-400',
    description: 'Illustrative demonstration marker for research testing. Not certified historical data.',
  },
};

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  provenance,
  size = 'sm',
  className,
  showTooltip = true,
}) => {
  const config = PROVENANCE_MAP[provenance] || PROVENANCE_MAP.DEMO_DATA;

  const badgeElement = (
    <span
      className={cn(
        'inline-flex items-center font-mono font-medium border uppercase tracking-wider rounded select-none',
        size === 'sm' ? 'px-1.5 py-0.5 text-2xs gap-1' : 'px-2 py-0.5 text-xs gap-1.5',
        config.badgeClass,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotColor)} />
      <span>{config.label}</span>
    </span>
  );

  if (!showTooltip) {
    return badgeElement;
  }

  return (
    <Tooltip content={config.description} side="top">
      {badgeElement}
    </Tooltip>
  );
};
