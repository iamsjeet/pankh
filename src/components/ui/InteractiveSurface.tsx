import React, { useRef, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { useReducedMotion } from '@/animations/useReducedMotion';

export interface InteractiveSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  tilt?: boolean;
  spotlight?: boolean;
  maxTilt?: number;
  children: React.ReactNode;
}

/**
 * InteractiveSurface
 * Provides cursor-following spotlight and subtle 3D tilt using CSS variables & transforms
 * without triggering React state re-renders. Automatically disabled on touch or reduced-motion.
 */
export const InteractiveSurface: React.FC<InteractiveSurfaceProps> = ({
  tilt = true,
  spotlight = true,
  maxTilt = 4,
  children,
  className,
  onMouseMove,
  onMouseLeave,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseMove?.(e);
      if (reducedMotion || !ref.current) return;
      if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (spotlight) {
        ref.current.style.setProperty('--spot-x', `${x}px`);
        ref.current.style.setProperty('--spot-y', `${y}px`);
      }

      if (tilt) {
        const px = (x / rect.width - 0.5) * 2;
        const py = (y / rect.height - 0.5) * 2;
        const rx = (-py * maxTilt).toFixed(2);
        const ry = (px * maxTilt).toFixed(2);
        ref.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      }
    },
    [reducedMotion, spotlight, tilt, maxTilt, onMouseMove]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e);
      if (!ref.current) return;
      if (tilt) {
        ref.current.style.transform = '';
      }
    },
    [tilt, onMouseLeave]
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        spotlight && !reducedMotion && 'spotlight-surface',
        'transition-transform duration-300 ease-out will-change-transform',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
