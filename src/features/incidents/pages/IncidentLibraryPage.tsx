import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Info,
  Loader2,
} from 'lucide-react';
import { incidentService } from '../services/incidentService';
import { Incident, IncidentFilterParams } from '../types/incident';
import { IncidentCard } from '../components/IncidentCard';
import { IncidentFilterBar } from '../components/IncidentFilterBar';
import { IncidentEmptyState } from '../components/IncidentEmptyState';
import { Badge } from '@/components/ui/Badge';
import { staggerContainer, slideUp } from '@/animations/variants';

export const IncidentLibraryPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [severities, setSeverities] = useState<string[]>([]);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<IncidentFilterParams>({
    searchQuery: '',
    category: 'ALL',
    severity: 'ALL',
    simulationOnly: false,
  });

  // Load baseline taxonomy
  useEffect(() => {
    let isMounted = true;

    async function loadTaxonomy() {
      try {
        const [cats, sevs, stats] = await Promise.all([
          incidentService.getCategories(),
          incidentService.getSeverities(),
          incidentService.getStats(),
        ]);
        if (isMounted) {
          setCategories(cats);
          setSeverities(sevs);
          setTotalLoaded(stats.totalLoaded);
        }
      } catch (err) {
        console.error('Failed to load incident taxonomy:', err);
      }
    }

    loadTaxonomy();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch filtered incidents
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function fetchFiltered() {
      try {
        const data = await incidentService.getIncidents(filters);
        if (isMounted) {
          setIncidents(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to query incidents:', err);
        if (isMounted) setIsLoading(false);
      }
    }

    fetchFiltered();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'ALL',
      severity: 'ALL',
      simulationOnly: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Incident Library
            </h1>
            <Badge variant="active" size="sm" dot>
              {totalLoaded} CURATED CASES LOADED
            </Badge>
            <Badge variant="mono" size="sm">
              PHASE 1 REPOSITORY
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono max-w-3xl leading-relaxed">
            Curated aviation incident reports, flight data records, and boundary conditions for investigative analysis and scenario synthesis.
          </p>
        </div>

        {/* Workflow Progression Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-panel bg-navy-900 border border-navy-800 text-2xs font-mono text-slate-400 shrink-0">
          <span className="text-cyan-400 font-semibold">1. Incident Library</span>
          <span className="text-slate-600">→</span>
          <span>2. Investigation</span>
          <span className="text-slate-600">→</span>
          <span>3. Simulation</span>
        </div>
      </div>

      {/* Transparent Data Integrity & Provenance Banner */}
      <div className="p-3.5 rounded-panel bg-navy-900/80 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-start sm:items-center gap-2.5 text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-snug">
            All records cite public official investigation reports (BFU, BEA, DGCA, NTSB). Tagged as <strong className="text-cyan-300">DEMO BENCHMARKS</strong> pending selection of the 3 final MVP research cases.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-2xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>PROVENANCE VERIFIED</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <IncidentFilterBar
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        severities={severities}
        totalCount={totalLoaded}
        filteredCount={incidents.length}
        onClearFilters={handleClearFilters}
      />

      {/* Incidents Card Grid / Loading / Empty State */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          <span>Querying incident database...</span>
        </div>
      ) : incidents.length === 0 ? (
        <IncidentEmptyState
          onClearFilters={handleClearFilters}
          searchQuery={filters.searchQuery}
        />
      ) : (
        <motion.div
          key={JSON.stringify(filters)}
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.06)}
          className="grid grid-cols-1 gap-4"
        >
          {incidents.map((incident) => (
            <motion.div key={incident.id} variants={slideUp}>
              <IncidentCard incident={incident} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
