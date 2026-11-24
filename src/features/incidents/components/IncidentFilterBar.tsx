import React from 'react';
import { RotateCcw, CheckSquare, Square } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IncidentFilterParams } from '../types/incident';

export interface IncidentFilterBarProps {
  filters: IncidentFilterParams;
  onFilterChange: (newFilters: IncidentFilterParams) => void;
  categories: string[];
  severities: string[];
  totalCount: number;
  filteredCount: number;
  onClearFilters: () => void;
}

export const IncidentFilterBar: React.FC<IncidentFilterBarProps> = ({
  filters,
  onFilterChange,
  categories,
  severities,
  totalCount,
  filteredCount,
  onClearFilters,
}) => {
  const hasActiveFilters =
    Boolean(filters.searchQuery && filters.searchQuery.trim() !== '') ||
    Boolean(filters.category && filters.category !== 'ALL') ||
    Boolean(filters.severity && filters.severity !== 'ALL') ||
    Boolean(filters.simulationOnly);

  const activeFilterCount = [
    Boolean(filters.searchQuery?.trim()),
    Boolean(filters.category && filters.category !== 'ALL'),
    Boolean(filters.severity && filters.severity !== 'ALL'),
    Boolean(filters.simulationOnly),
  ].filter(Boolean).length;

  const handleSearchChange = (val: string) => {
    onFilterChange({ ...filters, searchQuery: val });
  };

  const handleCategoryChange = (val: string) => {
    onFilterChange({ ...filters, category: val });
  };

  const handleSeverityChange = (val: string) => {
    onFilterChange({ ...filters, severity: val });
  };

  const handleSimulationToggle = () => {
    onFilterChange({ ...filters, simulationOnly: !filters.simulationOnly });
  };

  return (
    <div className="space-y-3.5 p-4 rounded-panel panel-surface border border-navy-700/80">
      {/* Top Row: Search + Main Selectors */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Bar */}
        <div className="flex-1 min-w-[280px]">
          <SearchBar
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            placeholder="Search by ID, title, location, aircraft (e.g. B757, Überlingen, pitot)..."
            className="w-full max-w-none"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-64">
          <Select
            options={[
              { value: 'ALL', label: 'All Incident Categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
            value={filters.category || 'ALL'}
            onChange={(e) => handleCategoryChange(e.target.value)}
          />
        </div>

        {/* Severity Filter */}
        <div className="w-full sm:w-52">
          <Select
            options={[
              { value: 'ALL', label: 'All Severities' },
              ...severities.map((s) => ({ value: s, label: s })),
            ]}
            value={filters.severity || 'ALL'}
            onChange={(e) => handleSeverityChange(e.target.value)}
          />
        </div>
      </div>

      {/* Bottom Row: Simulation Toggle, Active Filter Summary, Clear Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-navy-800/80 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          {/* Simulation Toggle */}
          <button
            type="button"
            onClick={handleSimulationToggle}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-2xs transition-colors select-none ${
              filters.simulationOnly
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 font-medium'
                : 'bg-navy-900 border-navy-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {filters.simulationOnly ? (
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>Simulation Playback Ready</span>
          </button>

          {/* Results Counter */}
          <div className="text-slate-400 text-2xs flex items-center gap-1.5">
            <span>Showing:</span>
            <strong className="text-white font-semibold">{filteredCount}</strong>
            <span>of {totalCount} curated cases</span>
          </div>
        </div>

        {/* Clear Filters Action */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Badge variant="accent" size="sm">
              {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
            </Badge>
            <Button
              variant="outline"
              size="xs"
              onClick={onClearFilters}
              leftIcon={<RotateCcw className="w-3 h-3" />}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
