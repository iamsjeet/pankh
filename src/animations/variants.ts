import { type Variants } from 'framer-motion';

/**
 * Technical aerospace animation curves and timings.
 * Tuned for professional responsiveness rather than sluggish bounce.
 */
export const AEROSPACE_EASE = [0.16, 1, 0.3, 1] as const; // Decelerated crisp curve

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.28, ease: AEROSPACE_EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeOut' },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: AEROSPACE_EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: AEROSPACE_EASE },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.28, ease: AEROSPACE_EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.16 },
  },
};

export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: AEROSPACE_EASE },
  },
};

export const interactiveCard = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: AEROSPACE_EASE },
  },
  tap: {
    scale: 0.99,
    transition: { duration: 0.1 },
  },
};

export const radarPulse: Variants = {
  initial: { scale: 0.8, opacity: 0.8 },
  animate: {
    scale: 2.2,
    opacity: 0,
    transition: {
      duration: 2.4,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};
