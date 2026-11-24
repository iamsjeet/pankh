import React from 'react';
import { motion } from 'framer-motion';
import { slideUp } from './variants';
import { useReducedMotion, getAccessibleVariants } from './useReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();
  const variants = getAccessibleVariants(slideUp, shouldReduceMotion);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className={`w-full min-h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};
