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
            <div className="absolute left-3 flex items-center pointer-events-none text-stone-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full h-10 rounded-panel bg-sand-25 border border-obsidian-950/15 px-3 text-sm text-obsidian-950 placeholder:text-stone-400 transition-all duration-150',
              'focus:outline-none focus:border-obsidian-950 focus:ring-2 focus:ring-lime-400/60 focus:bg-white',
              'disabled:opacity-45 disabled:cursor-not-allowed',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              mono && 'font-mono text-xs tracking-wider',
              error && 'border-crimson-500 focus:border-crimson-600 focus:ring-crimson-500/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-stone-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-2xs text-crimson-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
