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
    badgeClass: 'bg-emerald-100/80 text-emerald-700 border-emerald-600/25',
    dotColor: 'bg-emerald-500',
    description: 'Direct factual evidence verified by flight data, voice recorders, or radar telemetry.',
  },
  OFFICIAL_FINDING: {
    label: 'Official Finding',
    shortLabel: 'OFFICIAL',
    badgeClass: 'bg-lime-400/45 text-obsidian-950 border-lime-600/35 font-semibold',
    dotColor: 'bg-obsidian-950',
    description: 'Formal causal or contributory finding determined by state accident investigation boards.',
  },
  AI_INTERPRETATION: {
    label: 'AI Interpretation',
    shortLabel: 'AI MODEL',
    badgeClass: 'bg-obsidian-950 text-sand-50 border-obsidian-950',
    dotColor: 'bg-lime-400',
    description: 'Algorithmic pattern correlation or automated trajectory reconstruction.',
  },
  HUMAN_ASSUMPTION: {
    label: 'Human Assumption',
    shortLabel: 'ASSUMPTION',
    badgeClass: 'bg-amber-100/80 text-amber-700 border-amber-600/30',
    dotColor: 'bg-amber-500',
    description: 'Witness recollection, retrospective hypothesis, or unrecorded physiological estimation.',
  },
  UNKNOWN: {
    label: 'Unknown / Unresolved',
    shortLabel: 'UNKNOWN',
    badgeClass: 'bg-sand-100 text-stone-600 border-obsidian-950/15',
    dotColor: 'bg-stone-500',
    description: 'Unresolved anomaly, telemetry gap, or inconclusive investigation finding.',
  },
  DEMO_DATA: {
    label: 'Demonstration Data',
    shortLabel: 'DEMO',
    badgeClass: 'bg-amber-100/60 text-amber-700 border-amber-600/40 border-dashed',
    dotColor: 'bg-amber-500',
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
        'inline-flex items-center font-mono font-medium border uppercase tracking-wider rounded-subtle select-none',
        size === 'sm' ? 'px-1.5 py-0.5 text-2xs gap-1' : 'px-2.5 py-0.5 text-xs gap-1.5',
        config.badgeClass,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotColor)} />
      <span>{size === 'sm' ? config.shortLabel : config.label}</span>
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
