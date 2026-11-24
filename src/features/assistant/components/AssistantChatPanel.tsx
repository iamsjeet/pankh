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

  // Load conversation & suggested questions whenever incidentId changes
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

  // Auto-scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle question submission
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

  // Keyboard shortcut: Enter to send, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Reset conversation
  const handleResetConversation = async () => {
    await assistantService.resetConversation(incidentId);
    const freshConversation = await assistantService.getConversation(incidentId);
    setMessages(freshConversation);
  };

  return (
    <div
      className={cn(
        'rounded-panel panel-surface-elevated border border-cyan-500/40 flex flex-col h-full overflow-hidden shadow-2xl relative',
        className
      )}
    >
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-navy-700/80 bg-navy-950/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-panel bg-navy-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-glow-cyan-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-semibold text-xs text-white truncate">
                AI Investigation Assistant
              </h3>
              <Badge variant="mono" size="sm">
                PROTOTYPE
              </Badge>
            </div>
            <p className="text-2xs font-mono text-cyan-400 truncate" title={incidentTitle}>
              CURATED KNOWLEDGE PROTOTYPE • {incidentId} ({incidentTitle})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleResetConversation}
            className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition-colors"
            title="Reset conversation session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition-colors"
              title={isExpanded ? 'Collapse to split view' : 'Expand full panel'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition-colors"
              title="Close assistant"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-900/40">
        {messages.map((msg) => (
          <AssistantMessageItem
            key={msg.id}
            message={msg}
            onSelectCitation={setSelectedCitation}
            onSelectFollowUp={(q) => handleSendMessage(q)}
          />
        ))}

        {/* Short Thinking Animation */}
        {isThinking && (
          <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-400 p-3 rounded-panel bg-navy-900/80 border border-cyan-500/20 max-w-sm">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />
            <span>Analyzing verified investigation dossier...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Section */}
      {suggestedQuestions.length > 0 && (
        <div className="px-3.5 py-2 border-t border-navy-800/80 bg-navy-950/90 shrink-0">
          <span className="text-2xs font-mono uppercase text-slate-500 block mb-1.5">
            Suggested Research Questions:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {suggestedQuestions.map((sq) => (
              <button
                key={sq.id}
                type="button"
                onClick={() => handleSendMessage(sq.question)}
                className="px-2.5 py-1 rounded text-2xs font-mono bg-navy-900 border border-navy-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 hover:bg-navy-850 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
              >
                <span>{sq.question}</span>
                <ArrowRight className="w-2.5 h-2.5 text-cyan-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User Input Dock */}
      <div className="p-3 border-t border-navy-700/80 bg-navy-950 shrink-0">
        <div className="relative flex items-center rounded-panel bg-navy-900/90 border border-navy-700 focus-within:border-cyan-500/70 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
          <textarea
            ref={inputRef}
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${incidentId} (e.g. "What caused the collision?", "Explain the timeline")...`}
            className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none font-sans"
          />
          <button
            type="button"
            disabled={!inputValue.trim() || isThinking}
            onClick={() => handleSendMessage()}
            className="mr-2 p-2 rounded-panel bg-cyan-500 text-navy-950 hover:bg-cyan-400 disabled:opacity-35 disabled:hover:bg-cyan-500 disabled:cursor-not-allowed transition-all shadow-glow-cyan-sm"
            title="Send query (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-2xs font-mono text-slate-500 mt-1.5 px-1">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className="text-cyan-400">Deterministic Engine v0.3</span>
        </div>
      </div>

      {/* Interactive Evidence Citation Modal */}
      <EvidenceCitationModal
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
        onNavigateToEvidenceTab={onNavigateToEvidenceTab}
      />
    </div>
  );
};
