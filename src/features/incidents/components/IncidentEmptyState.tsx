import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface IncidentEmptyStateProps {
  onClearFilters: () => void;
  searchQuery?: string;
}

export const IncidentEmptyState: React.FC<IncidentEmptyStateProps> = ({
  onClearFilters,
  searchQuery,
}) => {
  return (
    <div className="p-12 rounded-panel panel-surface border border-navy-800 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center mb-4 text-slate-400">
        <SearchX className="w-6 h-6 text-cyan-400/80" />
      </div>

      <h3 className="font-heading font-semibold text-lg text-white mb-2">
        No Matching Incident Records
      </h3>

      <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6">
        {searchQuery ? (
          <>
            No records matched <span className="text-cyan-300 font-mono">"{searchQuery}"</span> under current filters. Try broader criteria or clear all filters.
          </>
        ) : (
          'No incidents match the active category and severity filter criteria. Reset filters to view all curated records.'
        )}
      </p>

      <Button
        variant="primary"
        size="sm"
        onClick={onClearFilters}
        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
      >
        Clear All Search & Filters
      </Button>
    </div>
  );
};
