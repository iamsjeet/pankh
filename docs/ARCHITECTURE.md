# PANKH — Frontend Architecture

## 1. Module Structure

PANKH is organized into feature-based modules under `src/features/`, supported by shared UI primitives in `src/components/ui/` and layout shells in `src/components/layout/`:

- `src/features/landing/`: Public landing page and product overview.
- `src/features/incidents/`: Incident Library, data models (`Incident`, `EvidenceItem`, `TimelineEvent`), and `incidentService`.
- `src/features/investigations/`: Investigation Workspace, `IncidentHeader`, `IncidentTimeline`, and `EvidenceFindingsPanel`.
- `src/features/assistant/`: Deterministic AI Investigation Assistant, curated knowledge base (`curatedKnowledge.ts`), and `assistantService`.
- `src/features/simulation/`: Deterministic 2D playback engine, decision checkpoints, branching scenarios (`simulationScenarios.ts`), and `SimulationDebrief`.
- `src/features/history/`: `MyInvestigationsPage` and `localStorage` persistence (`historyService`).
- `src/features/mission-control/`: Illustrative frontend radar visualization (visually and logically separate from the simulation engine).
- `src/features/design-system/` & `src/features/settings/`: Token showcase and UI preferences.

## 2. Data Models & Service Layer

UI components do not import raw data files directly; they communicate through typed service interfaces:

- **`IIncidentService`** (`src/features/incidents/services/incidentService.ts`): Provides filtering, stats, and `getIncidentById(id)` with `INCIDENT_ALIAS_MAP` for backward compatibility (`DEMO-2002-UBL` → `HIST-2002-UBL`).
- **`IAssistantService`** (`src/features/assistant/services/assistantService.ts`): Deterministic keyword/intent matching against `CURATED_ANSWERS` with 100% evidence ID citation resolution.
- **`ISimulationService`** (`src/features/simulation/services/simulationService.ts`): Resolves `SimulationScenario` objects containing `initialFrames`, `checkpoints`, and `branches`.
- **`IHistoryStorageService`** (`src/features/history/services/historyService.ts`): Manages `pankh_v1_investigations` and `pankh_v1_simulations` in `localStorage` with safe JSON parsing.

## 3. Performance & Code Splitting

- All `/app/*` feature routes are lazy-loaded via `React.lazy()` and `Suspense` in `src/routes/routes.tsx`.
- Vite `manualChunks` splits vendor, UI, and 3D dependencies to keep individual chunks well below 500 kB.
- Animations respect `prefers-reduced-motion: reduce` in `src/index.css`.

## 4. Future Backend Integration

Because all data access is encapsulated behind `IIncidentService`, `IAssistantService`, `ISimulationService`, and `IHistoryStorageService`, a future FastAPI + PostgreSQL backend, LLM/RAG pipeline, or physics simulator can replace the local implementations without altering UI components.
