import React, { useState, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, RotateCcw, CheckCircle2, AlertTriangle, Box, Map } from 'lucide-react';
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
import { useReducedMotion } from '@/animations/useReducedMotion';

const AirspaceCanvas3D = lazy(() =>
  import('../components/AirspaceCanvas3D').then((m) => ({ default: m.AirspaceCanvas3D }))
);

export const SimulationExperiencePage: React.FC = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(reducedMotion ? '2d' : '3d');
  const [previewBranchId, setPreviewBranchId] = useState<string | null>(null);

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

  if (!scenario) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full panel-surface rounded-card p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-600/30 flex items-center justify-center mx-auto text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-heading text-obsidian-950">
            Scenario Not Yet Available
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Interactive playback for <span className="font-mono text-obsidian-950 font-semibold">{incidentId}</span> is not included in this MVP. Launch one of the two complete branching scenarios below.
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

  if (status === 'BRIEFING') {
    return (
      <div className="p-2 sm:p-4 max-w-7xl mx-auto">
        <SimulationBriefingView
          scenario={scenario}
          onStartSimulation={startSimulation}
          onExit={() => navigate(`/app/investigations/${scenario.incidentId}`)}
        />
      </div>
    );
  }

  if (status === 'DEBRIEF') {
    return (
      <div className="p-2 sm:p-4 max-w-7xl mx-auto">
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

  const isCompleted = status !== 'CHECKPOINT_PAUSED' && (status === 'COMPLETED' || currentTimestamp >= totalDuration);

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] min-h-[580px] rounded-card overflow-hidden bg-obsidian-950 text-sand-50 border border-obsidian-800 shadow-editorial-dark">
      {/* Top Cockpit Header */}
      <div className="h-14 border-b border-white/10 bg-obsidian-850 px-4 flex items-center justify-between gap-2 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/app/investigations/${scenario.incidentId}`)}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            className="text-stone-400 hover:text-sand-50 hover:bg-white/10 shrink-0"
          >
            <span className="hidden sm:inline">Exit to Dossier</span>
          </Button>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-heading font-bold text-sm text-sand-50 truncate max-w-[240px] xl:max-w-xs">
              {scenario.title}
            </span>
            <Badge variant="accent" size="sm" className="hidden md:inline-flex shrink-0">
              {scenario.incidentId}
            </Badge>
            <span className="hidden xl:inline-block px-2 py-0.5 rounded-subtle text-2xs font-mono bg-amber-950/70 text-amber-300 border border-amber-500/30 shrink-0">
              {scenario.provenance}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentBranch && (
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-subtle bg-obsidian-950 border border-white/10 text-2xs font-mono">
              <span className="text-stone-400">BRANCH:</span>
              <span className="text-lime-400 font-semibold truncate max-w-[180px]">
                {currentBranch.title}
              </span>
            </div>
          )}

          {status === 'CHECKPOINT_PAUSED' ? (
            <span className="px-2.5 py-1 rounded-subtle text-2xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="hidden sm:inline">CHECKPOINT</span>
            </span>
          ) : isCompleted ? (
            <span className="px-2.5 py-1 rounded-subtle text-2xs font-mono font-bold bg-lime-950 text-lime-400 border border-lime-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">COMPLETE</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-subtle text-2xs font-mono font-bold bg-obsidian-950 text-sand-50 border border-white/15 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="hidden sm:inline">ACTIVE</span>
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode((v) => (v === '3d' ? '2d' : '3d'))}
            leftIcon={viewMode === '3d' ? <Map className="w-3.5 h-3.5" /> : <Box className="w-3.5 h-3.5" />}
            className="border-white/20 text-sand-50 hover:bg-white/10"
            title="Switch between 3D Airspace and 2D Tactical Radar"
          >
            <span className="hidden sm:inline">{viewMode === '3d' ? '2D View' : '3D View'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={restart}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="border-white/20 text-sand-50 hover:bg-white/10"
          >
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            variant={isCompleted ? 'accent' : 'outline'}
            size="sm"
            onClick={goToDebrief}
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            className={!isCompleted ? 'border-white/20 text-sand-50 hover:bg-white/10' : ''}
          >
            Debrief
          </Button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-1 relative bg-obsidian-950 overflow-hidden flex flex-col">
          {viewMode === '3d' ? (
            <Suspense
              fallback={
                <AirspaceCanvas2D
                  currentFrame={currentFrame}
                  referencePoints={scenario.referencePoints}
                  selectedAircraftId={selectedAircraftId}
                  onSelectAircraft={selectAircraft}
                  className="w-full h-full"
                />
              }
            >
              <AirspaceCanvas3D
                currentFrame={currentFrame}
                referencePoints={scenario.referencePoints}
                selectedAircraftId={selectedAircraftId}
                onSelectAircraft={selectAircraft}
                previewBranch={previewBranchId ? scenario.branches[previewBranchId] : null}
                className="w-full h-full"
              />
            </Suspense>
          ) : (
            <AirspaceCanvas2D
              currentFrame={currentFrame}
              referencePoints={scenario.referencePoints}
              selectedAircraftId={selectedAircraftId}
              onSelectAircraft={selectAircraft}
              className="w-full h-full"
            />
          )}

          {isCompleted && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-obsidian-850/95 border border-lime-400/50 rounded-card px-5 py-3 shadow-editorial-dark flex items-center gap-4 max-w-lg w-[92%] sm:w-auto">
              <div className="w-8 h-8 rounded-panel bg-lime-400/20 border border-lime-400/40 flex items-center justify-center text-lime-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-semibold text-sand-50">Simulation Playback Completed</p>
                <p className="text-2xs text-stone-400 truncate">
                  {currentBranch?.title || 'Initial baseline sequence finished.'}
                </p>
              </div>
              <Button variant="accent" size="sm" onClick={goToDebrief} className="shrink-0">
                Inspect Debrief
              </Button>
            </div>
          )}
        </div>

        <TelemetrySidePanel
          currentFrame={currentFrame}
          selectedAircraftId={selectedAircraftId}
          aircraftList={scenario.aircraftList}
          onSelectAircraft={selectAircraft}
          accumulatedEvents={accumulatedEvents}
          className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 shrink-0 h-72 lg:h-full"
        />
      </div>

      {/* Bottom Playback Scrubber */}
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

      <DecisionCheckpointModal
        checkpoint={status === 'CHECKPOINT_PAUSED' ? activeCheckpoint : null}
        onSelectDecision={selectDecision}
        onPreviewBranch={setPreviewBranchId}
      />
    </div>
  );
};
