import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, mono = false, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full h-9 rounded-panel bg-navy-900/80 border border-navy-700/80 px-3 text-xs text-slate-100 placeholder:text-slate-500 transition-all duration-150',
              'focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 focus:bg-navy-850',
              'disabled:opacity-45 disabled:cursor-not-allowed',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              mono && 'font-mono text-2xs tracking-wider',
              error && 'border-crimson-500 focus:border-crimson-400 focus:ring-crimson-500/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-2xs text-crimson-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
