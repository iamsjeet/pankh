import { ProvenanceType } from '@/features/incidents/types/incident';

/**
 * PANKH AI Investigation Assistant Domain Types
 * Designed for replaceable architecture allowing transition from deterministic engine to LLM/RAG backend.
 */

export interface EvidenceCitation {
  evidenceId: string;
  claim: string;
  detail: string;
  document: string;
  section?: string;
  page?: string | number;
  agency: string;
  provenance: ProvenanceType;
}

export type ConfidenceLevel = 'HIGH' | 'MODERATE' | 'LOW' | 'INSUFFICIENT_DATA';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO or formatted time
  citations?: EvidenceCitation[];
  confidence?: ConfidenceLevel;
  confidenceScore?: number; // 0.0 to 1.0
  provenance?: ProvenanceType;
  suggestedFollowUps?: string[];
  isFallback?: boolean;
}

export type QuestionCategory =
  | 'CAUSE'
  | 'TIMELINE'
  | 'EVIDENCE'
  | 'CONTRIBUTING_FACTORS'
  | 'SAFETY_IMPACT'
  | 'PREVENTION'
  | 'SYSTEMS';

export interface SuggestedQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  intentKey: string;
}

export interface CuratedAnswer {
  intentKey: string;
  incidentId: string;
  keywords: string[];
  questionPatterns?: string[];
  answer: string;
  evidenceIds: string[];
  confidence: ConfidenceLevel;
  provenance: ProvenanceType;
  suggestedFollowUps: string[];
}

export interface AssistantResponse {
  answer: string;
  citations: EvidenceCitation[];
  confidence: ConfidenceLevel;
  provenance: ProvenanceType;
  suggestedFollowUps: string[];
  matchedIntentKey?: string;
  isFallback: boolean;
}

export interface ConversationSession {
  incidentId: string;
  messages: AssistantMessage[];
  lastUpdated: string;
}

export interface IAssistantService {
  getSuggestedQuestions(incidentId: string): Promise<SuggestedQuestion[]>;
  submitQuestion(
    incidentId: string,
    question: string,
    history?: AssistantMessage[]
  ): Promise<AssistantResponse>;
  resetConversation(incidentId: string): Promise<void>;
  getConversation(incidentId: string): Promise<AssistantMessage[]>;
  getEvidenceItem(
    incidentId: string,
    evidenceId: string
  ): Promise<EvidenceCitation | null>;
}
