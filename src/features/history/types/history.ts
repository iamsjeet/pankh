import {
  SimulationOutcome,
  SimulationProvenance,
} from '@/features/simulation/types/simulation';

/**
 * PANKH History and Persistence Domain Contracts
 * Abstracted interface designed to be backed by localStorage in MVP
 * and swapped with FastAPI/PostgreSQL backend in future releases.
 */

export interface DecisionRecord {
  checkpointId: string;
  checkpointTitle: string;
  timestamp: number;
  timestampFormatted: string;
  situationBrief: string;
  selectedOptionId: string;
  selectedOptionTitle: string;
  optionType: 'RECOMMENDED_STANDARD' | 'HISTORICAL_ACTION' | 'TACTICAL_ALTERNATIVE';
  branchId: string;
  branchTitle: string;
  consequenceSummary: string;
  learningPoints: string[];
}

export interface SimulationAttempt {
  id: string; // e.g. "SIM-ATTEMPT-1732470000000"
  scenarioId: string;
  incidentId: string;
  scenarioTitle: string;
  scenarioType: string;
  provenance: SimulationProvenance;
  timestamp: string; // ISO String
  timestampFormatted: string;
  totalDurationSeconds: number;
  elapsedSeconds: number;
  completed: boolean;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ABORTED';
  userRole: string;
  selectedBranchId: string | null;
  selectedOptionId: string | null;
  decisions: DecisionRecord[];
  outcome?: SimulationOutcome;
  eventsCount: number;
  minSeparationReached?: {
    horizontal: string;
    vertical: string;
  };
}

export interface InvestigationProgress {
  incidentId: string;
  incidentTitle: string;
  category: string;
  severity: string;
  lastVisited: string; // ISO String
  lastVisitedFormatted: string;
  sectionsViewed: string[]; // e.g. ['overview', 'timeline', 'aircraft', 'evidence', 'assistant']
  evidenceInspectedCount: number;
  totalEvidenceCount: number;
  assistantQuestionsAsked: number;
  simulationsAttemptedCount: number;
  simulationCompleted: boolean;
  progressPercent: number; // 0 - 100
}

export interface OutcomeComparisonMetric {
  label: string;
  selectedBranchValue: string | number;
  referenceBranchValue: string | number;
  unit?: string;
  isFavorable?: boolean;
  statusText?: string;
  differenceDescription?: string;
}

export interface OutcomeComparisonData {
  scenarioId: string;
  selectedBranchTitle: string;
  referenceBranchTitle: string;
  selectedClassification: string;
  referenceClassification: string;
  metrics: OutcomeComparisonMetric[];
  evaluationSummary: string;
  isHistoricalMatch: boolean;
}

export interface UserActivityStats {
  totalIncidentsOpened: number;
  totalSimulationsRun: number;
  completedSimulations: number;
  safeOutcomesCount: number;
  hazardousOutcomesCount: number;
  totalDecisionsMade: number;
  assistantQuestionsTotal: number;
  lastActivityTimestamp: string | null;
}
