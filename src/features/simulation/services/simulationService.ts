import { SimulationScenario } from '../types/simulation';
import {
  SCENARIOS_BY_INCIDENT_ID,
  UBERLINGEN_SCENARIO,
  CHARKHI_DADRI_SCENARIO,
} from '../data/simulationScenarios';
import { INCIDENT_ALIAS_MAP } from '@/features/incidents/services/incidentService';

export interface ISimulationService {
  getScenarioByIncidentId(incidentId: string): Promise<SimulationScenario | null>;
  getScenarioByIncidentIdSync(incidentId: string): SimulationScenario | null;
  getAllScenarios(): Promise<SimulationScenario[]>;
}

class LocalSimulationService implements ISimulationService {
  getScenarioByIncidentIdSync(incidentId: string): SimulationScenario | null {
    const key = incidentId.toLowerCase().trim();
    const resolvedId = INCIDENT_ALIAS_MAP[key] || incidentId;
    const found = SCENARIOS_BY_INCIDENT_ID[resolvedId] || SCENARIOS_BY_INCIDENT_ID[incidentId];
    if (found) return found;

    // Fallback pattern matching
    if (incidentId.toLowerCase().includes('ubl') || incidentId === 'DEMO-2002-UBL' || incidentId === 'HIST-2002-UBL') {
      return UBERLINGEN_SCENARIO;
    }
    if (incidentId.toLowerCase().includes('chrk') || incidentId === 'DEMO-1996-CHRK' || incidentId === 'HIST-1996-CHRK') {
      return CHARKHI_DADRI_SCENARIO;
    }

    return null;
  }

  async getScenarioByIncidentId(incidentId: string): Promise<SimulationScenario | null> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return this.getScenarioByIncidentIdSync(incidentId);
  }

  async getAllScenarios(): Promise<SimulationScenario[]> {
    return [UBERLINGEN_SCENARIO, CHARKHI_DADRI_SCENARIO];
  }
}

export const simulationService: ISimulationService = new LocalSimulationService();
