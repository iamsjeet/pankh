import React from 'react';
import { cn } from '@/utils/cn';
import { STATUS_CONFIGS, type StatusLevel } from '@/tokens/designTokens';

export type BadgeVariant = StatusLevel | 'default' | 'accent' | 'mono';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  nominal: `${STATUS_CONFIGS.nominal.badgeBg} ${STATUS_CONFIGS.nominal.badgeBorder} ${STATUS_CONFIGS.nominal.badgeText}`,
  active: `${STATUS_CONFIGS.active.badgeBg} ${STATUS_CONFIGS.active.badgeBorder} ${STATUS_CONFIGS.active.badgeText}`,
  investigating: `${STATUS_CONFIGS.investigating.badgeBg} ${STATUS_CONFIGS.investigating.badgeBorder} ${STATUS_CONFIGS.investigating.badgeText}`,
  warning: `${STATUS_CONFIGS.warning.badgeBg} ${STATUS_CONFIGS.warning.badgeBorder} ${STATUS_CONFIGS.warning.badgeText}`,
  critical: `${STATUS_CONFIGS.critical.badgeBg} ${STATUS_CONFIGS.critical.badgeBorder} ${STATUS_CONFIGS.critical.badgeText}`,
  idle: `${STATUS_CONFIGS.idle.badgeBg} ${STATUS_CONFIGS.idle.badgeBorder} ${STATUS_CONFIGS.idle.badgeText}`,
  default: 'bg-navy-800 text-slate-300 border-navy-700/80',
  accent: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30 shadow-glow-cyan-sm',
  mono: 'bg-navy-900/90 text-slate-300 border-navy-700 font-telemetry text-2xs',
};

const dotColors: Record<BadgeVariant, string> = {
  nominal: 'bg-emerald-400',
  active: 'bg-cyan-400',
  investigating: 'bg-aviation-400',
  warning: 'bg-amber-400',
  critical: 'bg-crimson-500',
  idle: 'bg-slate-400',
  default: 'bg-slate-400',
  accent: 'bg-cyan-400',
  mono: 'bg-cyan-400',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border uppercase tracking-wider select-none rounded-subtle',
        size === 'sm' ? 'px-1.5 py-0.5 text-2xs gap-1' : 'px-2 py-0.5 text-tactical gap-1.5',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                dotColors[variant]
              )}
            />
          )}
          <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', dotColors[variant])} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
