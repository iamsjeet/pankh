import React, { useMemo } from 'react';
import {
  PlaybackFrame,
  ReferencePoint,
  AircraftTelemetry,
} from '../types/simulation';
import { cn } from '@/utils/cn';

export interface AirspaceCanvas2DProps {
  currentFrame: PlaybackFrame | null;
  referencePoints: ReferencePoint[];
  selectedAircraftId: string;
  onSelectAircraft: (id: string) => void;
  className?: string;
}

export const AirspaceCanvas2D: React.FC<AirspaceCanvas2DProps> = ({
  currentFrame,
  referencePoints,
  selectedAircraftId,
  onSelectAircraft,
  className,
}) => {
  const aircraftList: AircraftTelemetry[] = useMemo(() => {
    if (!currentFrame || !currentFrame.aircraft) return [];
    return Object.values(currentFrame.aircraft);
  }, [currentFrame]);

  // Compute distance line coordinates between primary conflicting aircraft if 2 exist
  const conflictLine = useMemo(() => {
    if (aircraftList.length < 2) return null;
    const a = aircraftList[0];
    const b = aircraftList[1];
    return {
      x1: `${a.position.x}%`,
      y1: `${a.position.y}%`,
      x2: `${b.position.x}%`,
      y2: `${b.position.y}%`,
      distNM: currentFrame?.separationDistanceNM,
      vertFT: currentFrame?.verticalSeparationFT,
      midX: `${(a.position.x + b.position.x) / 2}%`,
      midY: `${(a.position.y + b.position.y) / 2}%`,
    };
  }, [aircraftList, currentFrame]);

  const getStatusColor = (status: AircraftTelemetry['status']) => {
    switch (status) {
      case 'TCAS_RA_CLIMB':
        return '#C8F169'; // Electric lime
      case 'TCAS_RA_DESCEND':
        return '#FBBF24'; // Amber
      case 'TCAS_TA':
        return '#F59E0B'; // Warning amber
      case 'IMPACT':
        return '#EF4444'; // Signal red
      case 'SAFE':
        return '#34D399'; // Emerald safe
      case 'CONFLICT':
        return '#DC2626'; // Red conflict
      default:
        return '#F3F1EB'; // Bone white
    }
  };

  return (
    <div
      className={cn(
        'relative w-full h-full min-h-[420px] rounded-panel bg-obsidian-950 border border-white/10 overflow-hidden select-none bg-dark-grid',
        className
      )}
    >
      {/* SVG Airspace Layer */}
      <svg className="w-full h-full absolute inset-0 pointer-events-none">
        <defs>
          <radialGradient id="radarRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8F169" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#C8F169" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central Range Circles */}
        <circle cx="50%" cy="50%" r="42%" fill="url(#radarRadial)" stroke="rgba(243, 241, 235, 0.1)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50%" cy="50%" r="28%" fill="none" stroke="rgba(243, 241, 235, 0.14)" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="50%" cy="50%" r="14%" fill="none" stroke="rgba(200, 241, 105, 0.22)" strokeWidth="1" />

        {/* Sector Crosshairs */}
        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />

        {/* Reference Waypoints */}
        {referencePoints.map((pt) => (
          <g key={pt.id} transform={`translate(${pt.position.x * 8}, ${pt.position.y * 5})`}>
            {pt.type === 'CONFLICT_POINT' ? (
              <polygon
                points="0,-6 6,0 0,6 -6,0"
                fill="none"
                stroke="rgba(239, 68, 68, 0.6)"
                strokeWidth="1.5"
              />
            ) : (
              <polygon
                points="0,-4 4,4 -4,4"
                fill="none"
                stroke="rgba(148, 163, 184, 0.5)"
                strokeWidth="1"
              />
            )}
          </g>
        ))}

        {/* Dynamic Distance Vector Line between converging aircraft */}
        {conflictLine && (
          <g>
            <line
              x1={conflictLine.x1}
              y1={conflictLine.y1}
              x2={conflictLine.x2}
              y2={conflictLine.y2}
              stroke={
                conflictLine.distNM !== undefined && conflictLine.distNM < 2
                  ? '#ef4444'
                  : 'rgba(0, 240, 255, 0.4)'
              }
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </g>
        )}
      </svg>

      {/* Reference Points Labels */}
      {referencePoints.map((pt) => (
        <div
          key={pt.id}
          style={{ left: `${pt.position.x}%`, top: `${pt.position.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center"
        >
          <div
            className={cn(
              'w-2 h-2 rotate-45 border mb-1',
              pt.type === 'CONFLICT_POINT'
                ? 'border-crimson-500 bg-crimson-950/60'
                : 'border-slate-500 bg-navy-900'
            )}
          />
          <span className="font-mono text-2xs text-slate-500 uppercase tracking-widest bg-navy-950/80 px-1 rounded">
            {pt.name}
          </span>
        </div>
      ))}

      {/* Separation Distance Label on Midpoint */}
      {conflictLine && conflictLine.distNM !== undefined && (
        <div
          style={{ left: conflictLine.midX, top: conflictLine.midY }}
          className="absolute -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-navy-900/95 border border-navy-700 font-telemetry text-2xs pointer-events-none z-10 shadow"
        >
          <span
            className={cn(
              'font-bold',
              conflictLine.distNM < 2.0 ? 'text-crimson-400' : 'text-cyan-300'
            )}
          >
            {conflictLine.distNM} NM
          </span>
          {conflictLine.vertFT !== undefined && (
            <span className="text-slate-400 ml-1">
              (Δ {Math.abs(conflictLine.vertFT)} FT)
            </span>
          )}
        </div>
      )}

      {/* Aircraft Markers */}
      {aircraftList.map((ac) => {
        const isSelected = ac.id === selectedAircraftId;
        const color = getStatusColor(ac.status);

        return (
          <div
            key={ac.id}
            onClick={() => onSelectAircraft(ac.id)}
            style={{ left: `${ac.position.x}%`, top: `${ac.position.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-all duration-150"
          >
            {/* Target Ring & Selection Halo */}
            <div
              className={cn(
                'relative flex items-center justify-center w-8 h-8 rounded-full transition-transform',
                isSelected && 'scale-110'
              )}
            >
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-full border border-dashed animate-spin pointer-events-none"
                  style={{ borderColor: color, animationDuration: '8s' }}
                />
              )}

              {/* Directional Chevron / Arrow */}
              <div
                style={{ transform: `rotate(${ac.heading}deg)` }}
                className="transition-transform duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
                  <path d="M12 2L19 21L12 17L5 21L12 2Z" />
                </svg>
              </div>
            </div>

            {/* Aircraft Flight Data Block / Label */}
            <div
              className={cn(
                'absolute left-7 -top-2.5 px-2 py-1 rounded bg-navy-900/95 border text-2xs font-telemetry whitespace-nowrap shadow-panel pointer-events-none transition-all',
                isSelected
                  ? 'border-cyan-400 text-white shadow-glow-cyan-sm'
                  : 'border-navy-700/80 text-slate-300 group-hover:border-slate-500'
              )}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span style={{ color }}>{ac.callsign}</span>
                <span className="text-slate-500 font-normal">({ac.type})</span>
              </div>
              <div className="text-2xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <strong className="text-white">{ac.altitudeFormatted}</strong>
                <span>•</span>
                <span>{ac.speed} KT</span>
                <span>•</span>
                <span>HDG {ac.heading}°</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Airspace Overlay Compass Rose Indicator */}
      <div className="absolute top-3 left-3 p-2 rounded bg-navy-900/80 border border-navy-800 text-2xs font-mono text-slate-500 pointer-events-none">
        <div>SECTOR: VIDF / EDGG CROSSING</div>
        <div className="text-slate-400">SCALE: 1:250 NM • 2D ORTHOGRAPHIC</div>
      </div>

      {/* Top Banner Status Notification */}
      {currentFrame?.activeAlert && (
        <div className="absolute top-3 right-3 px-3 py-1 rounded-panel bg-navy-900/90 border border-cyan-500/50 text-2xs font-mono text-cyan-300 shadow-glow-cyan-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{currentFrame.activeAlert}</span>
        </div>
      )}
    </div>
  );
};
