import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radio, CheckCircle2, ArrowRight, Flame, Compass } from 'lucide-react';
import { DecisionCheckpoint, DecisionOption } from '../types/simulation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export interface DecisionCheckpointModalProps {
  checkpoint: DecisionCheckpoint | null;
  onSelectDecision: (optionId: string, branchId: string) => void;
  onPreviewBranch?: (branchId: string | null) => void;
}

export const DecisionCheckpointModal: React.FC<DecisionCheckpointModalProps> = ({
  checkpoint,
  onSelectDecision,
  onPreviewBranch,
}) => {
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);

  useEffect(() => {
    if (checkpoint && checkpoint.options.length > 0) {
      setSelectedOption(checkpoint.options[0]);
      onPreviewBranch?.(checkpoint.options[0].branchId);
    } else {
      setSelectedOption(null);
      onPreviewBranch?.(null);
    }
  }, [checkpoint, onPreviewBranch]);

  if (!checkpoint) return null;

  const getOptionMeta = (type: DecisionOption['optionType']) => {
    switch (type) {
      case 'RECOMMENDED_STANDARD':
        return {
          label: 'STANDARD SAFETY PRACTICE',
          icon: CheckCircle2,
          pillClass: 'bg-[#88B04B]/20 text-[#3F5D14] border-[#88B04B]/45',
        };
      case 'HISTORICAL_ACTION':
        return {
          label: 'HISTORICAL ACTION',
          icon: Flame,
          pillClass: 'bg-crimson-100 text-crimson-700 border-crimson-500/30',
        };
      case 'TACTICAL_ALTERNATIVE':
        return {
          label: 'TACTICAL ALTERNATIVE',
          icon: Compass,
          pillClass: 'bg-sand-200 text-obsidian-950 border-obsidian-950/20',
        };
    }
  };

  const handleConfirm = () => {
    if (!selectedOption) return;
    onPreviewBranch?.(null);
    onSelectDecision(selectedOption.id, selectedOption.branchId);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end p-4 sm:p-6 bg-obsidian-950/60">
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl rounded-card bg-sand-50 text-obsidian-950 border border-obsidian-950/20 shadow-editorial-dark overflow-hidden flex flex-col max-h-[92vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="decision-checkpoint-title"
        >
          {/* Solid Command Header */}
          <div className="px-5 py-3 bg-obsidian-950 text-sand-50 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-subtle bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 id="decision-checkpoint-title" className="font-heading text-sm font-bold tracking-wide uppercase">
                  Decision Checkpoint Reached
                </h2>
                <p className="text-2xs font-mono text-[#A8C96D]">{checkpoint.timestampFormatted}</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-subtle bg-obsidian-850 border border-white/15 text-2xs font-mono text-amber-300 uppercase">
              Playback Paused
            </span>
          </div>

          {/* Scrollable Command Content */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Assigned Role & Situation */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-obsidian-950/12">
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-500">
                    Assigned Role
                  </span>
                  <strong className="font-heading text-base font-bold text-obsidian-950">
                    {checkpoint.userRole}
                  </strong>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-subtle bg-amber-100 border border-amber-600/30 text-2xs font-mono font-semibold text-amber-900">
                  <Radio className="w-3.5 h-3.5 text-amber-700" />
                  {checkpoint.contextAlert}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1">
                  Situation
                </span>
                <div className="p-3.5 rounded-panel bg-sand-25 border border-obsidian-950/12 text-xs text-obsidian-950 leading-relaxed whitespace-pre-line font-sans">
                  {checkpoint.situationBrief}
                </div>
              </div>
            </div>

            {/* Available Actions */}
            <div className="space-y-2">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-500">
                Available Actions (Select to preview 3D trajectory, then execute)
              </span>

              <div className="space-y-2">
                {checkpoint.options.map((opt) => {
                  const meta = getOptionMeta(opt.optionType);
                  const Icon = meta.icon;
                  const isSelected = selectedOption?.id === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onMouseEnter={() => onPreviewBranch?.(opt.branchId)}
                      onFocus={() => onPreviewBranch?.(opt.branchId)}
                      onClick={() => {
                        setSelectedOption(opt);
                        onPreviewBranch?.(opt.branchId);
                      }}
                      className={cn(
                        'w-full text-left p-3.5 rounded-panel border transition-all duration-150 flex flex-col gap-1.5',
                        isSelected
                          ? 'bg-obsidian-950 text-sand-50 border-obsidian-950 shadow-editorial'
                          : 'bg-sand-25 text-obsidian-950 border-obsidian-950/15 hover:border-obsidian-950/40'
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-heading font-bold text-sm">{opt.title}</span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-subtle border text-[10px] font-mono font-semibold inline-flex items-center gap-1 w-fit shrink-0',
                            isSelected
                              ? 'bg-[#88B04B] text-obsidian-950 border-[#88B04B]'
                              : meta.pillClass
                          )}
                        >
                          <Icon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      </div>

                      <p
                        className={cn(
                          'text-xs leading-relaxed',
                          isSelected ? 'text-stone-300' : 'text-stone-600'
                        )}
                      >
                        {opt.description}
                      </p>

                      <div
                        className={cn(
                          'text-[11px] font-mono pt-1 border-t',
                          isSelected
                            ? 'border-white/10 text-[#A8C96D]'
                            : 'border-obsidian-950/10 text-stone-500'
                        )}
                      >
                        Outcome Preview: {opt.consequenceSummary}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Solid Execution Footer */}
          <div className="px-5 py-3 bg-sand-100 border-t border-obsidian-950/12 flex items-center justify-between gap-4 shrink-0">
            <span className="text-2xs font-mono text-stone-500 hidden sm:inline">
              Predefined deterministic branch • Hovering previews 3D vector
            </span>

            <Button
              variant="primary"
              size="md"
              magnetic
              disabled={!selectedOption}
              onClick={handleConfirm}
              rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
              className="bg-[#88B04B] text-obsidian-950 border-[#88B04B] hover:bg-[#769B3D] font-semibold ml-auto whitespace-nowrap shrink-0"
            >
              Execute Selected Action
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
