import React from 'react';
import { cn } from '@/utils/cn';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'ghost' | 'active' | 'dark';
  interactive?: boolean;
  headerSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  footerSlot?: React.ReactNode;
  children: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({
  variant = 'default',
  interactive = false,
  headerSlot,
  actionSlot,
  title,
  subtitle,
  badge,
  footerSlot,
  children,
  className,
  ...props
}) => {
  const hasHeader = title || subtitle || badge || headerSlot || actionSlot;
  const isDark = variant === 'dark';

  return (
    <div
      className={cn(
        'rounded-card transition-all duration-200 overflow-hidden flex flex-col',
        variant === 'default' && 'panel-surface',
        variant === 'elevated' && 'panel-surface-elevated',
        variant === 'ghost' && 'bg-sand-100/60 border border-obsidian-950/10',
        variant === 'active' && 'panel-surface border-lime-500/70 shadow-lime-glow',
        variant === 'dark' && 'panel-dark',
        interactive && 'panel-interactive cursor-pointer',
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div
          className={cn(
            'px-5 py-3.5 border-b flex items-center justify-between gap-3 shrink-0',
            isDark
              ? 'border-white/10 bg-obsidian-850/60'
              : 'border-obsidian-950/10 bg-sand-50/70'
          )}
        >
          {headerSlot ? (
            headerSlot
          ) : (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {title && (
                    <h3
                      className={cn(
                        'font-heading font-semibold text-sm tracking-tight truncate',
                        isDark ? 'text-sand-50' : 'text-obsidian-950'
                      )}
                    >
                      {title}
                    </h3>
                  )}
                  {badge}
                </div>
                {subtitle && (
                  <p
                    className={cn(
                      'text-2xs font-mono tracking-wider truncate',
                      isDark ? 'text-stone-400' : 'text-stone-500'
                    )}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
          {actionSlot && <div className="flex items-center gap-2 shrink-0">{actionSlot}</div>}
        </div>
      )}

      <div className="p-5 flex-1">{children}</div>

      {footerSlot && (
        <div
          className={cn(
            'px-5 py-3 border-t text-xs shrink-0',
            isDark
              ? 'border-white/10 bg-obsidian-850/40 text-stone-400'
              : 'border-obsidian-950/10 bg-sand-50/60 text-stone-500'
          )}
        >
          {footerSlot}
        </div>
      )}
    </div>
  );
};
