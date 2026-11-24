import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import {
  IncidentTimelineEvent,
  TimelineEventCategory,
} from '@/features/incidents/types/incident';
import { ProvenanceBadge } from '@/features/incidents/components/ProvenanceBadge';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export interface IncidentTimelineProps {
  events: IncidentTimelineEvent[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ events }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(events.slice(0, 2).map((e) => e.id)) // Expand first two by default
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(events.map((e) => e.id)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const categories: TimelineEventCategory[] = Array.from(
    new Set(events.map((e) => e.category))
  );

  const filteredEvents =
    selectedCategory === 'ALL'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const getCategoryBadgeClass = (category: TimelineEventCategory) => {
    switch (category) {
      case 'ATC_COMMUNICATION':
        return 'text-aviation-300 bg-aviation-950/60 border-aviation-500/30';
      case 'FLIGHT_CREW_ACTION':
        return 'text-amber-300 bg-amber-950/60 border-amber-500/30';
      case 'SYSTEM_ALERT':
        return 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30';
      case 'COLLISION_EVENT':
        return 'text-crimson-300 bg-crimson-950/60 border-crimson-500/40';
      default:
        return 'text-slate-300 bg-navy-900 border-navy-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Timeline Controls Header */}
      <div className="p-4 rounded-panel panel-surface border border-navy-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-semibold text-white tracking-wide">
              Reconstructed Sequence of Events
            </h3>
            <Badge variant="mono" size="sm">
              {filteredEvents.length} Events Recorded
            </Badge>
          </div>
          <p className="text-2xs font-mono text-slate-400 mt-0.5">
            Chronological reconstruction derived from CVR, FDR, and ATC radar recordings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={cn(
                'px-2 py-1 rounded text-2xs font-mono transition-colors select-none',
                selectedCategory === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                  : 'bg-navy-900 text-slate-400 border border-navy-800 hover:text-slate-200'
              )}
            >
              All ({events.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-2 py-1 rounded text-2xs font-mono transition-colors select-none whitespace-nowrap',
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                    : 'bg-navy-900 text-slate-400 border border-navy-800 hover:text-slate-200'
                )}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Expand / Collapse All */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-navy-800">
            <Button variant="ghost" size="xs" onClick={handleExpandAll}>
              Expand All
            </Button>
            <Button variant="ghost" size="xs" onClick={handleCollapseAll}>
              Collapse All
            </Button>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Tree */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-px before:bg-navy-700/80">
        {filteredEvents.map((evt) => {
          const isExpanded = expandedIds.has(evt.id);

          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Node Bullet */}
              <div
                className={cn(
                  'absolute -left-6 sm:-left-8 top-3.5 w-2.5 h-2.5 rounded-full border transition-all duration-150',
                  evt.category === 'COLLISION_EVENT'
                    ? 'bg-crimson-500 border-crimson-400 shadow-glow-crimson'
                    : isExpanded
                    ? 'bg-cyan-400 border-cyan-300 shadow-glow-cyan-sm'
                    : 'bg-navy-800 border-navy-600 group-hover:border-cyan-400'
                )}
              />

              {/* Event Card Container */}
              <div
                className={cn(
                  'rounded-panel panel-surface border transition-all duration-200 overflow-hidden',
                  isExpanded
                    ? 'border-cyan-500/40 bg-navy-850/90'
                    : 'border-navy-700/70 hover:border-navy-600/90 bg-navy-900/60'
                )}
              >
                {/* Clickable Header Bar */}
                <div
                  onClick={() => toggleExpand(evt.id)}
                  className="px-4 py-3 flex items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
                    {/* Timestamp */}
                    <div className="flex items-center gap-1.5 font-telemetry text-xs font-semibold text-cyan-400 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{evt.timestamp || 'Timestamp Not Available'}</span>
                    </div>

                    {/* Title */}
                    <span className="font-heading font-semibold text-sm text-white truncate">
                      {evt.title}
                    </span>

                    {/* Aircraft Involved Tag */}
                    {evt.aircraftInvolved && (
                      <span className="text-2xs font-mono text-slate-300 bg-navy-900 border border-navy-700 px-1.5 py-0.5 rounded shrink-0">
                        {evt.aircraftInvolved}
                      </span>
                    )}
                  </div>

                  {/* Badges & Chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        'hidden md:inline-flex px-1.5 py-0.5 rounded text-2xs font-mono border uppercase tracking-wider',
                        getCategoryBadgeClass(evt.category)
                      )}
                    >
                      {evt.category.replace('_', ' ')}
                    </span>

                    <ProvenanceBadge provenance={evt.provenance} size="sm" />

                    <div className="p-1 rounded text-slate-400 group-hover:text-slate-200">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="px-4 pb-4 pt-1 border-t border-navy-800/80 space-y-3 text-xs"
                    >
                      <p className="text-slate-200 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Flight Parameters Readout if available */}
                      {evt.flightParameters && (
                        <div className="p-2.5 rounded bg-navy-950/80 border border-navy-800 grid grid-cols-2 sm:grid-cols-4 gap-2 font-telemetry text-2xs">
                          {evt.flightParameters.altitude && (
                            <div>
                              <span className="text-slate-500 block">Altitude:</span>
                              <strong className="text-cyan-300">
                                {evt.flightParameters.altitude}
                              </strong>
                            </div>
                          )}
                          {evt.flightParameters.airspeed && (
                            <div>
                              <span className="text-slate-500 block">Airspeed:</span>
                              <strong className="text-slate-200">
                                {evt.flightParameters.airspeed}
                              </strong>
                            </div>
                          )}
                          {evt.flightParameters.heading && (
                            <div>
                              <span className="text-slate-500 block">Heading:</span>
                              <strong className="text-slate-200">
                                {evt.flightParameters.heading}
                              </strong>
                            </div>
                          )}
                          {evt.flightParameters.verticalSpeed && (
                            <div>
                              <span className="text-slate-500 block">Vertical Speed:</span>
                              <strong className="text-amber-400">
                                {evt.flightParameters.verticalSpeed}
                              </strong>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Source Citation */}
                      {evt.sourceReference && (
                        <div className="flex items-center justify-between text-2xs font-mono text-slate-400 pt-1">
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3 h-3 text-slate-500" />
                            Official Citation: <strong>{evt.sourceReference.document}</strong>
                            {evt.sourceReference.section && ` (${evt.sourceReference.section})`}
                            {evt.sourceReference.page && `, p. ${evt.sourceReference.page}`}
                          </span>
                          <span className="text-slate-500">{evt.sourceReference.agency}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
