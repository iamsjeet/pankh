import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { simulationService } from '../services/simulationService';
import { useSimulationController } from '../hooks/useSimulationController';
import {
  AirspaceCanvas2D,
  TelemetrySidePanel,
  PlaybackControlBar,
  DecisionCheckpointModal,
  SimulationDebriefView,
  SimulationBriefingView,
} from '../components';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const SimulationExperiencePage: React.FC = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const navigate = useNavigate();

  const scenario = simulationService.getScenarioByIncidentIdSync(incidentId || '');

  const {
    status,
    currentTimestamp,
    totalDuration,
    playbackSpeed,
    currentFrame,
    activeCheckpoint,
    selectedOptionId,
    currentBranch,
    selectedAircraftId,
    accumulatedEvents,
    decisionRecords,
    attemptId,
    togglePlay,
    seek,
    setSpeed,
    selectDecision,
    restart,
    selectAircraft,
    startSimulation,
    goToDebrief,
    returnToSimulation,
  } = useSimulationController(scenario);

  // Fallback if scenario doesn't exist for this incident
  if (!scenario) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-navy-900/90 border border-navy-700/80 rounded-xl p-8 text-center space-y-4 shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-heading text-slate-100">
            Scenario In Production
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            The interactive playback scenario for incident <span className="font-mono text-cyan-400 font-semibold">{incidentId}</span> is currently undergoing flight parameter synthesis.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(`/app/investigations/${incidentId || ''}`)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Return to Dossier
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/app/simulation/HIST-2002-UBL')}
            >
              Open Überlingen Scenario
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!scenario) return null;

  // 1. Briefing Screen
  if (status === 'BRIEFING') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
        <SimulationBriefingView
          scenario={scenario}
          onStartSimulation={startSimulation}
          onExit={() => navigate(`/app/investigations/${scenario.incidentId}`)}
        />
      </div>
    );
  }

  // 2. Debrief & Outcome Analysis Screen
  if (status === 'DEBRIEF') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
        <SimulationDebriefView
          scenario={scenario}
          selectedBranch={currentBranch}
          selectedOptionId={selectedOptionId}
          decisionRecords={decisionRecords}
          events={accumulatedEvents}
          totalDuration={totalDuration}
          attemptId={attemptId}
          onRestart={restart}
          onReturnToPlayback={returnToSimulation}
          onExitToInvestigation={() => navigate(`/app/investigations/${scenario.incidentId}`)}
        />
      </div>
    );
  }

  // 3. Tactical Simulation Workbench View (PLAYING, PAUSED, CHECKPOINT_PAUSED, COMPLETED)
  const isCompleted = status === 'COMPLETED' || currentTimestamp >= totalDuration;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[100vh] overflow-hidden bg-navy-950">
      {/* Top Cockpit Header */}
      <div className="h-14 border-b border-navy-800 bg-navy-900/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/app/investigations/${scenario.incidentId}`)}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            className="text-slate-400 hover:text-slate-200"
          >
            Exit to Dossier
          </Button>

          <div className="h-4 w-px bg-navy-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-slate-200 tracking-wide">
              {scenario.title}
            </span>
            <Badge variant="accent" size="sm" className="font-mono text-2xs">
              {scenario.incidentId}
            </Badge>
            <span className="px-1.5 py-0.5 rounded text-3xs font-mono font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/30">
              ILLUSTRATIVE SIMULATION
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Active Branch Badge */}
          {currentBranch && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-800/80 border border-navy-700/80 text-2xs font-mono">
              <span className="text-slate-400">ACTIVE BRANCH:</span>
              <span className="text-cyan-300 font-semibold truncate max-w-[150px]">
                {currentBranch.title}
              </span>
            </div>
          )}

          {/* Status Badge */}
          {status === 'CHECKPOINT_PAUSED' ? (
            <span className="px-2.5 py-1 rounded text-2xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              DECISION CHECKPOINT
            </span>
          ) : isCompleted ? (
            <span className="px-2.5 py-1 rounded text-2xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
              SCENARIO COMPLETE
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded text-2xs font-mono font-bold bg-navy-800 text-slate-300 border border-navy-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              AIRSPACE ACTIVE
            </span>
          )}

          {/* Quick Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={restart}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Reset Simulation to Initial State"
          >
            Reset
          </Button>

          <Button
            variant={isCompleted ? 'primary' : 'outline'}
            size="sm"
            onClick={goToDebrief}
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            className={isCompleted ? 'shadow-glow-cyan' : ''}
          >
            Debrief Analysis
          </Button>
        </div>
      </div>

      {/* Main View Area: 2D Tactical Airspace + Telemetry Panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Airspace Canvas (fills available space) */}
        <div className="flex-1 relative bg-navy-950 overflow-hidden flex flex-col">
          <AirspaceCanvas2D
            currentFrame={currentFrame}
            referencePoints={scenario.referencePoints}
            selectedAircraftId={selectedAircraftId}
            onSelectAircraft={selectAircraft}
            className="w-full h-full"
          />

          {/* Simulation Completed Floating Banner */}
          {isCompleted && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-navy-900/95 border border-cyan-500/40 rounded-xl px-5 py-3 shadow-2xl backdrop-blur-md flex items-center gap-4 max-w-lg">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200">
                  Simulation Playback Completed
                </p>
                <p className="text-2xs text-slate-400 truncate">
                  {currentBranch?.title || 'Initial baseline sequence finished.'}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={goToDebrief}
                className="shrink-0"
              >
                Inspect Debrief
              </Button>
            </div>
          )}
        </div>

        {/* Live Telemetry and Event Stream Panel */}
        <TelemetrySidePanel
          currentFrame={currentFrame}
          selectedAircraftId={selectedAircraftId}
          aircraftList={scenario.aircraftList}
          onSelectAircraft={selectAircraft}
          accumulatedEvents={accumulatedEvents}
          className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-navy-800 shrink-0 h-72 lg:h-full"
        />
      </div>

      {/* Bottom Playback Scrubber & Control Bar */}
      <PlaybackControlBar
        isPlaying={status === 'PLAYING'}
        onTogglePlay={togglePlay}
        currentTimestamp={currentTimestamp}
        totalDuration={totalDuration}
        onSeek={seek}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={setSpeed}
        onRestart={restart}
        events={accumulatedEvents}
        checkpointTimestamp={scenario.checkpoints[0]?.timestamp}
        className="shrink-0"
      />

      {/* Decision Checkpoint Overlay Modal */}
      <DecisionCheckpointModal
        checkpoint={status === 'CHECKPOINT_PAUSED' ? activeCheckpoint : null}
        onSelectDecision={selectDecision}
      />
    </div>
  );
};
