import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  Plane,
  FileText,
  Bot,
  Layers,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  PanelRightClose,
} from 'lucide-react';
import { incidentService } from '@/features/incidents/services/incidentService';
import { Incident } from '@/features/incidents/types/incident';
import { historyService } from '@/features/history/services/historyService';
import { IncidentHeader } from '../components/IncidentHeader';
import { IncidentTimeline } from '../components/IncidentTimeline';
import { AircraftInfoPanel } from '../components/AircraftInfoPanel';
import { EvidenceFindingsPanel } from '../components/EvidenceFindingsPanel';
import { AssistantEntryPanel } from '../components/AssistantEntryPanel';
import { AssistantChatPanel } from '@/features/assistant/components/AssistantChatPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { staggerContainer, slideUp } from '@/animations/variants';

export const InvestigationWorkspacePage: React.FC = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const navigate = useNavigate();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('all');
  const [highlightedEvidenceId, setHighlightedEvidenceId] = useState<string | null>(null);

  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadIncident() {
      if (!incidentId) return;
      try {
        const data = await incidentService.getIncidentById(incidentId);
        if (isMounted) {
          setIncident(data);
          setIsLoading(false);
          if (data) {
            historyService.recordIncidentVisit({
              incidentId: data.id,
              incidentTitle: data.title,
              category: data.category,
              severity: data.severity,
              totalEvidenceCount: data.evidence?.length,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load incident investigation record:', err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadIncident();
    return () => {
      isMounted = false;
    };
  }, [incidentId]);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-stone-500 font-mono text-xs gap-3">
        <Loader2 className="w-8 h-8 text-obsidian-950 animate-spin" />
        <span>Loading incident investigation record: {incidentId}...</span>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-card panel-surface text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-crimson-100 border border-crimson-500/30 text-crimson-600 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="font-heading text-lg font-bold text-obsidian-950">
          Incident Record Not Found
        </h2>
        <p className="text-xs text-stone-600 font-mono leading-relaxed">
          The requested investigation dossier <strong className="text-obsidian-950">{incidentId}</strong> does not exist or has not yet been ingested into the repository.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/app/investigations')}
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Return to Incident Library
        </Button>
      </div>
    );
  }

  const workspaceTabs = [
    { id: 'all', label: 'All Dossier Sections', icon: <Layers className="w-3.5 h-3.5" /> },
    {
      id: 'timeline',
      label: 'Event Timeline',
      icon: <Clock className="w-3.5 h-3.5" />,
      badge: incident.timeline.length,
    },
    {
      id: 'aircraft',
      label: 'Aircraft & Telemetry',
      icon: <Plane className="w-3.5 h-3.5" />,
      badge: incident.aircraft.length,
    },
    {
      id: 'evidence',
      label: 'Evidence & Findings',
      icon: <FileText className="w-3.5 h-3.5" />,
      badge: incident.evidence.length,
    },
  ];

  const handleOpenAssistant = () => {
    setIsAssistantOpen(true);
    setIsAssistantExpanded(false);
  };

  const handleNavigateToEvidence = (evidenceId: string) => {
    setHighlightedEvidenceId(evidenceId);
    setActiveSection('evidence');
  };

  return (
    <div className="max-w-[1640px] mx-auto space-y-6 pb-12">
      {/* Top Section: Incident Header & Executive Summary */}
      <IncidentHeader incident={incident} />

      {/* Workspace Section Navigation Bar & Assistant Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="overflow-x-auto">
          <Tabs
            tabs={workspaceTabs}
            activeTab={activeSection}
            onChange={(sec) => {
              setActiveSection(sec);
              if (incident) {
                historyService.recordIncidentVisit({
                  incidentId: incident.id,
                  incidentTitle: incident.title,
                  section: sec,
                });
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant={isAssistantOpen ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              if (isAssistantExpanded) {
                setIsAssistantExpanded(false);
              } else {
                setIsAssistantOpen(!isAssistantOpen);
              }
            }}
            leftIcon={
              isAssistantOpen ? (
                <PanelRightClose className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )
            }
          >
            {isAssistantOpen ? 'Hide Assistant' : 'Open Research Assistant'}
          </Button>
        </div>
      </div>

      {/* Main Dual-Panel Workspace Layout */}
      {isAssistantExpanded ? (
        <div className="h-[calc(100vh-190px)] min-h-[580px]">
          <AssistantChatPanel
            incidentId={incident.id}
            incidentTitle={incident.title}
            isExpanded={true}
            onToggleExpand={() => setIsAssistantExpanded(false)}
            onClose={() => setIsAssistantOpen(false)}
            onNavigateToEvidenceTab={handleNavigateToEvidence}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Dossier Sections */}
          <div
            className={
              isAssistantOpen
                ? 'lg:col-span-7 xl:col-span-7 space-y-6'
                : 'lg:col-span-12 space-y-6 max-w-7xl mx-auto w-full'
            }
          >
            <motion.div
              key={activeSection}
              initial="hidden"
              animate="visible"
              variants={staggerContainer(0.05)}
              className="space-y-8"
            >
              {(activeSection === 'all' || activeSection === 'timeline') && (
                <motion.section variants={slideUp} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-obsidian-950/12 pb-2">
                    <h2 className="font-heading text-lg font-bold text-obsidian-950 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-obsidian-950" />
                      Chronological Sequence of Events
                    </h2>
                    <Badge variant="mono" size="sm">
                      TIMELINE
                    </Badge>
                  </div>
                  <IncidentTimeline
                    events={incident.timeline}
                    onSelectEvent={(evt) => {
                      const matchingEv = incident.evidence.find(
                        (e) =>
                          (evt.sourceReference?.section &&
                            e.source.section === evt.sourceReference.section) ||
                          e.provenance === evt.provenance
                      );
                      if (matchingEv) {
                        setHighlightedEvidenceId(matchingEv.id);
                      }
                    }}
                  />
                </motion.section>
              )}

              {(activeSection === 'all' || activeSection === 'aircraft') && (
                <motion.section variants={slideUp} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-obsidian-950/12 pb-2">
                    <h2 className="font-heading text-lg font-bold text-obsidian-950 flex items-center gap-2">
                      <Plane className="w-4 h-4 text-obsidian-950" />
                      Aircraft Flight Information & Configuration
                    </h2>
                    <Badge variant="mono" size="sm">
                      AIRCRAFT
                    </Badge>
                  </div>
                  <AircraftInfoPanel aircraftList={incident.aircraft} />
                </motion.section>
              )}

              {(activeSection === 'all' || activeSection === 'evidence') && (
                <motion.section variants={slideUp} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-obsidian-950/12 pb-2">
                    <h2 className="font-heading text-lg font-bold text-obsidian-950 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-obsidian-950" />
                      Evidence Dossier & Official Findings
                    </h2>
                    <Badge variant="mono" size="sm">
                      EVIDENCE
                    </Badge>
                  </div>
                  <EvidenceFindingsPanel
                    evidenceList={incident.evidence}
                    highlightedEvidenceId={highlightedEvidenceId}
                  />
                </motion.section>
              )}

              {!isAssistantOpen && (
                <motion.section variants={slideUp} className="space-y-3 pt-2">
                  <AssistantEntryPanel
                    incident={incident}
                    onOpenAssistant={handleOpenAssistant}
                  />
                </motion.section>
              )}
            </motion.div>
          </div>

          {/* Right Column: Conversational Assistant Dock */}
          {isAssistantOpen && (
            <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-4 h-[620px] lg:h-[calc(100vh-165px)] min-h-[520px]">
              <AssistantChatPanel
                incidentId={incident.id}
                incidentTitle={incident.title}
                isExpanded={false}
                onToggleExpand={() => setIsAssistantExpanded(true)}
                onClose={() => setIsAssistantOpen(false)}
                onNavigateToEvidenceTab={handleNavigateToEvidence}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
