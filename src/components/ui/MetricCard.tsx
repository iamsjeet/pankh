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
    cyan: 'border-l-cyan-500',
    neutral: 'border-l-navy-600',
  };

  const deltaColors = {
    up: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20',
    down: 'text-crimson-400 bg-crimson-950/40 border-crimson-500/20',
    neutral: 'text-slate-400 bg-navy-800/40 border-navy-700/40',
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -2 } : undefined}
      onClick={onClick}
      className={cn(
        'panel-surface p-4 rounded-panel border-l-2 relative overflow-hidden transition-all duration-200',
        statusColors[status],
        interactive && 'cursor-pointer hover:border-cyan-500/40 hover:shadow-glow-cyan-sm',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-2xs font-mono uppercase tracking-widest text-slate-400">
          {label}
        </span>
        {icon && (
          <div className="p-1.5 rounded-subtle bg-navy-800/80 text-slate-300 border border-navy-700/60 shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-heading text-2xl font-bold tracking-tight text-white font-telemetry">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
            {unit}
          </span>
        )}
      </div>

      {(delta || subtext) && (
        <div className="mt-2.5 pt-2 border-t border-navy-800/60 flex items-center justify-between text-2xs">
          {delta && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border font-mono font-medium',
                deltaColors[delta.trend]
              )}
            >
              {delta.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
              {delta.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
              {delta.trend === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{delta.value}</span>
              {delta.label && <span className="text-slate-400 ml-1">{delta.label}</span>}
            </span>
          )}
          {subtext && <span className="text-slate-500 font-mono text-2xs truncate">{subtext}</span>}
        </div>
      )}
    </motion.div>
  );
};
