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

  /**
   * Parses message content and turns evidence tokens like [EVD-UBL-01] into interactive citation buttons.
   */
  const renderFormattedContent = (content: string) => {
    // Regex matching [EVD-xxx-xx]
    const tokenRegex = /\[(EVD-[A-Z0-9-]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      const evidenceId = match[1];

      // Add preceding text
      if (matchIndex > lastIndex) {
        parts.push(content.substring(lastIndex, matchIndex));
      }

      // Find matching citation object if available
      const matchingCitation = message.citations?.find(
        (c) => c.evidenceId.toLowerCase() === evidenceId.toLowerCase()
      );

      parts.push(
        <button
          key={`${evidenceId}-${matchIndex}`}
          type="button"
          onClick={() => {
            if (matchingCitation) {
              onSelectCitation(matchingCitation);
            }
          }}
          className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.2 rounded font-mono text-2xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-900 transition-colors shadow-glow-cyan-sm align-baseline"
          title={`Click to inspect official evidence citation: ${evidenceId}`}
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

    // Preserve linebreaks if present
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
      {/* Avatar Icon */}
      <div
        className={cn(
          'w-7 h-7 rounded-panel flex items-center justify-center shrink-0 border mt-0.5',
          isAssistant
            ? 'bg-navy-900 border-cyan-500/40 text-cyan-400 shadow-glow-cyan-sm'
            : 'bg-aviation-950 border-aviation-500/40 text-aviation-300'
        )}
      >
        {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Bubble Container */}
      <div
        className={cn(
          'flex flex-col max-w-[85%] sm:max-w-[80%] space-y-1.5',
          isAssistant ? 'items-start' : 'items-end'
        )}
      >
        {/* Meta Header */}
        <div className="flex items-center gap-2 text-2xs font-mono text-slate-500 px-1">
          <span className="font-semibold text-slate-400">
            {isAssistant ? 'Investigation Assistant' : 'Researcher'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>

          {isAssistant && message.confidence && (
            <>
              <span>•</span>
              <span
                className={cn(
                  'font-semibold',
                  message.confidence === 'HIGH' && 'text-emerald-400',
                  message.confidence === 'MODERATE' && 'text-amber-400',
                  message.confidence === 'INSUFFICIENT_DATA' && 'text-slate-400'
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

        {/* Bubble Surface */}
        <div
          className={cn(
            'p-3.5 rounded-panel border text-xs',
            isAssistant
              ? message.isFallback
                ? 'panel-surface border-amber-500/30 text-slate-200'
                : 'panel-surface border-navy-700/80 text-slate-100'
              : 'bg-navy-800 border-navy-700 text-white'
          )}
        >
          <div className="whitespace-pre-line leading-relaxed">
            {renderFormattedContent(message.content)}
          </div>

          {/* Citations List Preview (if assistant and citations available) */}
          {isAssistant && message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-navy-800/80 space-y-1.5">
              <span className="text-2xs font-mono uppercase text-slate-500 block">
                Cited Official Evidence ({message.citations.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.citations.map((c) => (
                  <button
                    key={c.evidenceId}
                    type="button"
                    onClick={() => onSelectCitation(c)}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-2xs font-mono bg-navy-900 border border-navy-700 text-cyan-300 hover:border-cyan-400 hover:bg-navy-850 transition-colors"
                  >
                    <BookOpen className="w-3 h-3 text-cyan-400" />
                    <span>{c.evidenceId}</span>
                    <span className="text-slate-500 truncate max-w-[140px]">({c.claim})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggested Follow-Up Prompt Chips */}
        {isAssistant && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="pt-1.5 space-y-1 w-full">
            <span className="text-2xs font-mono uppercase text-slate-500 block">
              Related Investigation Follow-ups:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {message.suggestedFollowUps.map((fu, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowUp?.(fu)}
                  className="text-left text-2xs font-mono text-slate-300 bg-navy-900/90 border border-navy-800 hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-navy-850 px-2.5 py-1 rounded transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
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
