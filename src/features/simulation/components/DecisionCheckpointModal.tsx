import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Radio,
  CheckCircle2,
  ArrowRight,
  Flame,
} from 'lucide-react';
import {
  DecisionCheckpoint,
  DecisionOption,
} from '../types/simulation';
import { Badge } from '@/components/ui/Badge';

export interface DecisionCheckpointModalProps {
  checkpoint: DecisionCheckpoint | null;
  onSelectDecision: (optionId: string, branchId: string) => void;
}

export const DecisionCheckpointModal: React.FC<DecisionCheckpointModalProps> = ({
  checkpoint,
  onSelectDecision,
}) => {
  if (!checkpoint) return null;

  const getOptionBadge = (type: DecisionOption['optionType']) => {
    switch (type) {
      case 'RECOMMENDED_STANDARD':
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-mono font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            STANDARD SAFETY PRACTICE
          </span>
        );
      case 'HISTORICAL_ACTION':
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-mono font-bold bg-crimson-950/70 text-crimson-300 border border-crimson-500/40 flex items-center gap-1">
            <Flame className="w-3 h-3 text-crimson-400" />
            HISTORICAL ACTION (2002)
          </span>
        );
      case 'TACTICAL_ALTERNATIVE':
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-mono font-bold bg-aviation-950/70 text-aviation-300 border border-aviation-500/30 flex items-center gap-1">
            <Radio className="w-3 h-3 text-aviation-400" />
            TACTICAL ALTERNATIVE
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 14 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-2xl rounded-panel panel-surface-elevated border border-amber-500/50 p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Header Warning Bar */}
          <div className="flex items-center justify-between pb-3.5 border-b border-navy-700/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-panel bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-glow-amber">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-white tracking-wide">
                  DECISION CHECKPOINT REACHED
                </span>
                <p className="text-2xs font-mono text-amber-300">{checkpoint.timestampFormatted}</p>
              </div>
            </div>

            <Badge variant="warning" size="sm" dot pulse>
              PLAYBACK PAUSED
            </Badge>
          </div>

          {/* Context Alert Banner */}
          <div className="my-4 p-3 rounded bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">{checkpoint.contextAlert}</span>
          </div>

          {/* Situation & Role Brief */}
          <div className="space-y-2 text-xs">
            <div className="text-2xs font-mono text-slate-400 uppercase tracking-wider">
              Assigned Role: <strong className="text-white">{checkpoint.userRole}</strong>
            </div>
            <p className="text-slate-200 leading-relaxed whitespace-pre-line bg-navy-900/60 p-3.5 rounded border border-navy-800">
              {checkpoint.situationBrief}
            </p>
          </div>

          {/* Decision Options Cards */}
          <div className="mt-4 space-y-2.5">
            <span className="text-2xs font-mono uppercase text-slate-400 tracking-wider block">
              Select Your Action to Continue Simulation Branch:
            </span>

            <div className="space-y-2">
              {checkpoint.options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => onSelectDecision(opt.id, opt.branchId)}
                  className="p-3.5 rounded-panel bg-navy-900/90 border border-navy-700 hover:border-cyan-400 hover:bg-navy-850 cursor-pointer transition-all duration-150 group flex flex-col justify-between gap-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-heading font-semibold text-xs text-white group-hover:text-cyan-300 transition-colors">
                      {opt.title}
                    </span>
                    {getOptionBadge(opt.optionType)}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {opt.description}
                  </p>

                  <div className="pt-2 border-t border-navy-800/80 flex items-center justify-between text-2xs font-mono text-slate-400">
                    <span className="truncate">
                      Consequence: <strong className="text-slate-300">{opt.consequenceSummary}</strong>
                    </span>
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0 font-bold">
                      Execute <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="mt-4 pt-3 border-t border-navy-800 text-center text-2xs font-mono text-slate-500">
            ILLUSTRATIVE SCENARIO CHOICES • NOT OPERATIONAL AVIATION ADVICE
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
