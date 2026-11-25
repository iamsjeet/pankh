import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  RotateCcw,
  Loader2,
  Maximize2,
  Minimize2,
  X,
  ArrowRight,
} from 'lucide-react';
import { assistantService } from '../services/assistantService';
import {
  AssistantMessage,
  SuggestedQuestion,
  EvidenceCitation,
} from '../types/assistant';
import { AssistantMessageItem } from './AssistantMessageItem';
import { EvidenceCitationModal } from './EvidenceCitationModal';
import { historyService } from '@/features/history/services/historyService';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export interface AssistantChatPanelProps {
  incidentId: string;
  incidentTitle: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClose?: () => void;
  onNavigateToEvidenceTab?: (evidenceId: string) => void;
  className?: string;
}

export const AssistantChatPanel: React.FC<AssistantChatPanelProps> = ({
  incidentId,
  incidentTitle,
  isExpanded = false,
  onToggleExpand,
  onClose,
  onNavigateToEvidenceTab,
  className,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const [selectedCitation, setSelectedCitation] = useState<EvidenceCitation | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function initAssistant() {
      try {
        const [history, suggestions] = await Promise.all([
          assistantService.getConversation(incidentId),
          assistantService.getSuggestedQuestions(incidentId),
        ]);
        if (isMounted) {
          setMessages(history);
          setSuggestedQuestions(suggestions);
        }
      } catch (err) {
        console.error('Failed to initialize assistant session:', err);
      }
    }
    initAssistant();
    return () => {
      isMounted = false;
    };
  }, [incidentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isThinking) return;

    const userMsg: AssistantMessage = {
      id: `USER-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);
    historyService.recordAssistantQuestion(incidentId);

    try {
      const response = await assistantService.submitQuestion(incidentId, text, messages);
      const assistantMsg: AssistantMessage = {
        id: `ASST-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        citations: response.citations,
        confidence: response.confidence,
        provenance: response.provenance,
        suggestedFollowUps: response.suggestedFollowUps,
        isFallback: response.isFallback,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Assistant error processing query:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetConversation = async () => {
    await assistantService.resetConversation(incidentId);
    const freshConversation = await assistantService.getConversation(incidentId);
    setMessages(freshConversation);
  };

  return (
    <div
      className={cn(
        'rounded-card panel-surface-elevated flex flex-col h-full overflow-hidden relative',
        className
      )}
    >
      {/* Top Editorial Header */}
      <div className="p-4 border-b border-obsidian-950/10 bg-obsidian-950 text-sand-50 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-panel bg-obsidian-850 border border-white/15 flex items-center justify-center text-lime-400 shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-semibold text-xs text-sand-50 truncate">
                Research Assistant
              </h3>
              <Badge variant="accent" size="sm">
                CURATED Q&amp;A
              </Badge>
            </div>
            <p className="text-2xs font-mono text-stone-400 truncate" title={incidentTitle}>
              DETERMINISTIC ENGINE • {incidentId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleResetConversation}
            className="p-1.5 rounded-subtle text-stone-400 hover:text-sand-50 hover:bg-obsidian-850 transition-colors"
            title="Reset conversation session"
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="p-1.5 rounded-subtle text-stone-400 hover:text-sand-50 hover:bg-obsidian-850 transition-colors"
              title={isExpanded ? 'Collapse to split view' : 'Expand full panel'}
              aria-label={isExpanded ? 'Collapse assistant' : 'Expand assistant'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-subtle text-stone-400 hover:text-sand-50 hover:bg-obsidian-850 transition-colors"
              title="Close assistant"
              aria-label="Close assistant"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sand-50/70">
        {messages.map((msg) => (
          <AssistantMessageItem
            key={msg.id}
            message={msg}
            onSelectCitation={setSelectedCitation}
            onSelectFollowUp={(q) => handleSendMessage(q)}
          />
        ))}

        {isThinking && (
          <div className="flex items-center gap-2.5 text-xs font-mono text-obsidian-950 p-3 rounded-panel bg-sand-100 border border-obsidian-950/12 max-w-sm">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-obsidian-950 shrink-0" />
            <span>Cross-referencing evidence dossier...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <div className="px-4 py-2.5 border-t border-obsidian-950/10 bg-sand-100/70 shrink-0">
          <span className="text-2xs font-mono uppercase text-stone-500 block mb-1.5">
            Suggested Inquiries
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {suggestedQuestions.map((sq) => (
              <button
                key={sq.id}
                type="button"
                onClick={() => handleSendMessage(sq.question)}
                className="px-2.5 py-1 rounded-subtle text-2xs font-mono bg-sand-25 border border-obsidian-950/12 hover:border-obsidian-950 text-obsidian-950 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
              >
                <span>{sq.question}</span>
                <ArrowRight className="w-2.5 h-2.5 text-stone-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Dock */}
      <div className="p-3.5 border-t border-obsidian-950/10 bg-sand-25 shrink-0">
        <div className="relative flex items-center rounded-panel bg-white border border-obsidian-950/15 focus-within:border-obsidian-950 focus-within:ring-2 focus-within:ring-lime-400/50 transition-all">
          <textarea
            ref={inputRef}
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${incidentId} (e.g. "What caused the collision?")...`}
            className="w-full bg-transparent px-3 py-2 text-xs text-obsidian-950 placeholder:text-stone-400 focus:outline-none resize-none font-sans"
          />
          <button
            type="button"
            disabled={!inputValue.trim() || isThinking}
            onClick={() => handleSendMessage()}
            className="mr-2 p-2 rounded-panel bg-obsidian-950 text-lime-400 hover:bg-obsidian-850 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
            title="Send query (Enter)"
            aria-label="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-2xs font-mono text-stone-500 mt-1.5 px-1">
          <span>Enter to send • Shift+Enter for new line</span>
          <span className="text-obsidian-950 font-semibold">Deterministic Curated KB</span>
        </div>
      </div>

      <EvidenceCitationModal
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
        onNavigateToEvidenceTab={onNavigateToEvidenceTab}
      />
    </div>
  );
};
