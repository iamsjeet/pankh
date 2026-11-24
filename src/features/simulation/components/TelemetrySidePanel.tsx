import React from 'react';
import {
  Plane,
  Compass,
  Gauge,
  Layers,
  Activity,
  Clock,
} from 'lucide-react';
import {
  AircraftTelemetry,
  PlaybackFrame,
  SimulationEvent,
} from '../types/simulation';
import { Badge } from '@/components/ui/Badge';
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
  const selectedAircraft: AircraftTelemetry | undefined =
    currentFrame?.aircraft[selectedAircraftId];

  return (
    <div
      className={cn(
        'rounded-panel panel-surface border border-navy-700/80 p-4 flex flex-col justify-between space-y-4 text-xs font-mono select-none overflow-y-auto',
        className
      )}
    >
      <div className="space-y-4">
        {/* Panel Header & Aircraft Selector */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-navy-800">
            <span className="font-heading font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-cyan-400" />
              Live Telemetry Stream
            </span>
            <Badge variant="mono" size="sm">
              60 HZ
            </Badge>
          </div>

          {/* Aircraft Tabs */}
          <div className="flex items-center gap-1.5 pt-2">
            {aircraftList.map((ac) => {
              const isSelected = ac.id === selectedAircraftId;
              return (
                <button
                  key={ac.id}
                  type="button"
                  onClick={() => onSelectAircraft(ac.id)}
                  className={cn(
                    'flex-1 py-1 px-2 rounded text-2xs transition-all border truncate',
                    isSelected
                      ? 'bg-navy-800 text-cyan-300 border-cyan-500/40 font-bold shadow-glow-cyan-sm'
                      : 'bg-navy-900 text-slate-400 border-navy-800 hover:text-slate-200'
                  )}
                >
                  {ac.callsign}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Aircraft Telemetry Readouts */}
        {selectedAircraft ? (
          <div className="space-y-2.5">
            {/* Callout Header */}
            <div className="p-2.5 rounded bg-navy-900 border border-navy-800 flex items-center justify-between">
              <div>
                <strong className="text-white block font-heading text-sm">
                  {selectedAircraft.callsign}
                </strong>
                <span className="text-2xs text-slate-400">{selectedAircraft.type}</span>
              </div>
              <Badge
                variant={
                  selectedAircraft.status === 'TCAS_RA_CLIMB'
                    ? 'active'
                    : selectedAircraft.status === 'TCAS_RA_DESCEND'
                    ? 'warning'
                    : selectedAircraft.status === 'IMPACT'
                    ? 'critical'
                    : selectedAircraft.status === 'SAFE'
                    ? 'nominal'
                    : 'default'
                }
                size="sm"
                dot
              >
                {selectedAircraft.status.replace(/_/g, ' ')}
              </Badge>
            </div>

            {/* Metrics 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2 text-2xs">
              {/* Altitude */}
              <div className="p-2 rounded bg-navy-900/60 border border-navy-800">
                <span className="text-slate-500 flex items-center gap-1 mb-0.5">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  ALTITUDE
                </span>
                <strong className="text-white font-telemetry text-xs">
                  {selectedAircraft.altitudeFormatted}
                </strong>
                <div className="text-2xs text-slate-400 font-telemetry">
                  {selectedAircraft.altitude.toLocaleString()} FT
                </div>
              </div>

              {/* Airspeed */}
              <div className="p-2 rounded bg-navy-900/60 border border-navy-800">
                <span className="text-slate-500 flex items-center gap-1 mb-0.5">
                  <Gauge className="w-3 h-3 text-amber-400" />
                  AIRSPEED
                </span>
                <strong className="text-white font-telemetry text-xs">
                  {selectedAircraft.speed} KT
                </strong>
                <div className="text-2xs text-slate-400 font-telemetry">
                  TAS ~ Mach {(selectedAircraft.speed / 580).toFixed(2)}
                </div>
              </div>

              {/* Heading */}
              <div className="p-2 rounded bg-navy-900/60 border border-navy-800">
                <span className="text-slate-500 flex items-center gap-1 mb-0.5">
                  <Compass className="w-3 h-3 text-aviation-400" />
                  HEADING
                </span>
                <strong className="text-white font-telemetry text-xs">
                  {selectedAircraft.heading}°
                </strong>
                <div className="text-2xs text-slate-400 font-telemetry">
                  TRACK VECTOR
                </div>
              </div>

              {/* Vertical Speed */}
              <div className="p-2 rounded bg-navy-900/60 border border-navy-800">
                <span className="text-slate-500 flex items-center gap-1 mb-0.5">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  V-SPEED
                </span>
                <strong
                  className={cn(
                    'font-telemetry text-xs',
                    selectedAircraft.verticalSpeed > 0
                      ? 'text-cyan-300'
                      : selectedAircraft.verticalSpeed < 0
                      ? 'text-amber-400'
                      : 'text-white'
                  )}
                >
                  {selectedAircraft.verticalSpeedFormatted ||
                    `${selectedAircraft.verticalSpeed > 0 ? '+' : ''}${selectedAircraft.verticalSpeed} FPM`}
                </strong>
                <div className="text-2xs text-slate-400 font-telemetry">
                  RATE OF CLIMB
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-slate-500">
            No aircraft telemetry active in this frame.
          </div>
        )}

        {/* Global Separation Gauge */}
        {currentFrame && currentFrame.separationDistanceNM !== undefined && (
          <div className="p-2.5 rounded bg-navy-950 border border-navy-800 space-y-1.5">
            <div className="flex items-center justify-between text-2xs">
              <span className="text-slate-400">Lateral Separation:</span>
              <strong
                className={cn(
                  'font-telemetry',
                  currentFrame.separationDistanceNM < 2.0
                    ? 'text-crimson-400'
                    : currentFrame.separationDistanceNM < 5.0
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                )}
              >
                {currentFrame.separationDistanceNM} NM
              </strong>
            </div>

            {currentFrame.verticalSeparationFT !== undefined && (
              <div className="flex items-center justify-between text-2xs">
                <span className="text-slate-400">Vertical Separation:</span>
                <strong
                  className={cn(
                    'font-telemetry',
                    currentFrame.verticalSeparationFT < 500
                      ? 'text-crimson-400'
                      : currentFrame.verticalSeparationFT < 1000
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  )}
                >
                  {currentFrame.verticalSeparationFT} FT
                </strong>
              </div>
            )}
          </div>
        )}

        {/* Live Simulation Event Feed */}
        <div className="space-y-1.5">
          <div className="text-2xs uppercase text-slate-500 font-bold flex items-center justify-between">
            <span>Chronological Events ({accumulatedEvents.length})</span>
            <Clock className="w-3 h-3 text-slate-500" />
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {accumulatedEvents.length === 0 ? (
              <span className="text-2xs text-slate-600">Awaiting initial radar triggers...</span>
            ) : (
              [...accumulatedEvents].reverse().map((evt) => (
                <div
                  key={evt.id}
                  className="p-2 rounded bg-navy-900/80 border border-navy-800 text-2xs space-y-0.5"
                >
                  <div className="flex items-center justify-between text-cyan-400 font-telemetry">
                    <span>{evt.timestampFormatted}</span>
                    <span className="text-slate-500 text-2xs">{evt.category}</span>
                  </div>
                  <strong className="text-white block font-medium leading-snug">
                    {evt.title}
                  </strong>
                  <p className="text-slate-400 text-2xs leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Synthetic Data Disclaimer Footer */}
      <div className="pt-2 border-t border-navy-800 text-2xs text-slate-500 text-center">
        ILLUSTRATIVE SIMULATION TELEMETRY • NON-OPERATIONAL
      </div>
    </div>
  );
};
