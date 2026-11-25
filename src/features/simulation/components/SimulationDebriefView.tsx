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
          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-100/80 text-emerald-700 border border-emerald-500/40 flex items-center gap-1.5 shadow-glow-emerald">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            SAFE SEPARATION ACHIEVED
          </span>
        );
      case 'CATASTROPHIC_COLLISION':
        return (
          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-crimson-100/80 text-crimson-700 border border-crimson-500/40 flex items-center gap-1.5 shadow-glow-crimson">
            <Flame className="w-4 h-4 text-crimson-600" />
            CATASTROPHIC COLLISION
          </span>
        );
      case 'NEAR_MID_AIR_COLLISION':
        return (
          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-amber-100/80 text-amber-700 border border-amber-500/40 flex items-center gap-1.5 shadow-glow-amber">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            NEAR MID-AIR COLLISION
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-sand-200/70 text-stone-600 border border-obsidian-950/12 flex items-center gap-1.5">
            UNEVALUATED RUN
          </span>
        );
    }
  };

  const getOptionTypeBadge = (type: DecisionRecord['optionType'] | string) => {
    switch (type) {
      case 'RECOMMENDED_STANDARD':
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-mono font-semibold bg-emerald-100/80 text-emerald-700 border border-emerald-500/30">
            STANDARD SAFETY PRACTICE
          </span>
        );
      case 'HISTORICAL_ACTION':
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-mono font-semibold bg-crimson-100/80 text-crimson-700 border border-crimson-500/30">
            HISTORICAL ACTION (ACCIDENT BASELINE)
          </span>
        );
      case 'TACTICAL_ALTERNATIVE':
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-mono font-semibold bg-lime-400/50 text-obsidian-950 border border-lime-600/35">
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
      <div className="space-y-4 pb-4 border-b border-obsidian-950/12">
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

            <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
              <span className="text-slate-600">/</span>
              <span className="text-obsidian-950 font-semibold">{scenario.id}</span>
              <span className="text-slate-600">/</span>
              <span className="text-stone-600">Debrief & Outcome Analysis</span>
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
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-obsidian-950">
              Simulation Debrief & Outcome Analysis
            </h1>
            <Badge variant="accent" size="sm">
              PHASE 5 VERIFIED
            </Badge>
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Deterministic safety analysis of pilot decision branches for scenario {scenario.id} ({scenario.title}).
          </p>
        </div>
      </div>

      {/* 2. Session Metadata & KPI Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/12 space-y-1">
          <span className="text-2xs font-mono text-stone-500 uppercase tracking-wider block">
            Session Status
          </span>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <strong className="text-sm font-semibold text-obsidian-950">
              Scenario Completed
            </strong>
          </div>
          <span className="text-3xs font-mono text-stone-500 block">
            Attempt ID: {attemptId ? attemptId.substring(0, 16) + '...' : 'AUTO-SAVED'}
          </span>
        </div>

        <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/12 space-y-1">
          <span className="text-2xs font-mono text-stone-500 uppercase tracking-wider block">
            Duration & Horizon
          </span>
          <div className="flex items-center gap-1.5 pt-0.5 text-obsidian-950 font-telemetry text-base font-bold">
            <Clock className="w-4 h-4 text-obsidian-950" />
            <span>00:{totalDuration < 10 ? '0' + totalDuration : totalDuration}</span>
          </div>
          <span className="text-3xs font-mono text-stone-500 block">
            Total scenario timeline elapsed
          </span>
        </div>

        <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/12 space-y-1">
          <span className="text-2xs font-mono text-stone-500 uppercase tracking-wider block">
            Decisions Evaluated
          </span>
          <div className="flex items-center gap-1.5 pt-0.5 text-obsidian-950 font-telemetry text-base font-bold">
            <span className="text-obsidian-950">{decisionRecords.length || 1}</span>
            <span className="text-stone-500">/</span>
            <span>{scenario.checkpoints?.length || 1}</span>
          </div>
          <span className="text-3xs font-mono text-stone-500 block">
            Pilot checkpoints resolved
          </span>
        </div>

        <div className="p-4 rounded-panel bg-sand-100/70 border border-obsidian-950/12 space-y-1">
          <span className="text-2xs font-mono text-stone-500 uppercase tracking-wider block">
            Final Safety Classification
          </span>
          <div className="pt-0.5">
            {getClassificationBadge(outcome?.classification)}
          </div>
          <span className="text-3xs font-mono text-stone-500 block pt-1">
            Separation status at scenario termination
          </span>
        </div>
      </div>

      {/* 3. Primary Branch Outcome Dossier */}
      <div className="rounded-panel panel-surface-elevated border border-lime-600/35 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-obsidian-950/12">
          <div>
            <span className="text-2xs font-mono uppercase text-stone-500 block">
              Executed Decision Branch:
            </span>
            <div className="flex items-center gap-2">
              <strong className="text-obsidian-950 font-heading text-lg">
                {selectedBranch?.title || 'Default Trajectory'}
              </strong>
              {selectedOptionId && (
                <span className="text-2xs font-mono text-obsidian-950 bg-sand-100 px-2 py-0.5 rounded border border-lime-600/35">
                  [{selectedOptionId}]
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-3xs font-mono font-semibold bg-sand-200/70 text-stone-600 border border-obsidian-950/12">
              PROVENANCE: {outcome?.isHistoricalBranch ? 'RECORDED HISTORICAL' : 'HYPOTHETICAL ALTERNATIVE'}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="font-heading font-semibold text-sm text-obsidian-950">
            {outcome?.title}
          </h3>
          <p className="text-xs text-obsidian-950 leading-relaxed bg-sand-100/70 p-4 rounded border border-obsidian-950/12">
            {outcome?.summary}
          </p>
        </div>

        {/* Minimum Separation Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded bg-sand-100 border border-obsidian-950/12 flex items-center justify-between">
            <div>
              <span className="text-2xs text-stone-500 block mb-0.5">
                Minimum Lateral Separation:
              </span>
              <strong className="text-obsidian-950 text-base font-telemetry">
                {outcome?.minHorizontalSeparation || '0.8 NM'}
              </strong>
            </div>
            <span className="text-2xs text-stone-500">
              Standard: &gt; 5.0 NM
            </span>
          </div>

          <div className="p-3.5 rounded bg-sand-100 border border-obsidian-950/12 flex items-center justify-between">
            <div>
              <span className="text-2xs text-stone-500 block mb-0.5">
                Minimum Vertical Clearance:
              </span>
              <strong className="text-emerald-700 text-base font-telemetry">
                {outcome?.minVerticalSeparation || '2,400 FT'}
              </strong>
            </div>
            <span className="text-2xs text-stone-500">
              RVSM Standard: &gt; 1,000 FT
            </span>
          </div>
        </div>
      </div>

      {/* 4. Decision Analysis: Checkpoint Evaluation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-heading font-bold text-obsidian-950 flex items-center gap-2">
              <Radio className="w-5 h-5 text-obsidian-950" />
              Decision Analysis & Crew Interventions
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              Detailed breakdown of pilot checkpoints encountered and resulting airspace behaviors.
            </p>
          </div>
          <span className="text-2xs font-mono text-stone-500 bg-sand-100 px-2.5 py-1 rounded border border-obsidian-950/12">
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
              className="rounded-panel panel-surface border border-obsidian-950/12 overflow-hidden transition-all"
            >
              {/* Header */}
              <div
                onClick={() => toggleDecisionExpand(chk.id)}
                className="p-4 bg-sand-100/70 cursor-pointer flex items-center justify-between gap-4 hover:bg-navy-850 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-lime-400/50 text-obsidian-950 font-mono text-2xs font-bold border border-lime-600/35">
                    {chk.timestampFormatted}
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-obsidian-950">
                      {chk.title}
                    </h3>
                    <p className="text-2xs text-stone-500 font-mono">
                      Role: {chk.userRole}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getOptionTypeBadge(chosenOption.optionType)}
                  <button className="text-stone-500 hover:text-obsidian-950 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Body */}
              {isExpanded && (
                <div className="p-5 space-y-4 border-t border-obsidian-950/12 bg-sand-100">
                  {/* Situation Brief */}
                  <div className="p-3.5 rounded bg-sand-100/70 border border-obsidian-950/12 space-y-1 text-xs">
                    <span className="text-2xs font-mono uppercase text-stone-500 font-bold block">
                      Encounter Situation Briefing:
                    </span>
                    <p className="text-stone-600 leading-relaxed font-mono text-2xs">
                      {chk.situationBrief}
                    </p>
                  </div>

                  {/* Selected Action Card */}
                  <div className="p-4 rounded-panel bg-sand-100 border border-lime-600/35 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xs font-mono uppercase text-obsidian-950 font-bold">
                        User Selected Action:
                      </span>
                      {getOptionTypeBadge(chosenOption.optionType)}
                    </div>
                    <strong className="text-obsidian-950 text-sm block">
                      {chosenOption.title}
                    </strong>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {chosenOption.description}
                    </p>
                    <div className="p-2.5 rounded bg-sand-100 border border-obsidian-950/12 text-2xs font-mono text-stone-600">
                      <strong className="text-stone-500">Immediate Consequence: </strong>
                      {chosenOption.consequenceSummary}
                    </div>
                  </div>

                  {/* Other Available Checkpoint Options */}
                  <div className="space-y-2">
                    <span className="text-2xs font-mono uppercase text-stone-500 font-bold block">
                      Alternate Options in this Checkpoint:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {chk.options
                        .filter((o) => o.id !== chosenOption.id)
                        .map((alt) => (
                          <div
                            key={alt.id}
                            className="p-3 rounded bg-sand-100/70 border border-obsidian-950/12 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-obsidian-950 text-2xs">
                                {alt.title}
                              </span>
                              {getOptionTypeBadge(alt.optionType)}
                            </div>
                            <p className="text-3xs text-stone-500 leading-relaxed">
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
              <h2 className="text-lg font-heading font-bold text-obsidian-950 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-aviation-400" />
                Outcome Comparison with Baseline Reference
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                Cross-comparison between your executed decision path and the recorded historical baseline.
              </p>
            </div>
            <span className="text-2xs font-mono text-stone-500 bg-sand-100 px-2.5 py-1 rounded border border-obsidian-950/12">
              Reference: {referenceBranch.title}
            </span>
          </div>

          <div className="rounded-panel panel-surface border border-obsidian-950/12 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-obsidian-950/12 bg-sand-100/70 text-stone-500 text-2xs uppercase">
                    <th className="py-3 px-4">Evaluation Parameter</th>
                    <th className="py-3 px-4 text-obsidian-950">
                      User Selected Path ({selectedBranch?.title.split(':')[0] || 'Selected'})
                    </th>
                    <th className="py-3 px-4 text-crimson-700">
                      Historical Baseline (ATC Descent)
                    </th>
                    <th className="py-3 px-4 text-stone-500">Safety Margin Differential</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/60">
                  <tr className="hover:bg-sand-100/70">
                    <td className="py-3 px-4 text-stone-600 font-semibold">
                      Vertical Clearance
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">
                      {outcome?.minVerticalSeparation || '2,400 FT'}
                    </td>
                    <td className="py-3 px-4 text-crimson-600 font-bold">
                      0 FT (Collision FL348)
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      +2,400 FT Vertical Divergence
                    </td>
                  </tr>

                  <tr className="hover:bg-sand-100/70">
                    <td className="py-3 px-4 text-stone-600 font-semibold">
                      Lateral Distance
                    </td>
                    <td className="py-3 px-4 text-obsidian-950">
                      {outcome?.minHorizontalSeparation || '0.8 NM'}
                    </td>
                    <td className="py-3 px-4 text-crimson-700">
                      0.0 NM (Intersected)
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      Non-intersecting path
                    </td>
                  </tr>

                  <tr className="hover:bg-sand-100/70">
                    <td className="py-3 px-4 text-stone-600 font-semibold">
                      Time to Resolution
                    </td>
                    <td className="py-3 px-4 text-obsidian-950">
                      ~75 seconds (Clear of Conflict)
                    </td>
                    <td className="py-3 px-4 text-amber-600">
                      86 seconds (Impact)
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      Resolved 11s prior to intersection
                    </td>
                  </tr>

                  <tr className="hover:bg-sand-100/70">
                    <td className="py-3 px-4 text-stone-600 font-semibold">
                      TCAS Rule Adherence
                    </td>
                    <td className="py-3 px-4 text-emerald-700">
                      {selectedBranch?.id === 'BRANCH_TCAS_CLIMB'
                        ? 'Strict Compliance (ICAO Annex 2)'
                        : 'Alternative Avoidance'}
                    </td>
                    <td className="py-3 px-4 text-crimson-600">
                      Direct Contradiction of TCAS RA
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      ICAO standards updated worldwide
                    </td>
                  </tr>

                  <tr className="hover:bg-sand-100/70">
                    <td className="py-3 px-4 text-stone-600 font-semibold">
                      Final Classification
                    </td>
                    <td className="py-3 px-4">
                      {getClassificationBadge(outcome?.classification)}
                    </td>
                    <td className="py-3 px-4">
                      {getClassificationBadge(referenceBranch.outcome.classification)}
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-2xs">
                      Catastrophic risk eliminated
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Qualitative Synthesis */}
            {outcome?.comparisonWithReference && (
              <div className="p-4 bg-sand-100/70 border-t border-obsidian-950/12 text-xs text-stone-600 space-y-1 font-mono">
                <span className="text-2xs text-obsidian-950 font-bold uppercase block">
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
            <h2 className="text-lg font-heading font-bold text-obsidian-950 flex items-center gap-2">
              <Clock className="w-5 h-5 text-stone-500" />
              Chronological Session Events ({displayedEvents.length})
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              Recorded sequence of radar triggers, automated alerts, and pilot actions.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllEvents(!showAllEvents)}
            className="text-xs font-mono text-obsidian-950"
          >
            {showAllEvents ? 'Show Key Alerts Only' : `Show All Events (${events.length})`}
          </Button>
        </div>

        <div className="rounded-panel panel-surface border border-obsidian-950/12 p-4 space-y-3 max-h-72 overflow-y-auto font-mono text-xs">
          {displayedEvents.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="flex items-start gap-3 p-2.5 rounded bg-sand-100/70 border border-obsidian-950/12 hover:border-lime-600/35 transition-colors"
            >
              <span className="text-2xs text-obsidian-950 font-bold shrink-0 mt-0.5">
                {evt.timestampFormatted}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-obsidian-950 text-xs truncate">
                    {evt.title}
                  </span>
                  <span className="text-3xs text-stone-500 uppercase px-1.5 py-0.5 rounded bg-sand-100 border border-obsidian-950/12">
                    {evt.provenance}
                  </span>
                </div>
                <p className="text-2xs text-stone-500 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Learning Summary & Educational Takeaways */}
      {outcome?.learningPoints && (
        <div className="rounded-panel panel-surface-elevated border border-lime-600/35 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-obsidian-950" />
            <h2 className="text-base font-heading font-bold text-obsidian-950">
              Aviation Safety & System Learning Summary
            </h2>
          </div>

          <p className="text-xs text-stone-600 font-mono leading-relaxed">
            The Überlingen mid-air collision directly caused global regulatory reform in international air traffic control and avionics integration. The primary insights derived from this investigation include:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {outcome.learningPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-panel bg-sand-100/70 border border-obsidian-950/12 space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-2xs font-mono font-bold text-obsidian-950">
                  <CheckCircle2 className="w-3.5 h-3.5 text-obsidian-950 shrink-0" />
                  <span>Key Takeaway #{idx + 1}</span>
                </div>
                <p className="text-2xs text-stone-600 font-mono leading-relaxed">
                  {pt}
                </p>
              </div>
            ))}
          </div>

          {/* Research & Provenance Notice */}
          <div className="mt-4 p-3 rounded bg-sand-100 border border-obsidian-950/12 text-3xs font-mono text-stone-500 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              DATA PROVENANCE: This debrief synthesizes factual findings from the German Federal Bureau of Aircraft Accident Investigation (BFU AX001-1-2/02) and predefined simulation branches for academic research.
            </span>
          </div>
        </div>
      )}

      {/* 8. Bottom Navigation Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-obsidian-950/12">
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
