import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  status?: 'nominal' | 'warning' | 'critical' | 'cyan' | 'neutral';
  subtext?: string;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  delta,
  icon,
  status = 'neutral',
  subtext,
  className,
  interactive = false,
  onClick,
}) => {
  const statusColors = {
    nominal: 'border-l-emerald-500',
    warning: 'border-l-amber-500',
    critical: 'border-l-crimson-500',
    cyan: 'border-l-lime-500',
    neutral: 'border-l-obsidian-950/30',
  };

  const deltaColors = {
    up: 'text-emerald-700 bg-emerald-100/80 border-emerald-600/20',
    down: 'text-crimson-700 bg-crimson-100/80 border-crimson-600/20',
    neutral: 'text-stone-600 bg-sand-100 border-obsidian-950/15',
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -2 } : undefined}
      onClick={onClick}
      className={cn(
        'panel-surface p-4 rounded-panel border-l-2 relative overflow-hidden transition-all duration-200',
        statusColors[status],
        interactive && 'cursor-pointer hover:border-obsidian-950/30 hover:shadow-editorial-hover',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-2xs font-mono uppercase tracking-widest text-stone-500">
          {label}
        </span>
        {icon && (
          <div className="p-1.5 rounded-subtle bg-sand-100 text-obsidian-950 border border-obsidian-950/10 shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-heading text-2xl font-bold tracking-tight text-obsidian-950 font-telemetry">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-stone-500 tracking-wider uppercase">
            {unit}
          </span>
        )}
      </div>

      {(delta || subtext) && (
        <div className="mt-2.5 flex items-center justify-between gap-2 text-2xs">
          {delta && (
            <span
              className={cn(
                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-mono font-medium',
                deltaColors[delta.trend]
              )}
            >
              {delta.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
              {delta.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
              {delta.trend === 'neutral' && <Minus className="w-3 h-3" />}
              {delta.value}
              {delta.label && <span className="opacity-75">{delta.label}</span>}
            </span>
          )}
          {subtext && <span className="text-stone-500 font-mono truncate">{subtext}</span>}
        </div>
      )}
    </motion.div>
  );
};
