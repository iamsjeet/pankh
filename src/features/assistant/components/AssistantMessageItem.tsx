import React from 'react';
import { Bot, User, BookOpen, ArrowRight } from 'lucide-react';
import { AssistantMessage, EvidenceCitation } from '../types/assistant';
import { ProvenanceBadge } from '@/features/incidents/components/ProvenanceBadge';
import { cn } from '@/utils/cn';

export interface AssistantMessageItemProps {
  message: AssistantMessage;
  onSelectCitation: (citation: EvidenceCitation) => void;
  onSelectFollowUp?: (question: string) => void;
}

export const AssistantMessageItem: React.FC<AssistantMessageItemProps> = ({
  message,
  onSelectCitation,
  onSelectFollowUp,
}) => {
  const isAssistant = message.role === 'assistant';

  const renderFormattedContent = (content: string) => {
    const tokenRegex = /\[(EVD-[A-Z0-9-]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      const evidenceId = match[1];

      if (matchIndex > lastIndex) {
        parts.push(content.substring(lastIndex, matchIndex));
      }

      const matchingCitation = message.citations?.find(
        (c) => c.evidenceId.toLowerCase() === evidenceId.toLowerCase()
      );

      parts.push(
        <button
          key={`${evidenceId}-${matchIndex}`}
          type="button"
          onClick={() => {
            if (matchingCitation) onSelectCitation(matchingCitation);
          }}
          className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.2 rounded-subtle font-mono text-2xs font-bold text-obsidian-950 bg-lime-400/70 border border-lime-600/35 hover:bg-lime-400 transition-colors align-baseline"
          title={`Inspect official evidence citation: ${evidenceId}`}
        >
          <BookOpen className="w-2.5 h-2.5" />
          <span>{evidenceId}</span>
        </button>
      );

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.map((part, i) => {
      if (typeof part === 'string') {
        return part.split('\n').map((line, lineIdx) => (
          <React.Fragment key={`${i}-${lineIdx}`}>
            {lineIdx > 0 && <br />}
            {line}
          </React.Fragment>
        ));
      }
      return part;
    });
  };

  return (
    <div
      className={cn(
        'flex gap-3 text-xs leading-relaxed',
        isAssistant ? 'items-start' : 'items-start flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'w-7 h-7 rounded-panel flex items-center justify-center shrink-0 border mt-0.5',
          isAssistant
            ? 'bg-obsidian-950 border-obsidian-950 text-lime-400'
            : 'bg-sand-100 border-obsidian-950/15 text-obsidian-950'
        )}
      >
        {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      <div
        className={cn(
          'flex flex-col max-w-[86%] sm:max-w-[82%] space-y-1.5',
          isAssistant ? 'items-start' : 'items-end'
        )}
      >
        <div className="flex flex-wrap items-center gap-2 text-2xs font-mono text-stone-500 px-1">
          <span className="font-semibold text-obsidian-950">
            {isAssistant ? 'Research Assistant' : 'Researcher'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>

          {isAssistant && message.confidence && (
            <>
              <span>•</span>
              <span
                className={cn(
                  'font-semibold',
                  message.confidence === 'HIGH' && 'text-emerald-700',
                  message.confidence === 'MODERATE' && 'text-amber-700',
                  message.confidence === 'INSUFFICIENT_DATA' && 'text-stone-500'
                )}
              >
                {message.confidence === 'INSUFFICIENT_DATA'
                  ? 'INSUFFICIENT EVIDENCE'
                  : `${message.confidence} CONFIDENCE`}
              </span>
            </>
          )}

          {isAssistant && message.provenance && (
            <ProvenanceBadge provenance={message.provenance} size="sm" showTooltip={false} />
          )}
        </div>

        <div
          className={cn(
            'p-3.5 rounded-panel border text-xs',
            isAssistant
              ? message.isFallback
                ? 'bg-amber-100/40 border-amber-600/30 text-obsidian-950'
                : 'bg-white border-obsidian-950/12 text-obsidian-950 shadow-sm'
              : 'bg-obsidian-950 border-obsidian-950 text-sand-50'
          )}
        >
          <div className="whitespace-pre-line leading-relaxed">
            {renderFormattedContent(message.content)}
          </div>

          {isAssistant && message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-obsidian-950/10 space-y-1.5">
              <span className="text-2xs font-mono uppercase text-stone-500 block">
                Cited Official Evidence ({message.citations.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.citations.map((c) => (
                  <button
                    key={c.evidenceId}
                    type="button"
                    onClick={() => onSelectCitation(c)}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-subtle text-2xs font-mono bg-sand-100 border border-obsidian-950/15 text-obsidian-950 hover:border-obsidian-950 hover:bg-lime-400/40 transition-colors"
                  >
                    <BookOpen className="w-3 h-3 text-obsidian-950" />
                    <span className="font-semibold">{c.evidenceId}</span>
                    <span className="text-stone-500 truncate max-w-[140px]">({c.claim})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {isAssistant && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="pt-1 space-y-1 w-full">
            <span className="text-2xs font-mono uppercase text-stone-500 block">
              Follow-up Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {message.suggestedFollowUps.map((fu, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowUp?.(fu)}
                  className="text-left text-2xs font-mono text-obsidian-950 bg-sand-25 border border-obsidian-950/15 hover:border-obsidian-950 hover:bg-sand-100 px-2.5 py-1 rounded-subtle transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-stone-500 shrink-0" />
                  <span>{fu}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
