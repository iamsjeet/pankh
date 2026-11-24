/**
 * PANKH Aviation Simulation Domain Types
 * Strongly typed contracts for deterministic playback, decision checkpoints, branching, and debriefing.
 */

export type SimulationProvenance =
  | 'RECORDED_DATA'    // Directly supported recorded data
  | 'REPORT_SUPPORTED' // Derived from documented investigation information
  | 'ILLUSTRATIVE'     // Simplified or assumed scenario parameters
  | 'HYPOTHETICAL'     // Alternative decision branches
  | 'DEMO'             // Demonstration-only information
  | 'RECORDED';        // Legacy alias for recorded data

export type ScenarioType =
  | 'INCIDENT_INFORMED_PLAYBACK'
  | 'DECISION_BRANCHING_SCENARIO'
  | 'TACTICAL_BENCHMARK';

export type SimulationStatus =
  | 'BRIEFING'
  | 'PLAYING'
  | 'PAUSED'
  | 'CHECKPOINT_PAUSED'
  | 'COMPLETED'
  | 'DEBRIEF';

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

export interface Position2D {
  x: number; // 0 to 100 percentage in airspace coordinate view
  y: number; // 0 to 100 percentage in airspace coordinate view
}

export type AircraftSimulationStatus =
  | 'NORMAL'
  | 'TCAS_TA'
  | 'TCAS_RA_CLIMB'
  | 'TCAS_RA_DESCEND'
  | 'ATC_DESCENT'
  | 'EXPEDITE'
  | 'SAFE'
  | 'CONFLICT'
  | 'IMPACT'
  | 'GO_AROUND';

export interface AircraftTelemetry {
  id: string;
  callsign: string;
  type: string;
  position: Position2D;
  altitude: number; // Feet
  altitudeFormatted: string; // e.g. "FL360" or "36,000 FT"
  heading: number; // 0 - 360 degrees
  speed: number; // Knots
  verticalSpeed: number; // FPM (positive climbing, negative descending)
  verticalSpeedFormatted?: string;
  status: AircraftSimulationStatus;
  trail: Position2D[];
}

export interface PlaybackFrame {
  timestamp: number; // Seconds from scenario start
  timestampFormatted: string; // e.g. "T+00:45"
  aircraft: Record<string, AircraftTelemetry>;
  separationDistanceNM?: number;
  verticalSeparationFT?: number;
  activeAlert?: string;
}

export type EventCategory =
  | 'RADAR'
  | 'ATC_INSTRUCTION'
  | 'TCAS_ADVISORY'
  | 'CREW_RESPONSE'
  | 'CHECKPOINT'
  | 'OUTCOME';

export interface SimulationEvent {
  id: string;
  timestamp: number;
  timestampFormatted: string;
  title: string;
  description: string;
  category: EventCategory;
  provenance: SimulationProvenance;
  aircraftId?: string;
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  branchId: string;
  optionType: 'RECOMMENDED_STANDARD' | 'HISTORICAL_ACTION' | 'TACTICAL_ALTERNATIVE';
  consequenceSummary: string;
}

export interface DecisionCheckpoint {
  id: string;
  timestamp: number;
  timestampFormatted: string;
  title: string;
  situationBrief: string;
  userRole: string;
  contextAlert: string;
  options: DecisionOption[];
}

export type OutcomeClassification =
  | 'SAFE_SEPARATION'
  | 'NEAR_MID_AIR_COLLISION'
  | 'CATASTROPHIC_COLLISION'
  | 'GO_AROUND_SAFE';

export interface SimulationOutcome {
  classification: OutcomeClassification;
  title: string;
  summary: string;
  minHorizontalSeparation: string;
  minVerticalSeparation: string;
  isHistoricalBranch: boolean;
  learningPoints: string[];
  comparisonWithReference: string;
}

export interface SimulationBranch {
  id: string;
  checkpointId: string;
  title: string;
  description: string;
  frames: PlaybackFrame[];
  events: SimulationEvent[];
  outcome: SimulationOutcome;
}

export interface ReferencePoint {
  id: string;
  name: string;
  position: Position2D;
  type: 'WAYPOINT' | 'AIRPORT' | 'CONFLICT_POINT' | 'VOR';
}

export interface SimulationScenario {
  id: string;
  incidentId: string;
  title: string;
  scenarioType: ScenarioType;
  provenance: SimulationProvenance;
  userRole: string;
  durationSeconds: number;
  initialConditions: {
    airspace: string;
    weather: string;
    trafficDensity: string;
    surveillance: string;
  };
  briefing: {
    overview: string;
    objectives: string[];
    roleDescription: string;
    disclaimer: string;
  };
  aircraftList: {
    id: string;
    callsign: string;
    type: string;
    operator: string;
    initialAltitude: string;
    color: string;
  }[];
  referencePoints: ReferencePoint[];
  initialFrames: PlaybackFrame[];
  initialEvents: SimulationEvent[];
  checkpoints: DecisionCheckpoint[];
  branches: Record<string, SimulationBranch>;
  referenceBranchId: string;
}

export interface SimulationSession {
  scenarioId: string;
  selectedBranchId: string | null;
  selectedOptionId: string | null;
  completed: boolean;
  currentTimestamp: number;
  history: {
    checkpointId: string;
    optionId: string;
    branchId: string;
  }[];
}
