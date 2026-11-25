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
import { EvidenceItem, EvidenceCategory } from '@/features/incidents/types/incident';
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
  { key: 'ALL', label: 'All Items', icon: Layers, description: 'Complete evidence dossier and analytical findings.' },
  { key: 'REPORTED_FACT', label: 'Reported Facts', icon: CheckCircle2, description: 'Direct factual evidence verified by recorders or physical forensics.' },
  { key: 'OFFICIAL_FINDING', label: 'Official Findings', icon: Shield, description: 'Formal causal findings determined by the state investigation board.' },
  { key: 'CONTRIBUTING_FACTOR', label: 'Contributing Factors', icon: AlertTriangle, description: 'Systemic, organizational, human, or environmental contributors.' },
  { key: 'UNKNOWN_OR_UNRESOLVED', label: 'Unknown / Unresolved', icon: HelpCircle, description: 'Unresolved ambiguities, data gaps, or physiological hypotheses.' },
];

export const EvidenceFindingsPanel: React.FC<EvidenceFindingsPanelProps> = ({
  evidenceList,
  highlightedEvidenceId,
}) => {
  const [activeCategory, setActiveCategory] = useState<EvidenceCategory | 'ALL'>('ALL');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(evidenceList.map((e) => e.id))
  );

  React.useEffect(() => {
    if (highlightedEvidenceId) {
      setActiveCategory('ALL');
      setExpandedIds((prev) => new Set([...prev, highlightedEvidenceId]));
    }
  }, [highlightedEvidenceId]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
      {/* Category Filter Bar */}
      <div className="p-3.5 rounded-panel panel-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  'px-2.5 py-1.5 rounded-subtle text-2xs font-mono transition-colors flex items-center gap-1.5 whitespace-nowrap select-none border',
                  isActive
                    ? 'bg-obsidian-950 text-lime-400 border-obsidian-950 font-semibold'
                    : 'bg-sand-100 text-stone-600 border-obsidian-950/10 hover:text-obsidian-950'
                )}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'px-1 rounded text-2xs',
                    isActive ? 'bg-lime-400 text-obsidian-950 font-bold' : 'bg-sand-200 text-stone-600'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="xs" onClick={() => setExpandedIds(new Set(evidenceList.map((e) => e.id)))}>
            Expand All
          </Button>
          <Button variant="ghost" size="xs" onClick={() => setExpandedIds(new Set())}>
            Collapse
          </Button>
        </div>
      </div>

      {/* Evidence Cards */}
      <div className="space-y-3">
        {filteredEvidence.map((item) => {
          const isExpanded = expandedIds.has(item.id);
          const isHighlighted = highlightedEvidenceId === item.id;

          return (
            <div
              key={item.id}
              id={`evidence-${item.id}`}
              className={cn(
                'rounded-panel panel-surface overflow-hidden transition-all',
                isHighlighted && 'ring-2 ring-lime-500 border-obsidian-950'
              )}
            >
              <button
                type="button"
                onClick={() => toggleExpand(item.id)}
                className="w-full p-4 flex items-start justify-between gap-3 text-left"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-obsidian-950 bg-lime-400/55 px-2 py-0.5 rounded-subtle border border-lime-600/30">
                      {item.id}
                    </span>
                    <ProvenanceBadge provenance={item.provenance} size="sm" />
                    <span className="text-2xs font-mono uppercase text-stone-500">
                      {item.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-obsidian-950 leading-snug">
                    {item.claim}
                  </h4>
                </div>
                <span className="p-1 text-stone-500 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-obsidian-950/10 space-y-3 text-xs">
                      <p className="text-stone-600 leading-relaxed">{item.detail}</p>

                      <div className="p-3 rounded-subtle bg-sand-100/80 border border-obsidian-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-2xs text-stone-600">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-obsidian-950 shrink-0" />
                          <span className="truncate">
                            <strong className="text-obsidian-950">{item.source.document}</strong>
                            {item.source.section ? ` • ${item.source.section}` : ''}
                            {item.source.page ? ` (p. ${item.source.page})` : ''}
                          </span>
                        </div>

                        {item.source.url && (
                          <a
                            href={item.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-obsidian-950 font-semibold hover:underline decoration-lime-500 decoration-2 shrink-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Primary Source</span>
                          </a>
                        )}
                      </div>
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
