import React, { forwardRef, useRef, useCallback } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useReducedMotion } from '@/animations/useReducedMotion';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'warning';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  magnetic?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-obsidian-950 text-sand-50 font-medium hover:bg-obsidian-850 border border-obsidian-950 shadow-editorial',
  accent:
    'bg-lime-400 text-obsidian-950 font-semibold hover:bg-lime-500 border border-lime-500/60 shadow-lime-glow',
  secondary:
    'bg-sand-100 text-obsidian-950 border border-obsidian-950/15 hover:bg-sand-200 hover:border-obsidian-950/25',
  outline:
    'bg-transparent text-obsidian-950 border border-obsidian-950/20 hover:border-obsidian-950 hover:bg-obsidian-950/5',
  ghost:
    'bg-transparent text-stone-600 hover:text-obsidian-950 hover:bg-sand-100/80 border border-transparent',
  danger:
    'bg-crimson-100 text-crimson-700 border border-crimson-500/30 hover:bg-crimson-500 hover:text-white',
  warning:
    'bg-amber-100 text-amber-700 border border-amber-500/30 hover:bg-amber-500 hover:text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-6 px-2.5 text-2xs rounded-subtle gap-1 tracking-wider uppercase',
  sm: 'h-8 px-3.5 text-xs rounded-panel gap-1.5 font-medium',
  md: 'h-9 px-4 text-sm rounded-panel gap-2 font-medium',
  lg: 'h-11 px-6 text-sm rounded-panel gap-2.5 font-semibold tracking-tight',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      magnetic = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      fullWidth = false,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const innerRef = useRef<HTMLButtonElement | null>(null);
    const reducedMotion = useReducedMotion();

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onMouseMove?.(e);
        if (!magnetic || isDisabled || reducedMotion || !innerRef.current) return;
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const rect = innerRef.current.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
        innerRef.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      },
      [magnetic, isDisabled, reducedMotion, onMouseMove]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onMouseLeave?.(e);
        if (innerRef.current && magnetic) {
          innerRef.current.style.transform = '';
        }
      },
      [magnetic, onMouseLeave]
    );

    return (
      <motion.button
        ref={setRefs}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        disabled={isDisabled}
        className={cn(
          'group inline-flex items-center justify-center select-none font-sans transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed',
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
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-1">
            {rightIcon}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
