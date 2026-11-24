import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  size = 'md',
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 rounded-panel bg-navy-900/90 border border-navy-700/80',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center justify-center font-sans transition-colors duration-150 select-none z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded-subtle',
              size === 'sm' ? 'px-2.5 py-1 text-xs gap-1.5' : 'px-3.5 py-1.5 text-xs gap-2',
              isActive ? 'text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-navy-800 border border-navy-650 rounded-subtle -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded font-mono text-2xs',
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-navy-700 text-slate-400'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
