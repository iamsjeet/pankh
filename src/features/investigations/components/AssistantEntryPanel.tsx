import React from 'react';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';
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
  return (
    <div className="p-6 rounded-card panel-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-panel bg-obsidian-850 border border-white/10 flex items-center justify-center text-lime-400 shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-bold text-sand-50">
              Curated Investigation Assistant
            </h3>
            <Badge variant="accent" size="sm">
              {incident.id}
            </Badge>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed max-w-xl">
            Query causes, timelines, and official findings for this incident with deterministic,
            evidence-cited answers.
          </p>
        </div>
      </div>

      <Button
        variant="accent"
        size="sm"
        onClick={onOpenAssistant}
        leftIcon={<Sparkles className="w-3.5 h-3.5" />}
        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        className="shrink-0"
      >
        Open Assistant
      </Button>
    </div>
  );
};
