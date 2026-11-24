import React, { Suspense, lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LandingPage } from '@/features/landing/LandingPage';

// Lazy-loaded feature pages for optimal initial bundle size
const MissionControlPage = lazy(() =>
  import('@/features/mission-control/MissionControlPage').then((m) => ({ default: m.MissionControlPage }))
);
const IncidentLibraryPage = lazy(() =>
  import('@/features/incidents/pages/IncidentLibraryPage').then((m) => ({ default: m.IncidentLibraryPage }))
);
const InvestigationWorkspacePage = lazy(() =>
  import('@/features/investigations/pages/InvestigationWorkspacePage').then((m) => ({
    default: m.InvestigationWorkspacePage,
  }))
);
const SimulationExperiencePage = lazy(() =>
  import('@/features/simulation').then((m) => ({ default: m.SimulationExperiencePage }))
);
const MyInvestigationsPage = lazy(() =>
  import('@/features/history').then((m) => ({ default: m.MyInvestigationsPage }))
);
const ScenarioForgePage = lazy(() =>
  import('@/features/scenario-forge/ScenarioForgePage').then((m) => ({ default: m.ScenarioForgePage }))
);
const SimulationLabPage = lazy(() =>
  import('@/features/simulation-lab/SimulationLabPage').then((m) => ({ default: m.SimulationLabPage }))
);
const ExperimentsPage = lazy(() =>
  import('@/features/experiments/ExperimentsPage').then((m) => ({ default: m.ExperimentsPage }))
);
const SettingsPage = lazy(() =>
  import('@/features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const DesignSystemPage = lazy(() =>
  import('@/features/design-system/DesignSystemPage').then((m) => ({ default: m.DesignSystemPage }))
);

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
    <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
    <span>Loading research module...</span>
  </div>
);

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{node}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/mission-control" replace />,
      },
      {
        path: 'mission-control',
        element: withSuspense(<MissionControlPage />),
      },
      {
        path: 'investigations',
        element: withSuspense(<IncidentLibraryPage />),
      },
      {
        path: 'investigations/:incidentId',
        element: withSuspense(<InvestigationWorkspacePage />),
      },
      {
        path: 'my-investigations',
        element: withSuspense(<MyInvestigationsPage />),
      },
      {
        path: 'incidents',
        element: <Navigate to="/app/investigations" replace />,
      },
      {
        path: 'incidents/:incidentId',
        element: withSuspense(<InvestigationWorkspacePage />),
      },
      {
        path: 'scenario-forge',
        element: withSuspense(<ScenarioForgePage />),
      },
      {
        path: 'simulation-lab',
        element: withSuspense(<SimulationLabPage />),
      },
      {
        path: 'simulation',
        element: <Navigate to="/app/simulation/HIST-2002-UBL" replace />,
      },
      {
        path: 'simulation/:incidentId',
        element: withSuspense(<SimulationExperiencePage />),
      },
      {
        path: 'experiments',
        element: withSuspense(<ExperimentsPage />),
      },
      {
        path: 'settings',
        element: withSuspense(<SettingsPage />),
      },
      {
        path: 'design-system',
        element: withSuspense(<DesignSystemPage />),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
