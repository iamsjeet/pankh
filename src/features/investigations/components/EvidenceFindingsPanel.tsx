import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  Shield,
  Layers,
  ExternalLink,
} from 'lucide-react';
import {
  EvidenceItem,
  EvidenceCategory,
} from '@/features/incidents/types/incident';
import { ProvenanceBadge } from '@/features/incidents/components/ProvenanceBadge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export interface EvidenceFindingsPanelProps {
  evidenceList: EvidenceItem[];
  highlightedEvidenceId?: string | null;
}

interface CategoryTabConfig {
  key: EvidenceCategory | 'ALL';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const CATEGORY_TABS: CategoryTabConfig[] = [
  {
    key: 'ALL',
    label: 'All Items',
    icon: Layers,
    description: 'Complete evidence dossier and analytical findings.',
  },
  {
    key: 'REPORTED_FACT',
    label: 'Reported Facts',
    icon: CheckCircle2,
    description: 'Direct factual evidence verified by recorders or physical forensics.',
  },
  {
    key: 'OFFICIAL_FINDING',
    label: 'Official Findings',
    icon: Shield,
    description: 'Formal causal findings determined by the state investigation board.',
  },
  {
    key: 'CONTRIBUTING_FACTOR',
    label: 'Contributing Factors',
    icon: AlertTriangle,
    description: 'Systemic, organizational, human, or environmental contributors.',
  },
  {
    key: 'UNKNOWN_OR_UNRESOLVED',
    label: 'Unknown / Unresolved',
    icon: HelpCircle,
    description: 'Unresolved ambiguities, data gaps, or physiological hypotheses.',
  },
];

export const EvidenceFindingsPanel: React.FC<EvidenceFindingsPanelProps> = ({
  evidenceList,
  highlightedEvidenceId,
}) => {
  const [activeCategory, setActiveCategory] = useState<EvidenceCategory | 'ALL'>('ALL');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(evidenceList.map((e) => e.id)) // Expand all initially so users can inspect claims directly
  );

  // Auto-expand and switch to ALL when highlightedEvidenceId changes
  React.useEffect(() => {
    if (highlightedEvidenceId) {
      setActiveCategory('ALL');
      setExpandedIds((prev) => new Set([...prev, highlightedEvidenceId]));
    }
  }, [highlightedEvidenceId]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(evidenceList.map((e) => e.id)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const filteredEvidence =
    activeCategory === 'ALL'
      ? evidenceList
      : evidenceList.filter((item) => item.category === activeCategory);

  const getCategoryCount = (cat: EvidenceCategory | 'ALL') => {
    if (cat === 'ALL') return evidenceList.length;
    return evidenceList.filter((item) => item.category === cat).length;
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Tabs */}
      <div className="p-3 rounded-panel panel-surface border border-navy-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const count = getCategoryCount(tab.key);
            const isActive = activeCategory === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveCategory(tab.key)}
                className={cn(
                  'px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-2 select-none whitespace-nowrap',
                  isActive
                    ? 'bg-navy-800 text-cyan-300 border border-cyan-500/40 font-semibold shadow-glow-cyan-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850 border border-transparent'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-cyan-400' : 'text-slate-500')} />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded text-2xs',
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-navy-900 text-slate-500'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <Button variant="ghost" size="xs" onClick={handleExpandAll}>
            Expand All
          </Button>
          <Button variant="ghost" size="xs" onClick={handleCollapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      {/* Evidence Cards List */}
      <div className="space-y-3">
        {filteredEvidence.map((item) => {
          const isExpanded = expandedIds.has(item.id);
          const isHighlighted = item.id === highlightedEvidenceId;

          return (
            <div
              key={item.id}
              id={`evidence-${item.id}`}
              className={cn(
                'rounded-panel panel-surface border transition-all duration-200 overflow-hidden',
                isHighlighted
                  ? 'border-cyan-400 bg-cyan-950/20 shadow-glow-cyan ring-1 ring-cyan-400/50'
                  : isExpanded
                  ? 'border-cyan-500/40'
                  : 'border-navy-700/70 hover:border-navy-600'
              )}
            >
              {/* Header Bar */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-2xs font-bold text-cyan-400 bg-navy-900 border border-cyan-500/30 px-2 py-0.5 rounded">
                      {item.id}
                    </span>

                    <ProvenanceBadge provenance={item.provenance} size="sm" />

                    <span className="text-2xs font-mono text-slate-400 border border-navy-700 px-2 py-0.5 rounded bg-navy-900/50">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-heading font-semibold text-sm text-white leading-snug">
                    {item.claim}
                  </h4>
                </div>

                <div className="p-1 rounded text-slate-400 hover:text-slate-200 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expandable Evidence Details & Official Citations */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="px-4 pb-4 pt-1 border-t border-navy-800/80 space-y-3 text-xs"
                  >
                    <p className="text-slate-200 leading-relaxed">
                      {item.detail}
                    </p>

                    {item.verificationNotes && (
                      <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/20 text-2xs font-mono text-amber-300/90">
                        <strong>Provenance Note:</strong> {item.verificationNotes}
                      </div>
                    )}

                    {/* Official Document Citation Box */}
                    <div className="p-3 rounded bg-navy-950/80 border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-2xs font-mono text-slate-400">
                      <div className="flex flex-wrap items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>
                          Source Reference:{' '}
                          <strong className="text-slate-200">{item.source.document}</strong>
                          {item.source.section && ` • ${item.source.section}`}
                          {item.source.page && ` • p. ${item.source.page}`}
                        </span>
                        {item.source.url && (
                          <a
                            href={item.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
                            title="Inspect official primary investigation report"
                          >
                            <span>[Primary Source]</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <span className="px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-cyan-300 font-semibold self-start sm:self-auto">
                        Agency: {item.source.agency}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
