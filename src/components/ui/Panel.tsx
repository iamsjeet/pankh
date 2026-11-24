import React from 'react';
import { cn } from '@/utils/cn';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'ghost' | 'active';
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

  return (
    <div
      className={cn(
        'rounded-panel transition-all duration-200 overflow-hidden flex flex-col',
        variant === 'default' && 'panel-surface',
        variant === 'elevated' && 'panel-surface-elevated',
        variant === 'ghost' && 'bg-navy-900/40 border border-navy-800/80',
        variant === 'active' && 'panel-surface border-cyan-500/40 shadow-glow-cyan-sm',
        interactive && 'panel-interactive cursor-pointer',
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div className="px-4 py-3 border-b border-navy-700/50 flex items-center justify-between gap-3 bg-navy-900/40 shrink-0">
          {headerSlot ? (
            headerSlot
          ) : (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {title && (
                    <h3 className="font-heading font-semibold text-sm tracking-wide text-slate-100 truncate">
                      {title}
                    </h3>
                  )}
                  {badge}
                </div>
                {subtitle && (
                  <p className="text-2xs text-slate-400 font-mono tracking-wider truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
          {actionSlot && <div className="flex items-center gap-2 shrink-0">{actionSlot}</div>}
        </div>
      )}

      <div className="p-4 flex-1">{children}</div>

      {footerSlot && (
        <div className="px-4 py-2.5 border-t border-navy-700/50 bg-navy-900/30 text-xs text-slate-400 shrink-0">
          {footerSlot}
        </div>
      )}
    </div>
  );
};
