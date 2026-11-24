/**
 * PANKH Aviation Incident Domain Types
 * Strongly typed models for the Investigation Workspace and replaceable data service layer.
 */

export type ProvenanceType =
  | 'REPORTED_FACT'
  | 'OFFICIAL_FINDING'
  | 'AI_INTERPRETATION'
  | 'HUMAN_ASSUMPTION'
  | 'UNKNOWN'
  | 'DEMO_DATA';

export type IncidentSeverity =
  | 'Catastrophic'
  | 'Serious Incident'
  | 'Loss of Separation'
  | 'System Anomaly';

export type IncidentCategory =
  | 'Mid-Air Collision & Loss of Separation'
  | 'Sensor Discrepancy & Aerodynamic Stall'
  | 'Controlled Flight Into Terrain'
  | 'Runway & Ground Safety'
  | 'Automation & Mode Confusion';

export type TimelineEventCategory =
  | 'ATC_COMMUNICATION'
  | 'FLIGHT_CREW_ACTION'
  | 'SYSTEM_ALERT'
  | 'RADAR_TRACK'
  | 'ENVIRONMENTAL_TRIGGER'
  | 'COLLISION_EVENT'
  | 'POST_INCIDENT';

export type EvidenceCategory =
  | 'REPORTED_FACT'
  | 'OFFICIAL_FINDING'
  | 'CONTRIBUTING_FACTOR'
  | 'UNKNOWN_OR_UNRESOLVED';

export interface IncidentLocation {
  name: string;
  country?: string;
  icao?: string;
  fir?: string; // Flight Information Region
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AircraftRecord {
  type: string;
  model: string;
  operator: string;
  registration?: string;
  flightNumber?: string;
  flightPhase?: string;
  altitude?: string;
  airspeed?: string;
  heading?: string;
  squawk?: string;
  tcasEquipment?: string;
  fmsMode?: string;
  crewComplement?: string;
}

export interface SourceReference {
  document: string;
  section?: string;
  page?: string | number;
  publishedYear?: number;
  agency: string;
  url?: string;
}

export interface InvestigationSource {
  organization: string; // e.g. "BFU (Federal Bureau of Aircraft Accident Investigation, Germany)"
  reportTitle: string;
  reportDocumentId?: string; // e.g. "BFU AX001-1-2/02"
  isOfficialReport: boolean;
  publishedYear?: number;
  url?: string;
}

export interface IncidentProvenance {
  isDemo: boolean;
  verificationStatus: 'DEMO_BENCHMARK' | 'HISTORICAL_CURATED' | 'PRELIMINARY_INGEST';
  disclaimer: string;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp?: string; // e.g. "21:34:42 UTC" or "T-01:14"
  relativeSeconds?: number;
  title: string;
  description: string;
  category: TimelineEventCategory;
  provenance: ProvenanceType;
  sourceReference?: SourceReference;
  aircraftInvolved?: string; // e.g. "BTC 2937", "DHX 611", or "All"
  flightParameters?: {
    altitude?: string;
    airspeed?: string;
    heading?: string;
    verticalSpeed?: string;
  };
}

export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  claim: string;
  detail: string;
  source: SourceReference;
  provenance: ProvenanceType;
  verificationNotes?: string;
}

export interface ExecutiveSummary {
  overview: string;
  safetyIssue: string;
  outcome: string;
}

export interface Incident {
  id: string; // e.g. "DEMO-2002-UBL"
  title: string;
  subtitle: string;
  date: string; // ISO "YYYY-MM-DD"
  location: IncidentLocation;
  aircraft: AircraftRecord[];
  category: IncidentCategory;
  severity: IncidentSeverity;
  summary: string;
  executiveSummary?: ExecutiveSummary;
  source: InvestigationSource;
  provenance: IncidentProvenance;
  keyFactors: string[];
  timeline: IncidentTimelineEvent[];
  evidence: EvidenceItem[];
  simulationReady: boolean;
  interactiveBranchingAvailable: boolean;
  timelineEventCount: number;
}

export interface IncidentFilterParams {
  searchQuery?: string;
  category?: string;
  severity?: string;
  simulationOnly?: boolean;
}

export interface IncidentLibraryStats {
  totalLoaded: number;
  filteredCount: number;
  categoriesCount: Record<string, number>;
  severitiesCount: Record<string, number>;
}
