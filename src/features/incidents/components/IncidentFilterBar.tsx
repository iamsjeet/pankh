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

  return (
    <div className="space-y-4 p-5 rounded-card panel-surface">
      {/* Top Row: Search + Selectors */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <div className="flex-1 min-w-0">
          <SearchBar
            value={filters.searchQuery || ''}
            onChange={(val) => onFilterChange({ ...filters, searchQuery: val })}
            placeholder="Search by ID, title, location, aircraft (e.g. B757, Überlingen, pitot)..."
            className="w-full max-w-none"
          />
        </div>

        <div className="w-full sm:w-64">
          <Select
            options={[
              { value: 'ALL', label: 'All Incident Categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
            value={filters.category || 'ALL'}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          />
        </div>

        <div className="w-full sm:w-52">
          <Select
            options={[
              { value: 'ALL', label: 'All Severities' },
              ...severities.map((s) => ({ value: s, label: s })),
            ]}
            value={filters.severity || 'ALL'}
            onChange={(e) => onFilterChange({ ...filters, severity: e.target.value })}
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-obsidian-950/10 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, simulationOnly: !filters.simulationOnly })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-subtle border text-2xs transition-colors select-none ${
              filters.simulationOnly
                ? 'bg-obsidian-950 border-obsidian-950 text-lime-400 font-medium'
                : 'bg-sand-100 border-obsidian-950/15 text-stone-600 hover:text-obsidian-950'
            }`}
          >
            {filters.simulationOnly ? (
              <CheckSquare className="w-3.5 h-3.5 text-lime-400" />
            ) : (
              <Square className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span>Simulation Playback Ready</span>
          </button>

          <div className="text-stone-500 text-2xs flex items-center gap-1.5">
            <span>Showing:</span>
            <strong className="text-obsidian-950 font-semibold">{filteredCount}</strong>
            <span>of {totalCount} records</span>
          </div>

          {activeFilterCount > 0 && (
            <Badge variant="accent" size="sm">
              {activeFilterCount} active
            </Badge>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="xs"
            onClick={onClearFilters}
            leftIcon={<RotateCcw className="w-3 h-3" />}
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};
