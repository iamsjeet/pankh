import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, ExternalLink } from 'lucide-react';
import { EvidenceCitation } from '../types/assistant';
import { ProvenanceBadge } from '@/features/incidents/components/ProvenanceBadge';
import { Button } from '@/components/ui/Button';

export interface EvidenceCitationModalProps {
  citation: EvidenceCitation | null;
  onClose: () => void;
  onNavigateToEvidenceTab?: (evidenceId: string) => void;
}

export const EvidenceCitationModal: React.FC<EvidenceCitationModalProps> = ({
  citation,
  onClose,
  onNavigateToEvidenceTab,
}) => {
  if (!citation) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.16 }}
          className="w-full max-w-lg rounded-panel panel-surface-elevated border border-cyan-500/40 p-5 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-navy-700/80">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-navy-900 border border-cyan-500/40 px-2 py-0.5 rounded">
                {citation.evidenceId}
              </span>
              <ProvenanceBadge provenance={citation.provenance} size="sm" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="py-4 space-y-3.5 text-xs">
            <div>
              <span className="text-2xs font-mono uppercase text-slate-500 block mb-1">
                Factual Claim / Finding Headline:
              </span>
              <h3 className="font-heading font-semibold text-sm text-white leading-snug">
                {citation.claim}
              </h3>
            </div>

            <div>
              <span className="text-2xs font-mono uppercase text-slate-500 block mb-1">
                Forensic Analysis & Verification:
              </span>
              <p className="text-slate-200 leading-relaxed text-xs">
                {citation.detail}
              </p>
            </div>

            {/* Official Report Citation */}
            <div className="p-3 rounded bg-navy-900/90 border border-navy-800 font-mono text-2xs space-y-1.5">
              <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Verified Investigation Archive
              </span>
              <div className="text-slate-300">
                Document: <strong className="text-white">{citation.document}</strong>
              </div>
              {citation.section && (
                <div className="text-slate-400">
                  Section: <strong className="text-slate-200">{citation.section}</strong>
                </div>
              )}
              {citation.page && (
                <div className="text-slate-400">
                  Page Reference: <strong className="text-cyan-300">{citation.page}</strong>
                </div>
              )}
              <div className="text-slate-500 pt-1 border-t border-navy-800">
                Authoring Board: {citation.agency}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-navy-800 flex items-center justify-between gap-3">
            <span className="text-2xs font-mono text-slate-500">
              Official evidence verified in memory
            </span>

            <div className="flex items-center gap-2">
              {onNavigateToEvidenceTab && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    onNavigateToEvidenceTab(citation.evidenceId);
                    onClose();
                  }}
                  rightIcon={<ExternalLink className="w-3 h-3" />}
                >
                  View in Dossier
                </Button>
              )}
              <Button variant="primary" size="xs" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
