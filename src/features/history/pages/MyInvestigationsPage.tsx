import React, { useState, useEffect } from 'react';
import {
  FileSearch,
  Plane,
  Search,
} from 'lucide-react';
import { historyService } from '../services/historyService';
import {
  InvestigationProgress,
  SimulationAttempt,
  UserActivityStats,
} from '../types/history';
import { UserActivityHeader } from '../components/UserActivityHeader';
import { IncidentHistoryList } from '../components/IncidentHistoryList';
import { SimulationHistoryList } from '../components/SimulationHistoryList';
import { HistoryEmptyState } from '../components/HistoryEmptyState';
import { Tabs } from '@/components/ui/Tabs';

export const MyInvestigationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'incidents' | 'simulations'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [investigations, setInvestigations] = useState<InvestigationProgress[]>([]);
  const [simulations, setSimulations] = useState<SimulationAttempt[]>([]);
  const [stats, setStats] = useState<UserActivityStats>({
    totalIncidentsOpened: 0,
    totalSimulationsRun: 0,
    completedSimulations: 0,
    safeOutcomesCount: 0,
    hazardousOutcomesCount: 0,
    totalDecisionsMade: 0,
    assistantQuestionsTotal: 0,
    lastActivityTimestamp: null,
  });

  const loadData = () => {
    const inv = historyService.getIncidentHistories();
    const sim = historyService.getSimulationAttempts();
    const st = historyService.getAggregateStats();
    setInvestigations(inv);
    setSimulations(sim);
    setStats(st);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to reset all stored investigation and simulation history?')) {
      historyService.clearAllHistory();
      loadData();
    }
  };

  // Filter based on search query
  const filteredInvestigations = investigations.filter(
    (item) =>
      item.incidentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.incidentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSimulations = simulations.filter(
    (item) =>
      item.scenarioId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.incidentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scenarioTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.selectedBranchId && item.selectedBranchId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isEmpty = investigations.length === 0 && simulations.length === 0;

  const tabItems = [
    {
      id: 'all',
      label: 'All Activity',
      badge: `${investigations.length + simulations.length}`,
    },
    {
      id: 'incidents',
      label: 'Incident Dossiers',
      badge: `${investigations.length}`,
    },
    {
      id: 'simulations',
      label: 'Simulation Attempts & Debriefs',
      badge: `${simulations.length}`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* 1. Header & Summary Stats */}
      <UserActivityHeader stats={stats} onClearHistory={handleClearHistory} />

      {/* 2. Empty State Check */}
      {isEmpty ? (
        <HistoryEmptyState />
      ) : (
        <div className="space-y-6">
          {/* 3. Filter Bar & Tabs Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <Tabs
              tabs={tabItems}
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id as any)}
            />

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by ID or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-900 border border-navy-700/80 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-2xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 4. Active Tab Content */}
          {activeTab === 'all' && (
            <div className="space-y-8">
              {/* Simulations Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    Simulation Sessions ({filteredSimulations.length})
                  </h2>
                </div>
                <SimulationHistoryList attempts={filteredSimulations} />
              </div>

              {/* Incidents Section */}
              <div className="space-y-4 pt-4 border-t border-navy-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-aviation-400 flex items-center gap-2">
                    <FileSearch className="w-4 h-4" />
                    Investigated Incident Dossiers ({filteredInvestigations.length})
                  </h2>
                </div>
                <IncidentHistoryList records={filteredInvestigations} />
              </div>
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="space-y-4">
              <IncidentHistoryList records={filteredInvestigations} />
            </div>
          )}

          {activeTab === 'simulations' && (
            <div className="space-y-4">
              <SimulationHistoryList attempts={filteredSimulations} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
