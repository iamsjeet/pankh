import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  SimulationScenario,
  SimulationStatus,
  PlaybackSpeed,
  PlaybackFrame,
  SimulationEvent,
  DecisionCheckpoint,
  SimulationBranch,
} from '../types/simulation';
import { DecisionRecord } from '@/features/history/types/history';
import { historyService } from '@/features/history/services/historyService';

export interface UseSimulationControllerReturn {
  status: SimulationStatus;
  currentTimestamp: number;
  totalDuration: number;
  playbackSpeed: PlaybackSpeed;
  currentFrame: PlaybackFrame | null;
  activeCheckpoint: DecisionCheckpoint | null;
  selectedBranchId: string | null;
  selectedOptionId: string | null;
  currentBranch: SimulationBranch | null;
  selectedAircraftId: string;
  accumulatedEvents: SimulationEvent[];
  allFrames: PlaybackFrame[];
  decisionRecords: DecisionRecord[];
  attemptId: string | null;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (timestamp: number) => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  selectDecision: (optionId: string, branchId: string) => void;
  restart: () => void;
  selectAircraft: (aircraftId: string) => void;
  startSimulation: () => void;
  goToDebrief: () => void;
  returnToSimulation: () => void;
}

export function useSimulationController(
  scenario: SimulationScenario | null
): UseSimulationControllerReturn {
  const [status, setStatus] = useState<SimulationStatus>('BRIEFING');
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>(
    scenario?.aircraftList[0]?.id || 'BTC2937'
  );
  const [activeCheckpoint, setActiveCheckpoint] = useState<DecisionCheckpoint | null>(null);
  const [decisionRecords, setDecisionRecords] = useState<DecisionRecord[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  // Reference for requestAnimationFrame clock
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Combine initial frames with selected branch continuation frames
  const allFrames: PlaybackFrame[] = useMemo(() => {
    if (!scenario) return [];
    if (!selectedBranchId || !scenario.branches[selectedBranchId]) {
      return scenario.initialFrames;
    }
    const branch = scenario.branches[selectedBranchId];
    return [...scenario.initialFrames, ...branch.frames];
  }, [scenario, selectedBranchId]);

  // Combined events based on active branch
  const allEvents: SimulationEvent[] = useMemo(() => {
    if (!scenario) return [];
    if (!selectedBranchId || !scenario.branches[selectedBranchId]) {
      return scenario.initialEvents;
    }
    const branch = scenario.branches[selectedBranchId];
    return [...scenario.initialEvents, ...branch.events];
  }, [scenario, selectedBranchId]);

  const totalDuration = useMemo(() => {
    if (allFrames.length === 0) return 90;
    return allFrames[allFrames.length - 1].timestamp;
  }, [allFrames]);

  const currentBranch = useMemo(() => {
    if (!scenario || !selectedBranchId) return null;
    return scenario.branches[selectedBranchId] || null;
  }, [scenario, selectedBranchId]);

  // Current frame lookup
  const currentFrame = useMemo(() => {
    if (allFrames.length === 0) return null;
    const roundedTime = Math.floor(currentTimestamp);
    const frame = allFrames.find((f) => f.timestamp === roundedTime);
    if (frame) return frame;
    if (roundedTime >= totalDuration) return allFrames[allFrames.length - 1];
    return allFrames[0];
  }, [allFrames, currentTimestamp, totalDuration]);

  // Filter events up to current timestamp
  const accumulatedEvents = useMemo(() => {
    return allEvents.filter((e) => e.timestamp <= currentTimestamp);
  }, [allEvents, currentTimestamp]);

  // Ticker loop
  useEffect(() => {
    if (status !== 'PLAYING') {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }

      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const deltaSeconds = (deltaMs / 1000) * playbackSpeed;

      setCurrentTimestamp((prev) => {
        const nextTime = prev + deltaSeconds;

        // Check if we hit an unresolved decision checkpoint
        if (scenario && scenario.checkpoints && !selectedBranchId) {
          for (const chk of scenario.checkpoints) {
            if (prev < chk.timestamp && nextTime >= chk.timestamp) {
              setStatus('CHECKPOINT_PAUSED');
              setActiveCheckpoint(chk);
              return chk.timestamp;
            }
          }
        }

        // Check if we reached the end of the simulation
        if (nextTime >= totalDuration) {
          setStatus('COMPLETED');
          return totalDuration;
        }

        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [status, playbackSpeed, scenario, selectedBranchId, totalDuration]);

  // Controls
  const play = useCallback(() => {
    if (status === 'COMPLETED') {
      setCurrentTimestamp(0);
    }
    setStatus('PLAYING');
  }, [status]);

  const pause = useCallback(() => {
    setStatus('PAUSED');
  }, []);

  const togglePlay = useCallback(() => {
    if (status === 'PLAYING') {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  const seek = useCallback((timestamp: number) => {
    setCurrentTimestamp(Math.max(0, Math.min(totalDuration, timestamp)));
  }, [totalDuration]);

  const setSpeed = useCallback((speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
  }, []);

  const selectDecision = useCallback(
    (optionId: string, branchId: string) => {
      setSelectedOptionId(optionId);
      setSelectedBranchId(branchId);

      // Find the option and checkpoint to build a structured decision record
      let newRecord: DecisionRecord | null = null;
      if (scenario && scenario.checkpoints) {
        for (const chk of scenario.checkpoints) {
          const opt = chk.options.find((o) => o.id === optionId);
          if (opt) {
            const branch = scenario.branches[branchId];
            newRecord = {
              checkpointId: chk.id,
              checkpointTitle: chk.title,
              timestamp: chk.timestamp,
              timestampFormatted: chk.timestampFormatted,
              situationBrief: chk.situationBrief,
              selectedOptionId: opt.id,
              selectedOptionTitle: opt.title,
              optionType: opt.optionType,
              branchId: branchId,
              branchTitle: branch ? branch.title : branchId,
              consequenceSummary: opt.consequenceSummary,
              learningPoints: branch?.outcome ? branch.outcome.learningPoints : [],
            };
            break;
          }
        }
      }

      const updatedRecords = newRecord ? [...decisionRecords, newRecord] : decisionRecords;
      setDecisionRecords(updatedRecords);
      setActiveCheckpoint(null);
      setStatus('PLAYING');

      // Auto-save attempt with decision in progress
      if (scenario) {
        const branch = scenario.branches[branchId];
        const saved = historyService.saveSimulationAttempt({
          id: attemptId || undefined,
          scenarioId: scenario.id,
          incidentId: scenario.incidentId,
          scenarioTitle: scenario.title,
          scenarioType: scenario.scenarioType,
          provenance: scenario.provenance,
          totalDurationSeconds: totalDuration,
          elapsedSeconds: currentTimestamp,
          completed: false,
          status: 'IN_PROGRESS',
          userRole: scenario.userRole,
          selectedBranchId: branchId,
          selectedOptionId: optionId,
          decisions: updatedRecords,
          outcome: branch?.outcome,
          eventsCount: allEvents.length,
          minSeparationReached: branch?.outcome
            ? {
                horizontal: branch.outcome.minHorizontalSeparation,
                vertical: branch.outcome.minVerticalSeparation,
              }
            : undefined,
        });
        setAttemptId(saved.id);
      }
    },
    [scenario, decisionRecords, attemptId, totalDuration, currentTimestamp, allEvents.length]
  );

  const restart = useCallback(() => {
    setCurrentTimestamp(0);
    setSelectedBranchId(null);
    setSelectedOptionId(null);
    setActiveCheckpoint(null);
    setDecisionRecords([]);
    setAttemptId(null);
    setStatus('PLAYING');
  }, []);

  const selectAircraft = useCallback((aircraftId: string) => {
    setSelectedAircraftId(aircraftId);
  }, []);

  const startSimulation = useCallback(() => {
    setCurrentTimestamp(0);
    setDecisionRecords([]);
    const newAttemptId = `SIM-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setAttemptId(newAttemptId);
    setStatus('PLAYING');
  }, []);

  const goToDebrief = useCallback(() => {
    setStatus('DEBRIEF');

    // Persist finalized completed attempt
    if (scenario && selectedBranchId) {
      const branch = scenario.branches[selectedBranchId];
      historyService.saveSimulationAttempt({
        id: attemptId || undefined,
        scenarioId: scenario.id,
        incidentId: scenario.incidentId,
        scenarioTitle: scenario.title,
        scenarioType: scenario.scenarioType,
        provenance: scenario.provenance,
        totalDurationSeconds: totalDuration,
        elapsedSeconds: totalDuration,
        completed: true,
        status: 'COMPLETED',
        userRole: scenario.userRole,
        selectedBranchId: selectedBranchId,
        selectedOptionId: selectedOptionId,
        decisions: decisionRecords,
        outcome: branch?.outcome,
        eventsCount: allEvents.length,
        minSeparationReached: branch?.outcome
          ? {
              horizontal: branch.outcome.minHorizontalSeparation,
              vertical: branch.outcome.minVerticalSeparation,
            }
          : undefined,
      });
    }
  }, [
    scenario,
    selectedBranchId,
    selectedOptionId,
    attemptId,
    totalDuration,
    decisionRecords,
    allEvents.length,
  ]);

  const returnToSimulation = useCallback(() => {
    setStatus('PAUSED');
  }, []);

  return {
    status,
    currentTimestamp,
    totalDuration,
    playbackSpeed,
    currentFrame,
    activeCheckpoint,
    selectedBranchId,
    selectedOptionId,
    currentBranch,
    selectedAircraftId,
    accumulatedEvents,
    allFrames,
    decisionRecords,
    attemptId,
    play,
    pause,
    togglePlay,
    seek,
    setSpeed,
    selectDecision,
    restart,
    selectAircraft,
    startSimulation,
    goToDebrief,
    returnToSimulation,
  };
}
