import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock } from 'lucide-react';
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

  const progressPct = totalDuration > 0 ? Math.min(100, (currentTimestamp / totalDuration) * 100) : 0;

  return (
    <div
      className={cn(
        'px-5 py-3.5 bg-obsidian-850 border-t border-white/10 flex flex-col md:flex-row items-center gap-4 select-none font-mono text-xs text-sand-50',
        className
      )}
    >
      {/* Transport Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="primary"
          size="sm"
          onClick={onTogglePlay}
          leftIcon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          className={cn(
            'min-w-[92px] font-semibold',
            isPlaying
              ? 'bg-amber-500 text-obsidian-950 border-amber-500 hover:bg-amber-400'
              : 'bg-[#88B04B] text-obsidian-950 border-[#88B04B] hover:bg-[#769B3D]'
          )}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>

        <button
          type="button"
          onClick={onRestart}
          className="p-2 rounded-panel bg-obsidian-950 border border-white/15 text-stone-400 hover:text-sand-50 hover:border-white/30 transition-colors"
          title="Restart scenario from T+00:00"
          aria-label="Restart scenario"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Instrument Timeline Scrubber */}
      <div className="flex-1 w-full space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-telemetry">
          <div className="flex items-center gap-2 text-[#A8C96D] font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatSeconds(currentTimestamp)}</span>
          </div>
          <span className="text-stone-400">TOTAL {formatSeconds(totalDuration)}</span>
        </div>

        <div className="relative h-5 flex items-center cursor-pointer">
          <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-[#88B04B] transition-[width] duration-75"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={totalDuration || 90}
            step={0.5}
            value={currentTimestamp}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            aria-label="Simulation timeline scrubber"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {checkpointTimestamp !== undefined && totalDuration > 0 && (
            <div
              style={{ left: `${(checkpointTimestamp / totalDuration) * 100}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
              title={`Decision Checkpoint at ${formatSeconds(checkpointTimestamp)}`}
            >
              <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-obsidian-950 shadow-sm" />
            </div>
          )}
        </div>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-2 shrink-0">
        <FastForward className="w-3.5 h-3.5 text-stone-400" />
        <div className="flex items-center bg-obsidian-950 border border-white/10 rounded-panel p-0.5">
          {speeds.map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => onChangeSpeed(sp)}
              className={cn(
                'px-2.5 py-1 rounded-subtle text-[11px] transition-colors',
                playbackSpeed === sp
                  ? 'bg-[#88B04B] text-obsidian-950 font-bold'
                  : 'text-stone-400 hover:text-sand-50'
              )}
            >
              {sp}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
