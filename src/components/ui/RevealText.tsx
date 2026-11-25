import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useReducedMotion } from '@/animations/useReducedMotion';

export interface RevealTextProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

/**
 * RevealText
 * Editorial masked line reveal with crisp aerospace deceleration curve.
 */
export const RevealText: React.FC<RevealTextProps> = ({
  children,
  delay = 0,
  className,
  as = 'div',
}) => {
  const reducedMotion = useReducedMotion();
  const Component = motion[as];

  if (reducedMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <span className="block overflow-hidden">
      <Component
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
        className={cn('block', className)}
      >
        {children}
      </Component>
    </span>
  );
};
