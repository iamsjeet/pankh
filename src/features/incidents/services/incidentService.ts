import {
  Incident,
  IncidentFilterParams,
  IncidentLibraryStats,
} from '../types/incident';
import { CURATED_INCIDENTS } from '../data/mockIncidents';

/**
 * Historical & Demo Alias Map
 * Guarantees 100% backward compatibility for legacy bookmarks, direct URLs,
 * and previously saved localStorage sessions without broken links.
 */
export const INCIDENT_ALIAS_MAP: Record<string, string> = {
  'demo-2002-ubl': 'HIST-2002-UBL',
  'hist-2002-ubl': 'HIST-2002-UBL',
  'demo-2009-af447': 'HIST-2009-AF447',
  'hist-2009-af447': 'HIST-2009-AF447',
  'demo-1996-chrk': 'HIST-1996-CHRK',
  'hist-1996-chrk': 'HIST-1996-CHRK',
  'demo-2017-sfo': 'DEMO-2017-SFO',
};

/**
 * Incident Service Interface
 * Designed to be swapped seamlessly with an API client when FastAPI + PostgreSQL backend is integrated.
 */
export interface IIncidentService {
  getIncidents(params?: IncidentFilterParams): Promise<Incident[]>;
  getIncidentById(id: string): Promise<Incident | null>;
  getStats(): Promise<IncidentLibraryStats>;
  getCategories(): Promise<string[]>;
  getSeverities(): Promise<string[]>;
}

class LocalIncidentService implements IIncidentService {
  private incidents: Incident[] = CURATED_INCIDENTS;

  /**
   * Fetch all incidents with optional client-side filtering.
   * Simulates async network delay (tiny 50ms) to ensure clean loading states.
   */
  async getIncidents(params?: IncidentFilterParams): Promise<Incident[]> {
    await new Promise((resolve) => setTimeout(resolve, 40));

    let results = [...this.incidents];

    if (!params) {
      return results;
    }

    const { searchQuery, category, severity, simulationOnly } = params;

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter((inc) => {
        const matchesTitle = inc.title.toLowerCase().includes(q);
        const matchesId = inc.id.toLowerCase().includes(q);
        const matchesLocation =
          inc.location.name.toLowerCase().includes(q) ||
          (inc.location.country && inc.location.country.toLowerCase().includes(q)) ||
          (inc.location.fir && inc.location.fir.toLowerCase().includes(q));
        const matchesAircraft = inc.aircraft.some(
          (a) =>
            a.type.toLowerCase().includes(q) ||
            a.model.toLowerCase().includes(q) ||
            a.operator.toLowerCase().includes(q) ||
            (a.registration && a.registration.toLowerCase().includes(q))
        );
        const matchesCategory = inc.category.toLowerCase().includes(q);
        const matchesSummary = inc.summary.toLowerCase().includes(q);
        const matchesKeyFactors = inc.keyFactors.some((k) => k.toLowerCase().includes(q));

        return (
          matchesTitle ||
          matchesId ||
          matchesLocation ||
          matchesAircraft ||
          matchesCategory ||
          matchesSummary ||
          matchesKeyFactors
        );
      });
    }

    if (category && category !== 'ALL') {
      results = results.filter((inc) => inc.category === category);
    }

    if (severity && severity !== 'ALL') {
      results = results.filter((inc) => inc.severity === severity);
    }

    if (simulationOnly) {
      results = results.filter((inc) => inc.simulationReady);
    }

    return results;
  }

  async getIncidentById(id: string): Promise<Incident | null> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const normalized = id.toLowerCase().trim();
    const resolvedId = INCIDENT_ALIAS_MAP[normalized] || id;
    const found = this.incidents.find(
      (inc) =>
        inc.id.toLowerCase() === resolvedId.toLowerCase() ||
        inc.id.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  }

  async getStats(): Promise<IncidentLibraryStats> {
    const totalLoaded = this.incidents.length;
    const categoriesCount: Record<string, number> = {};
    const severitiesCount: Record<string, number> = {};

    this.incidents.forEach((inc) => {
      categoriesCount[inc.category] = (categoriesCount[inc.category] || 0) + 1;
      severitiesCount[inc.severity] = (severitiesCount[inc.severity] || 0) + 1;
    });

    return {
      totalLoaded,
      filteredCount: totalLoaded,
      categoriesCount,
      severitiesCount,
    };
  }

  async getCategories(): Promise<string[]> {
    const categories = Array.from(new Set(this.incidents.map((i) => i.category)));
    return categories;
  }

  async getSeverities(): Promise<string[]> {
    const severities = Array.from(new Set(this.incidents.map((i) => i.severity)));
    return severities;
  }
}

// Export singleton service instance
export const incidentService: IIncidentService = new LocalIncidentService();
