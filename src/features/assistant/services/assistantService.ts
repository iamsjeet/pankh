import {
  AssistantMessage,
  AssistantResponse,
  SuggestedQuestion,
  CuratedAnswer,
  EvidenceCitation,
  IAssistantService,
} from '../types/assistant';
import {
  CURATED_SUGGESTED_QUESTIONS,
  CURATED_ANSWERS,
} from '../data/curatedKnowledge';
import { incidentService, INCIDENT_ALIAS_MAP } from '@/features/incidents/services/incidentService';

class LocalAssistantService implements IAssistantService {
  private sessions: Map<string, AssistantMessage[]> = new Map();

  /**
   * Retrieves suggested questions tailored to the currently open incident.
   */
  async getSuggestedQuestions(incidentId: string): Promise<SuggestedQuestion[]> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const normalizedKey = incidentId.toLowerCase().trim();
    const resolvedId = INCIDENT_ALIAS_MAP[normalizedKey] || incidentId;
    const questions = CURATED_SUGGESTED_QUESTIONS[resolvedId] || CURATED_SUGGESTED_QUESTIONS[incidentId];
    if (questions && questions.length > 0) {
      return questions;
    }

    // Generic fallback questions if an uncurated incident ID is passed
    return [
      {
        id: 'Q-GEN-01',
        question: 'What is the executive synopsis of this incident?',
        category: 'CAUSE',
        intentKey: 'GENERIC_SYNOPSIS',
      },
      {
        id: 'Q-GEN-02',
        question: 'What official findings were documented by the investigation board?',
        category: 'EVIDENCE',
        intentKey: 'GENERIC_FINDINGS',
      },
      {
        id: 'Q-GEN-03',
        question: 'Which contributing factors were identified?',
        category: 'CONTRIBUTING_FACTORS',
        intentKey: 'GENERIC_CONTRIBUTORS',
      },
    ];
  }

  /**
   * Processes a user question using deterministic keyword and intent pattern matching.
   */
  async submitQuestion(
    incidentId: string,
    question: string,
    history: AssistantMessage[] = []
  ): Promise<AssistantResponse> {
    // Short realistic thinking simulation (380ms)
    await new Promise((resolve) => setTimeout(resolve, 380));

    const normalizedInput = question.toLowerCase().trim();
    const resolvedId = INCIDENT_ALIAS_MAP[incidentId.toLowerCase().trim()] || incidentId;
    const candidateAnswers = CURATED_ANSWERS.filter(
      (a) =>
        a.incidentId.toLowerCase() === resolvedId.toLowerCase() ||
        a.incidentId.toLowerCase() === incidentId.toLowerCase()
    );

    let bestMatch: CuratedAnswer | null = null;
    let highestScore = 0;

    // 1. Check keyword and pattern matches
    for (const item of candidateAnswers) {
      let score = 0;

      // Check keywords
      for (const kw of item.keywords) {
        if (normalizedInput.includes(kw.toLowerCase())) {
          score += 3;
        }
      }

      // Check intent key hints
      if (normalizedInput.includes(item.intentKey.toLowerCase().replace(/_/g, ' '))) {
        score += 4;
      }

      // Bonus for question pattern match
      if (item.questionPatterns) {
        for (const pattern of item.questionPatterns) {
          if (new RegExp(pattern, 'i').test(normalizedInput)) {
            score += 5;
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    // 2. Follow-up context support: if input is a generic follow-up (e.g. "tell me more", "why did that happen")
    // check the previous assistant message for intent continuity
    if (highestScore < 3 && history.length > 0) {
      const lastAssistantMsg = [...history].reverse().find((m) => m.role === 'assistant');
      if (lastAssistantMsg && lastAssistantMsg.suggestedFollowUps) {
        const matchingFollowUp = lastAssistantMsg.suggestedFollowUps.find((fu) =>
          normalizedInput.includes(fu.toLowerCase()) || fu.toLowerCase().includes(normalizedInput)
        );
        if (matchingFollowUp) {
          // Re-search using the full follow-up text
          for (const item of candidateAnswers) {
            for (const kw of item.keywords) {
              if (matchingFollowUp.toLowerCase().includes(kw.toLowerCase())) {
                bestMatch = item;
                highestScore = 5;
                break;
              }
            }
          }
        }
      }
    }

    // 3. Resolve citations from the incident's evidence dossier
    const incidentData = await incidentService.getIncidentById(incidentId);

    // 4. If high enough match found, return curated answer
    if (bestMatch && highestScore >= 2) {
      const citations: EvidenceCitation[] = [];

      if (incidentData && incidentData.evidence) {
        for (const evId of bestMatch.evidenceIds) {
          const foundEv = incidentData.evidence.find((e) => e.id === evId);
          if (foundEv) {
            citations.push({
              evidenceId: foundEv.id,
              claim: foundEv.claim,
              detail: foundEv.detail,
              document: foundEv.source.document,
              section: foundEv.source.section,
              page: foundEv.source.page,
              agency: foundEv.source.agency,
              provenance: foundEv.provenance,
            });
          }
        }
      }

      return {
        answer: bestMatch.answer,
        citations,
        confidence: bestMatch.confidence,
        provenance: bestMatch.provenance,
        suggestedFollowUps: bestMatch.suggestedFollowUps,
        matchedIntentKey: bestMatch.intentKey,
        isFallback: false,
      };
    }

    // 5. Honest Transparent Fallback for unsupported questions
    const fallbackQuestions = (await this.getSuggestedQuestions(incidentId))
      .slice(0, 3)
      .map((q) => q.question);

    return {
      answer:
        "I don't have enough verified information in this incident's available evidence to answer that confidently. " +
        "You can explore the verified evidence findings by asking one of the suggested questions below:",
      citations: [],
      confidence: 'INSUFFICIENT_DATA',
      provenance: 'UNKNOWN',
      suggestedFollowUps: fallbackQuestions,
      isFallback: true,
    };
  }

  /**
   * Resets the conversation session for a given incident.
   */
  async resetConversation(incidentId: string): Promise<void> {
    this.sessions.delete(incidentId);
  }

  /**
   * Retrieves or initializes the message history for an incident.
   */
  async getConversation(incidentId: string): Promise<AssistantMessage[]> {
    if (!this.sessions.has(incidentId)) {
      const initialGreeting: AssistantMessage = {
        id: `MSG-INIT-${incidentId}`,
        role: 'assistant',
        content: `I am the PANKH Investigation Assistant for dossier ${incidentId}. You can ask questions about the sequence of events, official causal findings, flight parameters, or systemic safety factors. Every answer is grounded directly in verified accident investigation evidence.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        confidence: 'HIGH',
        provenance: 'REPORTED_FACT',
      };
      this.sessions.set(incidentId, [initialGreeting]);
    }
    return this.sessions.get(incidentId) || [];
  }

  /**
   * Looks up a specific evidence item for inline citation inspection.
   */
  async getEvidenceItem(
    incidentId: string,
    evidenceId: string
  ): Promise<EvidenceCitation | null> {
    const incidentData = await incidentService.getIncidentById(incidentId);
    if (!incidentData || !incidentData.evidence) return null;

    const ev = incidentData.evidence.find(
      (e) => e.id.toLowerCase() === evidenceId.toLowerCase()
    );
    if (!ev) return null;

    return {
      evidenceId: ev.id,
      claim: ev.claim,
      detail: ev.detail,
      document: ev.source.document,
      section: ev.source.section,
      page: ev.source.page,
      agency: ev.source.agency,
      provenance: ev.provenance,
    };
  }
}

// Singleton exported instance
export const assistantService: IAssistantService = new LocalAssistantService();
