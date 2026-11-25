import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Loader2, ShieldAlert } from 'lucide-react';
import { incidentService } from '../services/incidentService';
import { Incident, IncidentFilterParams } from '../types/incident';
import { IncidentFilterBar } from '../components/IncidentFilterBar';
import { IncidentEmptyState } from '../components/IncidentEmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InteractiveSurface } from '@/components/ui/InteractiveSurface';
import { cn } from '@/utils/cn';

const IncidentTrajectory3D = lazy(() =>
  import('../components/IncidentTrajectory3D').then((m) => ({ default: m.IncidentTrajectory3D }))
);

export const IncidentLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [severities, setSeverities] = useState<string[]>([]);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activePreviewId, setActivePreviewId] = useState<string>('HIST-2002-UBL');

  const [filters, setFilters] = useState<IncidentFilterParams>({
    searchQuery: '',
    category: 'ALL',
    severity: 'ALL',
    simulationOnly: false,
  });

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

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    async function fetchFiltered() {
      try {
        const data = await incidentService.getIncidents(filters);
        if (isMounted) {
          setIncidents(data);
          if (data.length > 0 && !data.some((d) => d.id === activePreviewId)) {
            setActivePreviewId(data[0].id);
          }
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

  const activeIncident = incidents.find((i) => i.id === activePreviewId) || incidents[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Editorial Archive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-obsidian-950/12">
        <div>
          <span className="text-2xs font-mono uppercase tracking-widest text-stone-500">
            EDITORIAL RESEARCH ARCHIVE • {totalLoaded} RECORDS
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-obsidian-950 mt-1">
            Incident <span className="font-serif italic font-normal">Library</span>
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md leading-relaxed">
          Select a historical investigation to inspect primary BFU, BEA, and DGCA India evidence,
          or hover an entry to preview its illustrative 3D flight geometry.
        </p>
      </div>

      {/* Filter Controls */}
      <IncidentFilterBar
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        severities={severities}
        totalCount={totalLoaded}
        filteredCount={incidents.length}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-stone-500 font-mono text-xs gap-3">
          <Loader2 className="w-6 h-6 text-obsidian-950 animate-spin" />
          <span>Loading research archive...</span>
        </div>
      ) : incidents.length === 0 ? (
        <IncidentEmptyState
          onClearFilters={handleClearFilters}
          searchQuery={filters.searchQuery}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Editorial Stacked Archive Rows (No Conventional Card Grid) */}
          <div className="lg:col-span-7 divide-y divide-obsidian-950/15 border-y border-obsidian-950/15">
            {incidents.map((incident, idx) => {
              const isSelected = activePreviewId === incident.id;
              return (
                <motion.div
                  key={incident.id}
                  onMouseEnter={() => setActivePreviewId(incident.id)}
                  onFocus={() => setActivePreviewId(incident.id)}
                  className="group"
                >
                  <InteractiveSurface
                    tilt={false}
                    spotlight
                    data-cursor="inspect"
                    onClick={() => navigate(`/app/investigations/${incident.id}`)}
                    className={cn(
                      'py-7 px-4 -mx-2 rounded-card cursor-pointer transition-colors',
                      isSelected ? 'bg-sand-25 shadow-editorial' : 'hover:bg-sand-25/70'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-baseline gap-4 min-w-0">
                        <span
                          className={cn(
                            'font-serif italic text-3xl sm:text-4xl transition-colors shrink-0',
                            isSelected ? 'text-obsidian-950' : 'text-stone-400 group-hover:text-obsidian-950'
                          )}
                        >
                          0{idx + 1}
                        </span>

                        <div className="min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2 text-2xs font-mono">
                            <span className="font-semibold text-obsidian-950 bg-lime-400/60 px-2 py-0.5 rounded-subtle">
                              {incident.id}
                            </span>
                            <span className="text-stone-500">{incident.date}</span>
                            {incident.provenance.isDemo ? (
                              <Badge variant="warning" size="sm">DEMO BENCHMARK</Badge>
                            ) : (
                              <Badge variant="nominal" size="sm">HISTORICAL</Badge>
                            )}
                            {incident.simulationReady && (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                <Activity className="w-3 h-3" /> 3D SIM
                              </span>
                            )}
                          </div>

                          <h2 className="font-heading text-xl sm:text-2xl font-bold text-obsidian-950 tracking-tight leading-snug">
                            {incident.title}
                          </h2>

                          <p className="text-xs font-mono text-stone-500">
                            {incident.location.name} • {incident.aircraft.map((a) => a.model).join(' / ')}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant={isSelected ? 'primary' : 'ghost'}
                        size="sm"
                        magnetic
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/app/investigations/${incident.id}`);
                        }}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="shrink-0 mt-1"
                      >
                        <span className="hidden sm:inline">Open</span>
                      </Button>
                    </div>

                    {/* Progressive Disclosure Summary on Active/Hover */}
                    <div
                      className={cn(
                        'mt-3 pl-11 sm:pl-12 text-xs text-stone-600 leading-relaxed transition-all duration-200',
                        isSelected ? 'opacity-100 max-h-24' : 'opacity-70 max-h-16 overflow-hidden'
                      )}
                    >
                      {incident.summary}
                    </div>
                  </InteractiveSurface>
                </motion.div>
              );
            })}
          </div>

          {/* Right 5 Cols: Sticky 3D Trajectory Preview Stage */}
          {activeIncident && (
            <div className="lg:col-span-5 lg:sticky lg:top-6 rounded-card bg-obsidian-950 text-sand-50 border border-obsidian-800 overflow-hidden shadow-editorial-dark">
              <div className="p-4 border-b border-white/10 flex items-center justify-between text-2xs font-mono">
                <span className="text-lime-400 font-semibold">{activeIncident.id}</span>
                <span className="text-stone-400">DRAG TO INSPECT 3D GEOMETRY</span>
              </div>

              <div className="h-72 sm:h-80 w-full relative" data-cursor="orbit">
                <Suspense
                  fallback={
                    <div className="h-full flex items-center justify-center text-xs font-mono text-stone-400">
                      Loading 3D preview...
                    </div>
                  }
                >
                  <IncidentTrajectory3D incidentId={activeIncident.id} className="w-full h-full" />
                </Suspense>

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-subtle bg-obsidian-850/90 border border-white/10 text-2xs font-mono text-stone-400 pointer-events-none">
                  ILLUSTRATIVE 3D TRAJECTORY • NOT A RADAR RECONSTRUCTION
                </div>
              </div>

              <div className="p-5 bg-obsidian-850 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-400">Authority</span>
                  <span className="font-medium text-sand-50 truncate max-w-[240px]">
                    {activeIncident.source.organization.split('(')[0].trim()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-400">Category</span>
                  <span className="font-medium text-lime-400">{activeIncident.category}</span>
                </div>
                {activeIncident.provenance.isDemo && (
                  <div className="p-2.5 rounded-subtle bg-amber-950/50 border border-amber-500/30 text-2xs font-mono text-amber-200 flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Retained Demonstration Benchmark Record</span>
                  </div>
                )}
                <Button
                  variant="accent"
                  size="md"
                  fullWidth
                  magnetic
                  onClick={() => navigate(`/app/investigations/${activeIncident.id}`)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Open Investigation Workspace
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
