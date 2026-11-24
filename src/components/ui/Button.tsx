import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'warning';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-cyan-500 text-navy-950 font-semibold hover:bg-cyan-400 active:bg-cyan-300 shadow-glow-cyan-sm border border-cyan-400/50',
  secondary:
    'bg-navy-800 text-slate-200 border border-navy-700/80 hover:bg-navy-750 hover:border-aviation-500/50 hover:text-white',
  outline:
    'bg-transparent text-slate-300 border border-navy-600/70 hover:border-cyan-500/60 hover:text-cyan-300 hover:bg-cyan-500/5',
  ghost:
    'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-navy-800/60 border border-transparent',
  danger:
    'bg-crimson-950/70 text-crimson-200 border border-crimson-500/50 hover:bg-crimson-900 hover:border-crimson-400',
  warning:
    'bg-amber-950/60 text-amber-200 border border-amber-500/50 hover:bg-amber-900/80 hover:border-amber-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-6 px-2 text-2xs rounded-subtle gap-1 tracking-wider uppercase',
  sm: 'h-8 px-3 text-xs rounded-panel gap-1.5 font-medium',
  md: 'h-9 px-4 text-sm rounded-panel gap-2 font-medium',
  lg: 'h-11 px-5 text-base rounded-panel gap-2.5 font-semibold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center select-none font-sans transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-navy-950 disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
