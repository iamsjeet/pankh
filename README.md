# PANKH — Aviation Incident Investigation & Interactive Learning Platform

PANKH is an academic and portfolio-oriented aviation safety research prototype built with React, Vite, and TypeScript. It enables users to explore historically sourced aviation incidents, inspect evidence linked to official investigation reports, query a deterministic investigation assistant, and step through branching decision simulations.

> **Disclaimer:** PANKH is a non-operational academic and portfolio research prototype. It is **not** certified aviation software and does not connect to live air traffic control (ATC) feeds, real-time aircraft tracking, production LLMs, or trained reinforcement learning agents.

## Features

- **Incident Library (`/app/investigations`)**: Browse curated historical aviation incidents (`HIST-2002-UBL`, `HIST-2009-AF447`, `HIST-1996-CHRK`) alongside a clearly labeled demonstration benchmark (`DEMO-2017-SFO`), with category, severity, and search filtering.
- **Investigation Workspace (`/app/investigations/:incidentId`)**: Inspect executive summaries, chronological event timelines, official findings, contributing factors, and direct links to primary authority report PDFs.
- **AI Investigation Assistant**: Ask natural-language questions contextualized to the active incident. Powered by a deterministic, evidence-cited knowledge engine with transparent fallbacks for unsupported queries.
- **Interactive Simulation (`/app/simulation/:incidentId`)**: Step through deterministic 2D airspace playback, encounter decision checkpoints (e.g., TCAS RA vs. ATC verbal clearance), select actions, and inspect branching outcomes.
- **Outcome Analysis & My Investigations (`/app/my-investigations`)**: Review simulation debriefs, separation metrics, and persistent `localStorage` session history across browser refreshes.
- **Mission Control & Design System**: Illustrative frontend radar visualization (`/app/mission-control`) and component token reference (`/app/design-system`).

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite 5
- **Styling & UI**: Tailwind CSS, Framer Motion (with `prefers-reduced-motion` support), Lucide Icons
- **Routing**: React Router v6 with `React.lazy` route code-splitting
- **Persistence**: Client-side `localStorage` with schema-safe serialization and legacy ID alias resolution

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check and build for production
npm run build

# Preview production build
npm run preview
```

## Limitations

- **No Live Data or Physics Engine**: Simulation playback uses predefined, deterministic frame sequences and branching outcomes rather than a real-time flight dynamics engine.
- **No Production LLM / RAG**: The Investigation Assistant uses deterministic keyword and intent matching over curated incident Q&A records.
- **Client-Side Only**: All data and session persistence reside in the browser (`localStorage`); no backend database is currently connected.
