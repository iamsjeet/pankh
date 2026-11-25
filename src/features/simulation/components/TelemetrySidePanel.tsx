import React, { useState } from 'react';
import {
  Plane,
  Compass,
  Gauge,
  Layers,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AircraftTelemetry, PlaybackFrame, SimulationEvent } from '../types/simulation';
import { cn } from '@/utils/cn';

export interface TelemetrySidePanelProps {
  currentFrame: PlaybackFrame | null;
  selectedAircraftId: string;
  aircraftList: { id: string; callsign: string; type: string; operator: string }[];
  onSelectAircraft: (id: string) => void;
  accumulatedEvents: SimulationEvent[];
  className?: string;
}

export const TelemetrySidePanel: React.FC<TelemetrySidePanelProps> = ({
  currentFrame,
  selectedAircraftId,
  aircraftList,
  onSelectAircraft,
  accumulatedEvents,
  className,
}) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const selectedAircraft: AircraftTelemetry | undefined =
    currentFrame?.aircraft[selectedAircraftId];

  const latSep = currentFrame?.separationDistanceNM;
  const vertSep = currentFrame?.verticalSeparationFT;

  const latStatus =
    latSep === undefined
      ? { label: 'STANDBY', color: 'text-stone-400', icon: Clock }
      : latSep < 2.0
      ? { label: 'CRITICAL', color: 'text-crimson-400', icon: ShieldAlert }
      : latSep < 5.0
      ? { label: 'CAUTION', color: 'text-amber-400', icon: AlertTriangle }
      : { label: 'NOMINAL', color: 'text-[#A8C96D]', icon: CheckCircle2 };

  const vertStatus =
    vertSep === undefined
      ? { label: 'STANDBY', color: 'text-stone-400' }
      : vertSep < 500
      ? { label: 'CRITICAL', color: 'text-crimson-400' }
      : vertSep < 1000
      ? { label: 'CAUTION', color: 'text-amber-400' }
      : { label: 'NOMINAL', color: 'text-[#A8C96D]' };

  const LatIcon = latStatus.icon;

  return (
    <aside
      className={cn(
        'bg-obsidian-950 text-sand-50 flex flex-col justify-between select-none overflow-y-auto',
        className
      )}
    >
      <div className="divide-y divide-white/10">
        {/* 1. Instrumentation Header & Aircraft Switcher */}
        <div className="p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2">
              <Plane className="w-3.5 h-3.5 text-[#88B04B]" />
              Live Telemetry
            </span>
            <span className="text-2xs font-mono text-stone-500">DETERMINISTIC</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-panel bg-obsidian-850 border border-white/10">
            {aircraftList.map((ac) => {
              const isSelected = ac.id === selectedAircraftId;
              return (
                <button
                  key={ac.id}
                  type="button"
                  onClick={() => onSelectAircraft(ac.id)}
                  className={cn(
                    'py-2 px-3 rounded-subtle text-xs font-mono transition-all text-left flex flex-col',
                    isSelected
                      ? 'bg-[#88B04B] text-obsidian-950 font-bold shadow-sm'
                      : 'text-stone-400 hover:text-sand-50 hover:bg-white/5'
                  )}
                >
                  <span className="truncate">{ac.callsign}</span>
                  <span
                    className={cn(
                      'text-[10px] truncate',
                      isSelected ? 'text-obsidian-950/75 font-medium' : 'text-stone-500'
                    )}
                  >
                    {ac.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Selected Aircraft Instrumentation Readouts */}
        {selectedAircraft ? (
          <div className="p-5 space-y-4">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <h3 className="font-heading text-xl font-bold text-sand-50 tracking-tight">
                  {selectedAircraft.callsign}
                </h3>
                <span className="text-2xs font-mono text-stone-400">{selectedAircraft.type}</span>
              </div>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-subtle text-[10px] font-mono font-semibold uppercase tracking-wider border',
                  selectedAircraft.status === 'TCAS_RA_CLIMB' || selectedAircraft.status === 'SAFE'
                    ? 'bg-[#88B04B]/15 text-[#A8C96D] border-[#88B04B]/40'
                    : selectedAircraft.status === 'IMPACT' || selectedAircraft.status === 'CONFLICT'
                    ? 'bg-crimson-950 text-crimson-300 border-crimson-500/40'
                    : selectedAircraft.status === 'TCAS_RA_DESCEND' || selectedAircraft.status === 'TCAS_TA'
                    ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                    : 'bg-obsidian-850 text-stone-300 border-white/15'
                )}
              >
                {selectedAircraft.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Clean Divider-Separated Telemetry Grid (No Repetitive Boxes) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#88B04B]" /> Altitude
                </span>
                <div className="font-heading text-2xl font-bold text-sand-50 font-telemetry mt-0.5">
                  {selectedAircraft.altitudeFormatted}
                </div>
                <span className="text-[11px] font-mono text-stone-400 font-telemetry">
                  {selectedAircraft.altitude.toLocaleString()} FT
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-stone-400" /> Airspeed
                </span>
                <div className="font-heading text-2xl font-bold text-sand-50 font-telemetry mt-0.5">
                  {selectedAircraft.speed} <span className="text-xs font-mono text-stone-400">KT</span>
                </div>
                <span className="text-[11px] font-mono text-stone-400 font-telemetry">
                  M {(selectedAircraft.speed / 580).toFixed(2)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-stone-400" /> Heading
                </span>
                <div className="font-heading text-2xl font-bold text-sand-50 font-telemetry mt-0.5">
                  {selectedAircraft.heading}°
                </div>
                <span className="text-[11px] font-mono text-stone-400">TRACK VECTOR</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-stone-400" /> V-Speed
                </span>
                <div
                  className={cn(
                    'font-heading text-2xl font-bold font-telemetry mt-0.5',
                    selectedAircraft.verticalSpeed > 0
                      ? 'text-[#A8C96D]'
                      : selectedAircraft.verticalSpeed < 0
                      ? 'text-amber-400'
                      : 'text-sand-50'
                  )}
                >
                  {selectedAircraft.verticalSpeed > 0 ? '+' : ''}
                  {selectedAircraft.verticalSpeed}
                </div>
                <span className="text-[11px] font-mono text-stone-400">FPM</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 text-xs font-mono text-stone-500">
            Awaiting telemetry frame...
          </div>
        )}

        {/* 3. Separation Monitors (Multi-cue: Icon + Label + Value) */}
        {currentFrame && latSep !== undefined && (
          <div className="p-5 space-y-2.5 bg-obsidian-850/45">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-stone-400 flex items-center gap-1.5">
                <LatIcon className={cn('w-3.5 h-3.5', latStatus.color)} />
                Lateral Separation
              </span>
              <div className="flex items-center gap-2 font-telemetry">
                <span className={cn('text-[10px] font-mono uppercase', latStatus.color)}>
                  {latStatus.label}
                </span>
                <strong className="text-sm text-sand-50">{latSep} NM</strong>
              </div>
            </div>

            {vertSep !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-stone-400 pl-5">Vertical Separation</span>
                <div className="flex items-center gap-2 font-telemetry">
                  <span className={cn('text-[10px] font-mono uppercase', vertStatus.color)}>
                    {vertStatus.label}
                  </span>
                  <strong className="text-sm text-sand-50">{vertSep} FT</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Technical Chronology (Expandable Time Axis) */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-2xs font-mono uppercase tracking-widest text-stone-400">
            <span>Chronology ({accumulatedEvents.length})</span>
            <Clock className="w-3.5 h-3.5 text-stone-500" />
          </div>

          {accumulatedEvents.length === 0 ? (
            <p className="text-xs font-mono text-stone-500">Awaiting initial sequence...</p>
          ) : (
            <div className="relative pl-4 space-y-3 before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-px before:bg-white/15">
              {[...accumulatedEvents].reverse().map((evt) => {
                const isOpen = expandedEventId === evt.id;
                return (
                  <div key={evt.id} className="relative">
                    <span className="absolute -left-[15px] top-1.5 w-2 h-2 rounded-full bg-[#88B04B]" />
                    <button
                      type="button"
                      onClick={() => setExpandedEventId(isOpen ? null : evt.id)}
                      className="w-full text-left group"
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-[#A8C96D]">
                        <span>{evt.timestampFormatted}</span>
                        <span className="text-stone-500 flex items-center gap-1">
                          {evt.category.replace(/_/g, ' ')}
                          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-sand-50 group-hover:text-[#A8C96D] transition-colors leading-snug mt-0.5">
                        {evt.title}
                      </div>
                      {isOpen && (
                        <p className="text-[11px] text-stone-400 leading-relaxed mt-1.5">
                          {evt.description}
                        </p>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-white/10 text-[10px] font-mono text-stone-500 tracking-wider uppercase">
        Illustrative Simulation Telemetry • Non-Operational
      </div>
    </aside>
  );
};
