import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface TooltipProps {
  content: React.ReactNode;
  shortcut?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: React.ReactElement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  side = 'top',
  delay = 200,
  children,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  const handleMouseEnter = () => {
    const t = window.setTimeout(() => setIsVisible(true), delay);
    setTimer(t);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.12 }}
            role="tooltip"
            className={cn(
              'absolute z-50 pointer-events-none whitespace-nowrap rounded-subtle px-2.5 py-1 text-2xs font-medium text-sand-50 bg-obsidian-950 border border-white/10 shadow-editorial-dark flex items-center gap-1.5',
              positionClasses[side],
              className
            )}
          >
            <span>{content}</span>
            {shortcut && (
              <kbd className="px-1 py-0.2 bg-obsidian-850 text-lime-400 border border-white/10 font-mono text-2xs rounded">
                {shortcut}
              </kbd>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
