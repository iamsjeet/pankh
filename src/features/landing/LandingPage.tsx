import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileSearch,
  MessageSquareText,
  Plane,
  BarChart3,
  ArrowRight,
  ShieldAlert,
  Layers,
  Cpu,
  Database,
  GitBranch,
  SearchCheck,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { fadeIn, slideUp, staggerContainer } from '@/animations/variants';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col relative overflow-x-hidden bg-tactical-grid">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="h-16 border-b border-navy-800/80 px-4 sm:px-6 lg:px-12 flex items-center justify-between backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-panel bg-navy-900 border border-cyan-500/40 flex items-center justify-center shadow-glow-cyan-sm">
            <img src="/pankh-logo.svg" alt="PANKH" className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-bold text-base tracking-wider text-white">
              PANKH
            </span>
            <span className="ml-2 px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 text-2xs font-mono hidden sm:inline-block">
              RESEARCH MVP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink to="/app/investigations">
            <Button variant="ghost" size="sm" leftIcon={<FileSearch className="w-3.5 h-3.5" />}>
              <span className="hidden sm:inline">Incident Library</span>
              <span className="sm:hidden">Library</span>
            </Button>
          </NavLink>
          <NavLink to="/app/mission-control">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Launch Platform
            </Button>
          </NavLink>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20 flex flex-col items-center text-center relative z-10 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.1)}
          className="flex flex-col items-center"
        >
          {/* Tactical Status Pill */}
          <motion.div variants={fadeIn} className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-900/90 border border-cyan-500/30 text-2xs sm:text-xs font-mono text-cyan-300 shadow-glow-cyan-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Aviation Incident Investigation & Interactive Learning Platform</span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={slideUp}
            className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl leading-tight"
          >
            Investigate historical incidents.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-aviation-400 to-cyan-300">
              Explore evidence.
            </span>{' '}
            Simulate decisions.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={slideUp}
            className="mt-5 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed"
          >
            PANKH is an academic and portfolio aviation safety research platform. Explore documented
            investigation reports, query curated evidence with a deterministic assistant, and step
            through branching decision scenarios.
          </motion.p>

          {/* Academic Notice Banner */}
          <motion.div
            variants={slideUp}
            className="mt-6 max-w-2xl p-3.5 rounded-panel bg-navy-900/80 border border-amber-500/30 text-amber-200/90 text-2xs font-mono flex items-start sm:items-center gap-2.5 text-left"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Research Prototype Disclaimer:</strong> PANKH is an academic portfolio project,
              not certified operational aviation software. It does not connect to live ATC feeds,
              real-time aircraft tracking, production LLMs, or trained RL agents.
            </span>
          </motion.div>

          {/* Action CTAs */}
          <motion.div variants={slideUp} className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <NavLink to="/app/investigations">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Incident Library
              </Button>
            </NavLink>
            <NavLink to="/app/mission-control">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Compass className="w-4 h-4 text-cyan-400" />}
              >
                Enter Mission Control
              </Button>
            </NavLink>
          </motion.div>
        </motion.div>

        {/* Platform Overview: Five Core Capabilities */}
        <section className="mt-20 w-full text-left">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-2xs font-mono uppercase tracking-widest text-cyan-400">
                Platform Overview
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1">
                Five Integrated Research Capabilities
              </h2>
            </div>
            <span className="text-2xs font-mono text-slate-400">
              DETERMINISTIC • EVIDENCE-LINKED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <NavLink to="/app/investigations" className="block group">
              <Panel
                variant="default"
                className="h-full group-hover:border-cyan-500/40 transition-all"
                badge={<Badge variant="active" size="sm">01</Badge>}
                title="Incident Investigation"
                subtitle="LIBRARY"
              >
                <FileSearch className="w-5 h-5 text-cyan-400 mb-2" />
                <p className="text-2xs text-slate-400 leading-relaxed">
                  Browse historically sourced cases (Überlingen 2002, AF447, Charkhi Dadri 1996) and
                  benchmarked demos.
                </p>
              </Panel>
            </NavLink>

            <NavLink to="/app/investigations/HIST-2002-UBL" className="block group">
              <Panel
                variant="default"
                className="h-full group-hover:border-cyan-500/40 transition-all"
                badge={<Badge variant="active" size="sm">02</Badge>}
                title="Evidence Exploration"
                subtitle="WORKSPACE"
              >
                <SearchCheck className="w-5 h-5 text-cyan-400 mb-2" />
                <p className="text-2xs text-slate-400 leading-relaxed">
                  Inspect chronological timelines, official findings, contributing factors, and direct
                  links to primary authority reports.
                </p>
              </Panel>
            </NavLink>

            <NavLink to="/app/investigations/HIST-2002-UBL" className="block group">
              <Panel
                variant="default"
                className="h-full group-hover:border-amber-500/40 transition-all"
                badge={<Badge variant="warning" size="sm">03</Badge>}
                title="AI Assistant"
                subtitle="CURATED Q&A"
              >
                <MessageSquareText className="w-5 h-5 text-amber-400 mb-2" />
                <p className="text-2xs text-slate-400 leading-relaxed">
                  Ask natural-language questions powered by a deterministic, evidence-cited knowledge
                  engine with honest fallbacks.
                </p>
              </Panel>
            </NavLink>

            <NavLink to="/app/simulation/HIST-2002-UBL" className="block group">
              <Panel
                variant="default"
                className="h-full group-hover:border-emerald-500/40 transition-all"
                badge={<Badge variant="nominal" size="sm">04</Badge>}
                title="Interactive Simulation"
                subtitle="PLAYBACK"
              >
                <Plane className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-2xs text-slate-400 leading-relaxed">
                  Step through deterministic 2D airspace playback, encounter decision checkpoints, and
                  test branching outcomes.
                </p>
              </Panel>
            </NavLink>

            <NavLink to="/app/my-investigations" className="block group">
              <Panel
                variant="default"
                className="h-full group-hover:border-crimson-500/40 transition-all"
                badge={<Badge variant="critical" size="sm">05</Badge>}
                title="Outcome Analysis"
                subtitle="DEBRIEF & HISTORY"
              >
                <BarChart3 className="w-5 h-5 text-crimson-400 mb-2" />
                <p className="text-2xs text-slate-400 leading-relaxed">
                  Review separation metrics, compare your branch against historical actions, and
                  revisit saved sessions.
                </p>
              </Panel>
            </NavLink>
          </div>
        </section>

        {/* How It Works: User Journey */}
        <section className="mt-16 w-full text-left">
          <div className="mb-6">
            <span className="text-2xs font-mono uppercase tracking-widest text-cyan-400">
              Workflow
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1">
              How It Works
            </h2>
          </div>

          <div className="p-5 sm:p-6 rounded-panel bg-navy-900/60 border border-navy-700/60 grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Select Incident', desc: 'Choose a historical case from the Incident Library.' },
              { step: '02', title: 'Inspect Evidence', desc: 'Review the timeline, findings, and primary report PDFs.' },
              { step: '03', title: 'Query Assistant', desc: 'Explore causes and factors with cited evidence.' },
              { step: '04', title: 'Run Simulation', desc: 'Make a decision at the critical conflict checkpoint.' },
              { step: '05', title: 'Review Debrief', desc: 'Compare outcomes and track progress in My Investigations.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-1.5 border-l-2 border-cyan-500/30 pl-3">
                <span className="text-2xs font-mono text-cyan-400 font-semibold">STEP {item.step}</span>
                <span className="text-sm font-semibold text-white">{item.title}</span>
                <span className="text-2xs text-slate-400 leading-relaxed">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Research & Technology */}
        <section className="mt-12 w-full text-left">
          <div className="p-5 sm:p-6 rounded-panel bg-navy-900/40 border border-navy-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <span className="text-2xs font-mono uppercase tracking-widest text-cyan-400">
                Research & Technology
              </span>
              <h3 className="font-heading text-lg font-bold text-white">
                Clean, Replaceable Frontend Architecture
              </h3>
              <p className="text-2xs sm:text-xs text-slate-400 leading-relaxed">
                Built with React, Vite, and TypeScript. Service interfaces (`incidentService`,
                `assistantService`, `simulationService`, `historyService`) decouple UI components
                from local deterministic data so future LLM/RAG or physics backends can be swapped in cleanly.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-2xs font-mono text-slate-300 shrink-0">
              <div className="flex items-center gap-2 bg-navy-950/60 px-3 py-2 rounded border border-navy-800">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>React + Vite + TS</span>
              </div>
              <div className="flex items-center gap-2 bg-navy-950/60 px-3 py-2 rounded border border-navy-800">
                <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Curated Evidence</span>
              </div>
              <div className="flex items-center gap-2 bg-navy-950/60 px-3 py-2 rounded border border-navy-800">
                <GitBranch className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Branching Playback</span>
              </div>
              <div className="flex items-center gap-2 bg-navy-950/60 px-3 py-2 rounded border border-navy-800">
                <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Service-Decoupled</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-800/80 py-6 px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-2xs font-mono text-slate-500 gap-3">
        <span>© PANKH AVIATION SAFETY RESEARCH PLATFORM</span>
        <span>ACADEMIC PORTFOLIO PROTOTYPE • NON-OPERATIONAL</span>
      </footer>
    </div>
  );
};
