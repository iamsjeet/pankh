import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Clock,
} from 'lucide-react';
import { PlaybackSpeed, SimulationEvent } from '../types/simulation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export interface PlaybackControlBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTimestamp: number;
  totalDuration: number;
  onSeek: (seconds: number) => void;
  playbackSpeed: PlaybackSpeed;
  onChangeSpeed: (speed: PlaybackSpeed) => void;
  onRestart: () => void;
  events: SimulationEvent[];
  checkpointTimestamp?: number;
  className?: string;
}

export const PlaybackControlBar: React.FC<PlaybackControlBarProps> = ({
  isPlaying,
  onTogglePlay,
  currentTimestamp,
  totalDuration,
  onSeek,
  playbackSpeed,
  onChangeSpeed,
  onRestart,
  events,
  checkpointTimestamp,
  className,
}) => {
  const speeds: PlaybackSpeed[] = [0.5, 1, 2, 4];

  const formatSeconds = (sec: number) => {
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const remS = s % 60;
    return `T+${m < 10 ? '0' + m : m}:${remS < 10 ? '0' + remS : remS}`;
  };

  return (
    <div
      className={cn(
        'p-3.5 rounded-panel panel-surface border border-navy-700/80 flex flex-col md:flex-row items-center gap-3.5 select-none font-mono text-xs',
        className
      )}
    >
      {/* Play / Pause & Restart Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant={isPlaying ? 'warning' : 'primary'}
          size="sm"
          onClick={onTogglePlay}
          leftIcon={
            isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-navy-950" />
            ) : (
              <Play className="w-3.5 h-3.5 text-navy-950" />
            )
          }
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>

        <button
          type="button"
          onClick={onRestart}
          className="p-2 rounded-panel bg-navy-900 border border-navy-700 text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          title="Restart scenario from T+00:00"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrub Bar & Timeline Progress */}
      <div className="flex-1 w-full space-y-1">
        {/* Timestamp Readout */}
        <div className="flex items-center justify-between text-2xs font-telemetry text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{formatSeconds(currentTimestamp)}</span>
          </div>

          <div>
            <span>Duration: {formatSeconds(totalDuration)}</span>
          </div>
        </div>

        {/* Interactive Scrub Bar with Event Markers */}
        <div className="relative flex items-center group py-1 cursor-pointer">
          <input
            type="range"
            min={0}
            max={totalDuration || 90}
            step={0.5}
            value={currentTimestamp}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-navy-800 rounded-full appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />

          {/* Checkpoint Marker on Scrub Bar */}
          {checkpointTimestamp !== undefined && (
            <div
              style={{ left: `${(checkpointTimestamp / totalDuration) * 100}%` }}
              className="absolute -top-1 w-2.5 h-3.5 -translate-x-1/2 pointer-events-none flex flex-col items-center"
              title={`Decision Checkpoint at ${formatSeconds(checkpointTimestamp)}`}
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 border border-amber-300 shadow-glow-amber animate-pulse" />
            </div>
          )}

          {/* Event Flags on Scrub Bar */}
          {events.map((evt) => (
            <div
              key={evt.id}
              style={{ left: `${(evt.timestamp / totalDuration) * 100}%` }}
              className="absolute -top-0.5 w-1 h-2 -translate-x-1/2 bg-cyan-500/50 rounded-full pointer-events-none"
              title={`${evt.timestampFormatted}: ${evt.title}`}
            />
          ))}
        </div>
      </div>

      {/* Playback Speed Selector */}
      <div className="flex items-center gap-1 shrink-0 p-1 rounded bg-navy-900 border border-navy-800">
        <FastForward className="w-3 h-3 text-slate-500 mx-1" />
        {speeds.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChangeSpeed(s)}
            className={cn(
              'px-2 py-0.5 rounded text-2xs font-telemetry transition-colors',
              playbackSpeed === s
                ? 'bg-cyan-500 text-navy-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            )}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
