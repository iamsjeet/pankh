import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/animations/useReducedMotion';
import { cn } from '@/utils/cn';

export interface KineticTextProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  range?: number;
  className?: string;
}

/**
 * KineticText
 * Subtle scroll-linked horizontal drift for oversized editorial typography.
 */
export const KineticText: React.FC<KineticTextProps> = ({
  children,
  direction = 'left',
  range = 42,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'left' ? [range, -range] : [-range, range]
  );

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ x }} className={cn('will-change-transform', className)}>
        {children}
      </motion.div>
    </div>
  );
};
