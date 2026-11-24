import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Layers,
  BookOpen,
  History,
  ChevronDown,
  ChevronUp,
  Clock,
  Radio,
} from 'lucide-react';
import {
  SimulationOutcome,
  SimulationBranch,
  SimulationScenario,
  SimulationEvent,
} from '../types/simulation';
import { DecisionRecord } from '@/features/history/types/history';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface SimulationDebriefViewProps {
  scenario: SimulationScenario;
  selectedBranch: SimulationBranch | null;
  selectedOptionId: string | null;
  decisionRecords?: DecisionRecord[];
  events?: SimulationEvent[];
  totalDuration?: number;
  attemptId?: string | null;
  onRestart: () => void;
  onReturnToPlayback: () => void;
  onExitToInvestigation: () => void;
}

export const SimulationDebriefView: React.FC<SimulationDebriefViewProps> = ({
  scenario,
  selectedBranch,
  selectedOptionId,
  decisionRecords = [],
  events = [],
  totalDuration = 90,
  attemptId,
  onRestart,
  onReturnToPlayback,
  onExitToInvestigation,
}) => {
  const navigate = useNavigate();
  const outcome: SimulationOutcome | undefined = selectedBranch?.outcome;
  const [expandedDecisions, setExpandedDecisions] = useState<Record<string, boolean>>({
    'CHK-UBL-01': true,
  });
  const [showAllEvents, setShowAllEvents] = useState(false);

  const toggleDecisionExpand = (id: string) => {
    setExpandedDecisions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const referenceBranch = scenario.branches[scenario.referenceBranchId];

  const getClassificationBadge = (c?: SimulationOutcome['classification']) => {
    switch (c) {
      case 'SAFE_SEPARATION':
        return (
          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-glow-emerald">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            SAFE SEPARATION ACHIEVED
          </span>
        );
      case 'CATASTROPHIC_COLLISION':
        return (
          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-crimson-950 text-crimson-300 border border-crimson-500/40 flex items-center gap-1.5 shadow-glow-crimson">
            <Flame className="w-4 h-4 text-crimson-400" />
            CATASTROPHIC COLLISION
          </span>
        );
      case 'NEAR_MID_AIR_COLLISION':
        return (
          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-glow-amber">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            NEAR MID-AIR COLLISION
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-navy-800 text-slate-300 border border-navy-700 flex items-center gap-1.5">
            UNEVALUATED RUN
          </span>
        );
    }
  };

  const getOptionTypeBadge = (type: DecisionRecord['optionType'] | string) => {
    switch (type) {
      case 'RECOMMENDED_STANDARD':
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            STANDARD SAFETY PRACTICE
          </span>
        );
      case 'HISTORICAL_ACTION':
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-mono font-semibold bg-crimson-950/80 text-crimson-300 border border-crimson-500/30">
            HISTORICAL ACTION (ACCIDENT BASELINE)
          </span>
        );
      case 'TACTICAL_ALTERNATIVE':
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            TACTICAL HYPOTHETICAL ALTERNATIVE
          </span>
        );
      default:
        return null;
    }
  };

  // Important events to highlight in the chronological session summary
  const keyEvents = events.filter(
    (e) =>
      e.category === 'TCAS_ADVISORY' ||
      e.category === 'ATC_INSTRUCTION' ||
      e.category === 'CREW_RESPONSE' ||
      e.category === 'OUTCOME'
  );
  const displayedEvents = showAllEvents ? events : keyEvents.length > 0 ? keyEvents : events;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* 1. Header & Navigation Dossier */}
      <div className="space-y-4 pb-4 border-b border-navy-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onExitToInvestigation}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Investigation Dossier
            </Button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-slate-600">/</span>
              <span className="text-cyan-300 font-semibold">{scenario.id}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">Debrief & Outcome Analysis</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/app/my-investigations')}
              leftIcon={<History className="w-3.5 h-3.5" />}
            >
              My Investigations
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReturnToPlayback}
              leftIcon={<Layers className="w-3.5 h-3.5" />}
            >
              Replay Airspace
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onRestart}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Try Alternate Decision
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Simulation Debrief & Outcome Analysis
            </h1>
            <Badge variant="accent" size="sm">
              PHASE 5 VERIFIED
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Deterministic safety analysis of pilot decision branches for scenario {scenario.id} ({scenario.title}).
          </p>
        </div>
      </div>

      {/* 2. Session Metadata & KPI Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-panel bg-navy-900/80 border border-navy-800 space-y-1">
          <span className="text-2xs font-mono text-slate-400 uppercase tracking-wider block">
            Session Status
          </span>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <strong className="text-sm font-semibold text-slate-200">
              Scenario Completed
            </strong>
          </div>
          <span className="text-3xs font-mono text-slate-500 block">
            Attempt ID: {attemptId ? attemptId.substring(0, 16) + '...' : 'AUTO-SAVED'}
          </span>
        </div>

        <div className="p-4 rounded-panel bg-navy-900/80 border border-navy-800 space-y-1">
          <span className="text-2xs font-mono text-slate-400 uppercase tracking-wider block">
            Duration & Horizon
          </span>
          <div className="flex items-center gap-1.5 pt-0.5 text-cyan-300 font-telemetry text-base font-bold">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>00:{totalDuration < 10 ? '0' + totalDuration : totalDuration}</span>
          </div>
          <span className="text-3xs font-mono text-slate-500 block">
            Total scenario timeline elapsed
          </span>
        </div>

        <div className="p-4 rounded-panel bg-navy-900/80 border border-navy-800 space-y-1">
          <span className="text-2xs font-mono text-slate-400 uppercase tracking-wider block">
            Decisions Evaluated
          </span>
          <div className="flex items-center gap-1.5 pt-0.5 text-slate-200 font-telemetry text-base font-bold">
            <span className="text-cyan-400">{decisionRecords.length || 1}</span>
            <span className="text-slate-500">/</span>
            <span>{scenario.checkpoints?.length || 1}</span>
          </div>
          <span className="text-3xs font-mono text-slate-500 block">
            Pilot checkpoints resolved
          </span>
        </div>

        <div className="p-4 rounded-panel bg-navy-900/80 border border-navy-800 space-y-1">
          <span className="text-2xs font-mono text-slate-400 uppercase tracking-wider block">
            Final Safety Classification
          </span>
          <div className="pt-0.5">
            {getClassificationBadge(outcome?.classification)}
          </div>
          <span className="text-3xs font-mono text-slate-500 block pt-1">
            Separation status at scenario termination
          </span>
        </div>
      </div>

      {/* 3. Primary Branch Outcome Dossier */}
      <div className="rounded-panel panel-surface-elevated border border-cyan-500/30 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-800">
          <div>
            <span className="text-2xs font-mono uppercase text-slate-500 block">
              Executed Decision Branch:
            </span>
            <div className="flex items-center gap-2">
              <strong className="text-white font-heading text-lg">
                {selectedBranch?.title || 'Default Trajectory'}
              </strong>
              {selectedOptionId && (
                <span className="text-2xs font-mono text-cyan-400 bg-navy-900 px-2 py-0.5 rounded border border-cyan-500/30">
                  [{selectedOptionId}]
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-3xs font-mono font-semibold bg-navy-800 text-slate-300 border border-navy-700">
              PROVENANCE: {outcome?.isHistoricalBranch ? 'RECORDED HISTORICAL' : 'HYPOTHETICAL ALTERNATIVE'}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="font-heading font-semibold text-sm text-white">
            {outcome?.title}
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed bg-navy-900/70 p-4 rounded border border-navy-800">
            {outcome?.summary}
          </p>
        </div>

        {/* Minimum Separation Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded bg-navy-900 border border-navy-800 flex items-center justify-between">
            <div>
              <span className="text-2xs text-slate-500 block mb-0.5">
                Minimum Lateral Separation:
              </span>
              <strong className="text-cyan-300 text-base font-telemetry">
                {outcome?.minHorizontalSeparation || '0.8 NM'}
              </strong>
            </div>
            <span className="text-2xs text-slate-400">
              Standard: &gt; 5.0 NM
            </span>
          </div>

          <div className="p-3.5 rounded bg-navy-900 border border-navy-800 flex items-center justify-between">
            <div>
              <span className="text-2xs text-slate-500 block mb-0.5">
                Minimum Vertical Clearance:
              </span>
              <strong className="text-emerald-400 text-base font-telemetry">
                {outcome?.minVerticalSeparation || '2,400 FT'}
              </strong>
            </div>
            <span className="text-2xs text-slate-400">
              RVSM Standard: &gt; 1,000 FT
            </span>
          </div>
        </div>
      </div>

      {/* 4. Decision Analysis: Checkpoint Evaluation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              Decision Analysis & Crew Interventions
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Detailed breakdown of pilot checkpoints encountered and resulting airspace behaviors.
            </p>
          </div>
          <span className="text-2xs font-mono text-slate-400 bg-navy-900 px-2.5 py-1 rounded border border-navy-800">
            {scenario.checkpoints?.length || 1} Checkpoint Defined
          </span>
        </div>

        {scenario.checkpoints?.map((chk) => {
          const isExpanded = expandedDecisions[chk.id] ?? true;
          // Find option selected by user or matching selectedBranchId
          const chosenOption =
            chk.options.find((o) => o.id === selectedOptionId || o.branchId === selectedBranch?.id) ||
            chk.options[0];

          return (
            <div
              key={chk.id}
              className="rounded-panel panel-surface border border-navy-700/80 overflow-hidden transition-all"
            >
              {/* Header */}
              <div
                onClick={() => toggleDecisionExpand(chk.id)}
                className="p-4 bg-navy-900/80 cursor-pointer flex items-center justify-between gap-4 hover:bg-navy-850 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-cyan-950/80 text-cyan-300 font-mono text-2xs font-bold border border-cyan-500/30">
                    {chk.timestampFormatted}
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-slate-100">
                      {chk.title}
                    </h3>
                    <p className="text-2xs text-slate-400 font-mono">
                      Role: {chk.userRole}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getOptionTypeBadge(chosenOption.optionType)}
                  <button className="text-slate-400 hover:text-slate-200 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Body */}
              {isExpanded && (
                <div className="p-5 space-y-4 border-t border-navy-800 bg-navy-950/40">
                  {/* Situation Brief */}
                  <div className="p-3.5 rounded bg-navy-900/60 border border-navy-800 space-y-1 text-xs">
                    <span className="text-2xs font-mono uppercase text-slate-400 font-bold block">
                      Encounter Situation Briefing:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-mono text-2xs">
                      {chk.situationBrief}
                    </p>
                  </div>

                  {/* Selected Action Card */}
                  <div className="p-4 rounded-panel bg-navy-900 border border-cyan-500/40 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xs font-mono uppercase text-cyan-400 font-bold">
                        User Selected Action:
                      </span>
                      {getOptionTypeBadge(chosenOption.optionType)}
                    </div>
                    <strong className="text-slate-100 text-sm block">
                      {chosenOption.title}
                    </strong>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {chosenOption.description}
                    </p>
                    <div className="p-2.5 rounded bg-navy-950 border border-navy-800 text-2xs font-mono text-slate-300">
                      <strong className="text-slate-400">Immediate Consequence: </strong>
                      {chosenOption.consequenceSummary}
                    </div>
                  </div>

                  {/* Other Available Checkpoint Options */}
                  <div className="space-y-2">
                    <span className="text-2xs font-mono uppercase text-slate-400 font-bold block">
                      Alternate Options in this Checkpoint:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {chk.options
                        .filter((o) => o.id !== chosenOption.id)
                        .map((alt) => (
                          <div
                            key={alt.id}
                            className="p-3 rounded bg-navy-900/40 border border-navy-800/80 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-slate-200 text-2xs">
                                {alt.title}
                              </span>
                              {getOptionTypeBadge(alt.optionType)}
                            </div>
                            <p className="text-3xs text-slate-400 leading-relaxed">
                              {alt.consequenceSummary}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Outcome Comparison: Selected Branch vs Reference Baseline */}
      {referenceBranch && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-aviation-400" />
                Outcome Comparison with Baseline Reference
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Cross-comparison between your executed decision path and the recorded historical baseline.
              </p>
            </div>
            <span className="text-2xs font-mono text-slate-400 bg-navy-900 px-2.5 py-1 rounded border border-navy-800">
              Reference: {referenceBranch.title}
            </span>
          </div>

          <div className="rounded-panel panel-surface border border-navy-700/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-navy-800 bg-navy-900/90 text-slate-400 text-2xs uppercase">
                    <th className="py-3 px-4">Evaluation Parameter</th>
                    <th className="py-3 px-4 text-cyan-300">
                      User Selected Path ({selectedBranch?.title.split(':')[0] || 'Selected'})
                    </th>
                    <th className="py-3 px-4 text-crimson-300">
                      Historical Baseline (ATC Descent)
                    </th>
                    <th className="py-3 px-4 text-slate-400">Safety Margin Differential</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/60">
                  <tr className="hover:bg-navy-900/40">
                    <td className="py-3 px-4 text-slate-300 font-semibold">
                      Vertical Clearance
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      {outcome?.minVerticalSeparation || '2,400 FT'}
                    </td>
                    <td className="py-3 px-4 text-crimson-400 font-bold">
                      0 FT (Collision FL348)
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      +2,400 FT Vertical Divergence
                    </td>
                  </tr>

                  <tr className="hover:bg-navy-900/40">
                    <td className="py-3 px-4 text-slate-300 font-semibold">
                      Lateral Distance
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {outcome?.minHorizontalSeparation || '0.8 NM'}
                    </td>
                    <td className="py-3 px-4 text-crimson-300">
                      0.0 NM (Intersected)
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      Non-intersecting path
                    </td>
                  </tr>

                  <tr className="hover:bg-navy-900/40">
                    <td className="py-3 px-4 text-slate-300 font-semibold">
                      Time to Resolution
                    </td>
                    <td className="py-3 px-4 text-cyan-300">
                      ~75 seconds (Clear of Conflict)
                    </td>
                    <td className="py-3 px-4 text-amber-400">
                      86 seconds (Impact)
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      Resolved 11s prior to intersection
                    </td>
                  </tr>

                  <tr className="hover:bg-navy-900/40">
                    <td className="py-3 px-4 text-slate-300 font-semibold">
                      TCAS Rule Adherence
                    </td>
                    <td className="py-3 px-4 text-emerald-400">
                      {selectedBranch?.id === 'BRANCH_TCAS_CLIMB'
                        ? 'Strict Compliance (ICAO Annex 2)'
                        : 'Alternative Avoidance'}
                    </td>
                    <td className="py-3 px-4 text-crimson-400">
                      Direct Contradiction of TCAS RA
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      ICAO standards updated worldwide
                    </td>
                  </tr>

                  <tr className="hover:bg-navy-900/40">
                    <td className="py-3 px-4 text-slate-300 font-semibold">
                      Final Classification
                    </td>
                    <td className="py-3 px-4">
                      {getClassificationBadge(outcome?.classification)}
                    </td>
                    <td className="py-3 px-4">
                      {getClassificationBadge(referenceBranch.outcome.classification)}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-2xs">
                      Catastrophic risk eliminated
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Qualitative Synthesis */}
            {outcome?.comparisonWithReference && (
              <div className="p-4 bg-navy-900/70 border-t border-navy-800 text-xs text-slate-300 space-y-1 font-mono">
                <span className="text-2xs text-cyan-400 font-bold uppercase block">
                  Analytical Conclusion:
                </span>
                <p className="leading-relaxed text-2xs">
                  {outcome.comparisonWithReference}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Chronological Session Timeline Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Chronological Session Events ({displayedEvents.length})
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Recorded sequence of radar triggers, automated alerts, and pilot actions.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllEvents(!showAllEvents)}
            className="text-xs font-mono text-cyan-300"
          >
            {showAllEvents ? 'Show Key Alerts Only' : `Show All Events (${events.length})`}
          </Button>
        </div>

        <div className="rounded-panel panel-surface border border-navy-850 p-4 space-y-3 max-h-72 overflow-y-auto font-mono text-xs">
          {displayedEvents.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="flex items-start gap-3 p-2.5 rounded bg-navy-900/60 border border-navy-800/80 hover:border-cyan-500/30 transition-colors"
            >
              <span className="text-2xs text-cyan-400 font-bold shrink-0 mt-0.5">
                {evt.timestampFormatted}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-slate-200 text-xs truncate">
                    {evt.title}
                  </span>
                  <span className="text-3xs text-slate-500 uppercase px-1.5 py-0.5 rounded bg-navy-950 border border-navy-800">
                    {evt.provenance}
                  </span>
                </div>
                <p className="text-2xs text-slate-400 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Learning Summary & Educational Takeaways */}
      {outcome?.learningPoints && (
        <div className="rounded-panel panel-surface-elevated border border-cyan-500/30 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-heading font-bold text-white">
              Aviation Safety & System Learning Summary
            </h2>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            The Überlingen mid-air collision directly caused global regulatory reform in international air traffic control and avionics integration. The primary insights derived from this investigation include:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {outcome.learningPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-panel bg-navy-900/80 border border-navy-800 space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-2xs font-mono font-bold text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Key Takeaway #{idx + 1}</span>
                </div>
                <p className="text-2xs text-slate-300 font-mono leading-relaxed">
                  {pt}
                </p>
              </div>
            ))}
          </div>

          {/* Research & Provenance Notice */}
          <div className="mt-4 p-3 rounded bg-navy-950 border border-navy-800 text-3xs font-mono text-slate-500 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              DATA PROVENANCE: This debrief synthesizes factual findings from the German Federal Bureau of Aircraft Accident Investigation (BFU AX001-1-2/02) and predefined simulation branches for academic research.
            </span>
          </div>
        </div>
      )}

      {/* 8. Bottom Navigation Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-navy-800">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExitToInvestigation}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Return to Investigation Dossier
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/app/my-investigations')}
            leftIcon={<History className="w-3.5 h-3.5" />}
          >
            Open My Investigations
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReturnToPlayback}
            leftIcon={<Layers className="w-3.5 h-3.5" />}
          >
            Review Playback
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onRestart}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Try Alternate Decision
          </Button>
        </div>
      </div>
    </div>
  );
};
