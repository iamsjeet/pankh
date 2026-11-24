import React from 'react';
import {
  Bot,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { Incident } from '@/features/incidents/types/incident';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface AssistantEntryPanelProps {
  incident: Incident;
  onOpenAssistant?: () => void;
}

export const AssistantEntryPanel: React.FC<AssistantEntryPanelProps> = ({
  incident,
  onOpenAssistant,
}) => {
  const sampleQuestions = [
    `Why did the flight crew prioritize the verbal ATC instruction over the TCAS Climb advisory?`,
    `What specific maintenance was being conducted on the optical radar warning systems?`,
    `What changes were mandated in ICAO Annex 2 following this investigation report?`,
  ];

  return (
    <div className="rounded-panel panel-surface p-6 border border-cyan-500/40 relative overflow-hidden bg-tactical-grid">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-panel bg-navy-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-glow-cyan-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-base text-white">
                  AI Investigation Assistant
                </h3>
                <Badge variant="accent" size="sm">
                  CURATED KNOWLEDGE PROTOTYPE
                </Badge>
              </div>
              <p className="text-2xs font-mono text-cyan-300">
                Context Active: <strong className="text-white">{incident.id}</strong> ({incident.title})
              </p>
            </div>
          </div>

          <Badge variant="mono" size="sm">
            EVIDENCE CITATIONS ACTIVE
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          The AI Investigation Assistant provides natural-language queries grounded directly in the
          factual recorders, official accident findings, and causal chain evidence of{' '}
          <strong className="text-cyan-300">{incident.title}</strong>.
        </p>

        {/* Candidate Questions Preview */}
        <div className="space-y-2 pt-1">
          <span className="text-2xs font-mono uppercase tracking-wider text-slate-400 block">
            Sample Available Research Queries:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
            {sampleQuestions.map((q, idx) => (
              <div
                key={idx}
                onClick={onOpenAssistant}
                className="p-3 rounded-panel bg-navy-900/90 border border-navy-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 cursor-pointer transition-colors flex items-start gap-2 group"
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-2xs leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Trigger */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-2xs font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              All answers contain verified official citations and confidence ratings.
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAssistant}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Assistant Conversation Panel
          </Button>
        </div>
      </div>
    </div>
  );
};
