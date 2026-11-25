import React from 'react';
import { cn } from '@/utils/cn';
import { STATUS_CONFIGS, type StatusLevel } from '@/tokens/designTokens';

export type BadgeVariant = StatusLevel | 'default' | 'accent' | 'mono' | 'dark';

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
  default: 'bg-sand-100 text-obsidian-950 border-obsidian-950/15',
  accent: 'bg-lime-400 text-obsidian-950 border-lime-500/60 font-semibold',
  mono: 'bg-sand-25 text-stone-600 border-obsidian-950/15 font-telemetry text-2xs',
  dark: 'bg-obsidian-950 text-sand-50 border-obsidian-950',
};

const dotColors: Record<BadgeVariant, string> = {
  nominal: 'bg-emerald-500',
  active: 'bg-lime-500',
  investigating: 'bg-obsidian-800',
  warning: 'bg-amber-500',
  critical: 'bg-crimson-500',
  idle: 'bg-stone-400',
  default: 'bg-stone-500',
  accent: 'bg-obsidian-950',
  mono: 'bg-lime-500',
  dark: 'bg-lime-400',
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
        size === 'sm' ? 'px-1.5 py-0.5 text-2xs gap-1' : 'px-2.5 py-0.5 text-tactical gap-1.5',
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
