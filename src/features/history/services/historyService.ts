import {
  InvestigationProgress,
  SimulationAttempt,
  UserActivityStats,
} from '../types/history';
import { INCIDENT_ALIAS_MAP } from '@/features/incidents/services/incidentService';

export interface IHistoryStorageService {
  getIncidentHistories(): InvestigationProgress[];
  getIncidentHistory(incidentId: string): InvestigationProgress | null;
  recordIncidentVisit(params: {
    incidentId: string;
    incidentTitle: string;
    category?: string;
    severity?: string;
    section?: string;
    totalEvidenceCount?: number;
  }): InvestigationProgress;
  recordEvidenceInspection(incidentId: string, count?: number): void;
  recordAssistantQuestion(incidentId: string): void;
  getSimulationAttempts(): SimulationAttempt[];
  getSimulationAttemptById(attemptId: string): SimulationAttempt | null;
  saveSimulationAttempt(
    attempt: Omit<SimulationAttempt, 'id' | 'timestamp' | 'timestampFormatted'> & {
      id?: string;
      timestamp?: string;
      timestampFormatted?: string;
    }
  ): SimulationAttempt;
  getAggregateStats(): UserActivityStats;
  clearAllHistory(): void;
}

const STORAGE_KEYS = {
  INVESTIGATIONS: 'pankh_v1_investigations',
  SIMULATIONS: 'pankh_v1_simulations',
  VERSION: 'pankh_v1_meta',
};

class LocalHistoryStorageService implements IHistoryStorageService {
  private isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private safeGet<T>(key: string, fallback: T): T {
    if (!this.isStorageAvailable()) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[HistoryService] Failed to parse key ${key}, using fallback:`, err);
      return fallback;
    }
  }

  private safeSet<T>(key: string, value: T): void {
    if (!this.isStorageAvailable()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[HistoryService] Failed to write key ${key}:`, err);
    }
  }

  getIncidentHistories(): InvestigationProgress[] {
    const records = this.safeGet<InvestigationProgress[]>(STORAGE_KEYS.INVESTIGATIONS, []);
    return records.sort(
      (a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
    );
  }

  getIncidentHistory(incidentId: string): InvestigationProgress | null {
    const list = this.getIncidentHistories();
    const resolvedId = INCIDENT_ALIAS_MAP[incidentId.toLowerCase().trim()] || incidentId;
    return (
      list.find(
        (item) =>
          item.incidentId.toLowerCase() === incidentId.toLowerCase() ||
          item.incidentId.toLowerCase() === resolvedId.toLowerCase()
      ) || null
    );
  }

  recordIncidentVisit(params: {
    incidentId: string;
    incidentTitle: string;
    category?: string;
    severity?: string;
    section?: string;
    totalEvidenceCount?: number;
  }): InvestigationProgress {
    const list = this.getIncidentHistories();
    const existingIndex = list.findIndex((item) => item.incidentId === params.incidentId);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let record: InvestigationProgress;

    if (existingIndex >= 0) {
      const prev = list[existingIndex];
      const sections = new Set(prev.sectionsViewed);
      if (params.section) sections.add(params.section);

      const totalEv = params.totalEvidenceCount || prev.totalEvidenceCount || 6;
      // Calculate progress percentage based on sections and evidence reviewed
      const sectionScore = Math.min(60, (sections.size / 5) * 60);
      const evidenceScore = Math.min(30, (prev.evidenceInspectedCount / (totalEv || 1)) * 30);
      const assistantScore = prev.assistantQuestionsAsked > 0 ? 10 : 0;
      const progressPercent = Math.min(100, Math.round(sectionScore + evidenceScore + assistantScore));

      record = {
        ...prev,
        incidentTitle: params.incidentTitle || prev.incidentTitle,
        category: params.category || prev.category,
        severity: params.severity || prev.severity,
        lastVisited: now.toISOString(),
        lastVisitedFormatted: formattedDate,
        sectionsViewed: Array.from(sections),
        totalEvidenceCount: totalEv,
        progressPercent,
      };
      list[existingIndex] = record;
    } else {
      const sections = params.section ? [params.section] : ['overview'];
      record = {
        incidentId: params.incidentId,
        incidentTitle: params.incidentTitle,
        category: params.category || 'Aviation Incident',
        severity: params.severity || 'Serious Incident',
        lastVisited: now.toISOString(),
        lastVisitedFormatted: formattedDate,
        sectionsViewed: sections,
        evidenceInspectedCount: 0,
        totalEvidenceCount: params.totalEvidenceCount || 6,
        assistantQuestionsAsked: 0,
        simulationsAttemptedCount: 0,
        simulationCompleted: false,
        progressPercent: 20,
      };
      list.unshift(record);
    }

    this.safeSet(STORAGE_KEYS.INVESTIGATIONS, list);
    return record;
  }

  recordEvidenceInspection(incidentId: string, count: number = 1): void {
    const list = this.getIncidentHistories();
    const item = list.find((r) => r.incidentId === incidentId);
    if (!item) return;

    item.evidenceInspectedCount = Math.min(
      item.totalEvidenceCount,
      item.evidenceInspectedCount + count
    );
    item.progressPercent = Math.min(
      100,
      item.progressPercent + 10
    );
    this.safeSet(STORAGE_KEYS.INVESTIGATIONS, list);
  }

  recordAssistantQuestion(incidentId: string): void {
    const list = this.getIncidentHistories();
    const item = list.find((r) => r.incidentId === incidentId);
    if (!item) return;

    item.assistantQuestionsAsked = (item.assistantQuestionsAsked || 0) + 1;
    item.progressPercent = Math.min(100, item.progressPercent + 5);
    this.safeSet(STORAGE_KEYS.INVESTIGATIONS, list);
  }

  getSimulationAttempts(): SimulationAttempt[] {
    const records = this.safeGet<SimulationAttempt[]>(STORAGE_KEYS.SIMULATIONS, []);
    return records.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getSimulationAttemptById(attemptId: string): SimulationAttempt | null {
    const list = this.getSimulationAttempts();
    return list.find((attempt) => attempt.id === attemptId) || null;
  }

  saveSimulationAttempt(
    attemptData: Omit<SimulationAttempt, 'id' | 'timestamp' | 'timestampFormatted'> & {
      id?: string;
      timestamp?: string;
      timestampFormatted?: string;
    }
  ): SimulationAttempt {
    const list = this.getSimulationAttempts();
    const now = new Date();
    const id = attemptData.id || `SIM-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = attemptData.timestamp || now.toISOString();
    const timestampFormatted =
      attemptData.timestampFormatted ||
      now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    const fullAttempt: SimulationAttempt = {
      ...attemptData,
      id,
      timestamp,
      timestampFormatted,
    };

    const existingIndex = list.findIndex((a) => a.id === id);
    if (existingIndex >= 0) {
      list[existingIndex] = fullAttempt;
    } else {
      list.unshift(fullAttempt);
    }

    this.safeSet(STORAGE_KEYS.SIMULATIONS, list);

    // Also update corresponding Incident history record
    const incidentHistories = this.getIncidentHistories();
    const incidentRecord = incidentHistories.find((r) => r.incidentId === fullAttempt.incidentId);
    if (incidentRecord) {
      incidentRecord.simulationsAttemptedCount = (incidentRecord.simulationsAttemptedCount || 0) + 1;
      if (fullAttempt.completed) {
        incidentRecord.simulationCompleted = true;
        incidentRecord.progressPercent = 100;
      }
      this.safeSet(STORAGE_KEYS.INVESTIGATIONS, incidentHistories);
    }

    return fullAttempt;
  }

  getAggregateStats(): UserActivityStats {
    const investigations = this.getIncidentHistories();
    const simulations = this.getSimulationAttempts();

    const safeCount = simulations.filter(
      (s) => s.outcome?.classification === 'SAFE_SEPARATION'
    ).length;
    const hazardousCount = simulations.filter(
      (s) =>
        s.outcome?.classification === 'CATASTROPHIC_COLLISION' ||
        s.outcome?.classification === 'NEAR_MID_AIR_COLLISION'
    ).length;

    const totalDecisions = simulations.reduce(
      (acc, s) => acc + (s.decisions ? s.decisions.length : 0),
      0
    );
    const totalAssistant = investigations.reduce(
      (acc, i) => acc + (i.assistantQuestionsAsked || 0),
      0
    );

    const latestTimestamp =
      simulations[0]?.timestamp ||
      investigations[0]?.lastVisited ||
      null;

    return {
      totalIncidentsOpened: investigations.length,
      totalSimulationsRun: simulations.length,
      completedSimulations: simulations.filter((s) => s.completed).length,
      safeOutcomesCount: safeCount,
      hazardousOutcomesCount: hazardousCount,
      totalDecisionsMade: totalDecisions,
      assistantQuestionsTotal: totalAssistant,
      lastActivityTimestamp: latestTimestamp,
    };
  }

  clearAllHistory(): void {
    if (!this.isStorageAvailable()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEYS.INVESTIGATIONS);
      window.localStorage.removeItem(STORAGE_KEYS.SIMULATIONS);
    } catch (err) {
      console.error('[HistoryService] Failed to clear history:', err);
    }
  }
}

export const historyService: IHistoryStorageService = new LocalHistoryStorageService();
