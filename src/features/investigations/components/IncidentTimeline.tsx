import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
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
  onSelectEvent?: (event: IncidentTimelineEvent) => void;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ events, onSelectEvent }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(events.slice(0, 2).map((e) => e.id))
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories: TimelineEventCategory[] = Array.from(new Set(events.map((e) => e.category)));
  const filteredEvents =
    selectedCategory === 'ALL' ? events : events.filter((e) => e.category === selectedCategory);

  const getCategoryBadgeClass = (category: TimelineEventCategory) => {
    switch (category) {
      case 'ATC_COMMUNICATION':
        return 'text-obsidian-950 bg-sand-100 border-obsidian-950/15';
      case 'FLIGHT_CREW_ACTION':
        return 'text-amber-700 bg-amber-100/80 border-amber-600/25';
      case 'SYSTEM_ALERT':
        return 'text-obsidian-950 bg-lime-400/50 border-lime-600/30';
      case 'COLLISION_EVENT':
        return 'text-crimson-700 bg-crimson-100/80 border-crimson-600/30';
      default:
        return 'text-stone-600 bg-sand-100 border-obsidian-950/15';
    }
  };

  return (
    <div className="space-y-4">
      {/* Timeline Controls Header */}
      <div className="p-4 rounded-panel panel-surface flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-semibold text-obsidian-950">
              Reconstructed Sequence of Events
            </h3>
            <Badge variant="mono" size="sm">
              {filteredEvents.length} Events
            </Badge>
          </div>
          <p className="text-2xs font-mono text-stone-500 mt-0.5">
            Chronological reconstruction derived from CVR, FDR, and ATC radar recordings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={cn(
                'px-2.5 py-1 rounded-subtle text-2xs font-mono transition-colors select-none border',
                selectedCategory === 'ALL'
                  ? 'bg-obsidian-950 text-lime-400 border-obsidian-950 font-medium'
                  : 'bg-sand-100 text-stone-600 border-obsidian-950/10 hover:text-obsidian-950'
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
                  'px-2.5 py-1 rounded-subtle text-2xs font-mono transition-colors select-none whitespace-nowrap border',
                  selectedCategory === cat
                    ? 'bg-obsidian-950 text-lime-400 border-obsidian-950 font-medium'
                    : 'bg-sand-100 text-stone-600 border-obsidian-950/10 hover:text-obsidian-950'
                )}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border-l border-obsidian-950/15 pl-2">
            <Button variant="ghost" size="xs" onClick={() => setExpandedIds(new Set(events.map((e) => e.id)))}>
              Expand All
            </Button>
            <Button variant="ghost" size="xs" onClick={() => setExpandedIds(new Set())}>
              Collapse
            </Button>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-3 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-px before:bg-obsidian-950/15">
        {filteredEvents.map((event) => {
          const isExpanded = expandedIds.has(event.id);
          const isCritical = event.category === 'COLLISION_EVENT' || event.category === 'SYSTEM_ALERT';

          return (
            <div key={event.id} className="relative">
              {/* Timeline Node Marker */}
              <div
                className={cn(
                  'absolute -left-6 sm:-left-8 top-5 w-3 h-3 rounded-full border-2 border-sand-50 z-10',
                  event.category === 'COLLISION_EVENT'
                    ? 'bg-crimson-500'
                    : isCritical
                    ? 'bg-lime-500'
                    : 'bg-obsidian-950'
                )}
              />

              <div className="rounded-panel panel-surface overflow-hidden hover:border-obsidian-950/25 transition-colors">
                <button
                  type="button"
                  onClick={() => {
                    toggleExpand(event.id);
                    onSelectEvent?.(event);
                  }}
                  className="w-full p-4 flex items-start justify-between gap-3 text-left"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-obsidian-950 bg-sand-100 px-2 py-0.5 rounded-subtle border border-obsidian-950/10">
                        <Clock className="w-3 h-3 text-stone-500" />
                        {event.timestamp}
                      </span>

                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-subtle border text-2xs font-mono uppercase',
                          getCategoryBadgeClass(event.category)
                        )}
                      >
                        {event.category.replace(/_/g, ' ')}
                      </span>

                      <ProvenanceBadge provenance={event.provenance} size="sm" />

                      {event.aircraftInvolved && (
                        <span className="text-2xs font-mono text-stone-500">
                          [{event.aircraftInvolved}]
                        </span>
                      )}
                    </div>

                    <h4 className="font-heading font-semibold text-sm text-obsidian-950 leading-snug">
                      {event.title}
                    </h4>
                  </div>

                  <span className="p-1 text-stone-500 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-obsidian-950/10 space-y-3 text-xs">
                        <p className="text-stone-600 leading-relaxed pt-2">{event.description}</p>

                        {event.flightParameters && (
                          <div className="flex flex-wrap gap-3 p-2.5 rounded-subtle bg-sand-100/70 border border-obsidian-950/10 font-mono text-2xs text-obsidian-950">
                            {event.flightParameters.altitude && (
                              <span>ALT: <strong>{event.flightParameters.altitude}</strong></span>
                            )}
                            {event.flightParameters.airspeed && (
                              <span>IAS/TAS: <strong>{event.flightParameters.airspeed}</strong></span>
                            )}
                            {event.flightParameters.heading && (
                              <span>HDG: <strong>{event.flightParameters.heading}</strong></span>
                            )}
                            {event.flightParameters.verticalSpeed && (
                              <span>V/S: <strong>{event.flightParameters.verticalSpeed}</strong></span>
                            )}
                          </div>
                        )}

                        {event.sourceReference && (
                          <div className="flex items-center justify-between gap-2 text-2xs font-mono text-stone-500 pt-1">
                            <span className="inline-flex items-center gap-1.5">
                              <FileText className="w-3 h-3" />
                              {event.sourceReference.document}
                              {event.sourceReference.section ? ` • ${event.sourceReference.section}` : ''}
                              {event.sourceReference.page ? ` (p. ${event.sourceReference.page})` : ''}
                            </span>
                            {event.sourceReference.url && (
                              <a
                                href={event.sourceReference.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-obsidian-950 font-semibold hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" /> Source
                              </a>
                            )}
                          </div>
                        )}
                      </div>
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
