import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { type Variants } from 'framer-motion';

/**
 * Hook to detect user preferences for reduced motion.
 * Respects OS accessibility settings.
 */
export function useReducedMotion(): boolean {
  const prefersReduced = useFramerReducedMotion();
  return Boolean(prefersReduced);
}

/**
 * Returns instant/fade-only variants when reduced motion is requested.
 */
export function getAccessibleVariants(variants: Variants, shouldReduce: boolean): Variants {
  if (!shouldReduce) return variants;

  // Flatten animations to simple instant or subtle cross-fade
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.05 } },
    exit: { opacity: 0, transition: { duration: 0.05 } },
  };
}
