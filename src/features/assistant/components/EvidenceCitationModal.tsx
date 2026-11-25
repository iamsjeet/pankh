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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.16 }}
          className="w-full max-w-lg rounded-card panel-surface-elevated p-6 shadow-editorial-dark relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 border-b border-obsidian-950/12">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-obsidian-950 bg-lime-400/70 border border-lime-600/35 px-2 py-0.5 rounded-subtle">
                {citation.evidenceId}
              </span>
              <ProvenanceBadge provenance={citation.provenance} size="sm" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-subtle text-stone-500 hover:text-obsidian-950 hover:bg-sand-100 transition-colors"
              aria-label="Close citation modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4 text-xs">
            <div>
              <span className="text-2xs font-mono uppercase text-stone-500 block mb-1">
                Factual Claim / Finding
              </span>
              <h3 className="font-heading font-semibold text-base text-obsidian-950 leading-snug">
                {citation.claim}
              </h3>
            </div>

            <div>
              <span className="text-2xs font-mono uppercase text-stone-500 block mb-1">
                Forensic Analysis &amp; Verification
              </span>
              <p className="text-stone-600 leading-relaxed text-xs">{citation.detail}</p>
            </div>

            <div className="p-3.5 rounded-panel bg-sand-100 border border-obsidian-950/12 font-mono text-2xs space-y-1.5">
              <span className="text-obsidian-950 font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Verified Investigation Archive
              </span>
              <div className="text-stone-600">
                Document: <strong className="text-obsidian-950">{citation.document}</strong>
              </div>
              {citation.section && (
                <div className="text-stone-600">
                  Section: <strong className="text-obsidian-950">{citation.section}</strong>
                </div>
              )}
              {citation.page && (
                <div className="text-stone-600">
                  Page Reference: <strong className="text-obsidian-950">{citation.page}</strong>
                </div>
              )}
              <div className="text-stone-500 pt-1 border-t border-obsidian-950/10">
                Authoring Board: {citation.agency}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-obsidian-950/12 flex items-center justify-between gap-3">
            <span className="text-2xs font-mono text-stone-500">
              Evidence verified in curated dossier
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
