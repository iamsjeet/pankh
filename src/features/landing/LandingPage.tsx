import React, { Suspense, lazy, useRef, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ShieldAlert, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { KineticText } from '@/components/ui/KineticText';
import { InteractiveSurface } from '@/components/ui/InteractiveSurface';
import { CURATED_INCIDENTS } from '@/features/incidents/data/mockIncidents';
import { useReducedMotion } from '@/animations/useReducedMotion';

const AerospaceOrbitalScene = lazy(() =>
  import('./components/AerospaceOrbitalScene').then((m) => ({ default: m.AerospaceOrbitalScene }))
);

const INCIDENT_MOTIFS: Record<string, React.ReactNode> = {
  'HIST-2002-UBL': (
    <svg viewBox="0 0 120 60" className="w-28 h-14 shrink-0" aria-hidden="true">
      <line x1="10" y1="30" x2="110" y2="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="60" y1="6" x2="60" y2="54" stroke="#6E9436" strokeWidth="1.75" />
      <circle cx="60" cy="30" r="4" fill="#88B04B" stroke="#17191B" strokeWidth="1.5" />
    </svg>
  ),
  'HIST-2009-AF447': (
    <svg viewBox="0 0 120 60" className="w-28 h-14 shrink-0" aria-hidden="true">
      <path d="M 10 38 Q 45 10 68 24 T 110 52" fill="none" stroke="#6E9436" strokeWidth="1.75" />
      <circle cx="68" cy="24" r="3.5" fill="#88B04B" stroke="#17191B" strokeWidth="1.5" />
    </svg>
  ),
  'HIST-1996-CHRK': (
    <svg viewBox="0 0 120 60" className="w-28 h-14 shrink-0" aria-hidden="true">
      <line x1="10" y1="24" x2="110" y2="24" stroke="currentColor" strokeWidth="1.25" />
      <line x1="110" y1="36" x2="10" y2="36" stroke="#6E9436" strokeWidth="1.75" />
      <circle cx="55" cy="36" r="3.5" fill="#DC2626" />
    </svg>
  ),
};

export const LandingPage: React.FC = () => {
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const scrollProgressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('pankh_intro_seen');
  });

  const historicalIncidents = CURATED_INCIDENTS.filter((inc) => !inc.provenance.isDemo);

  useEffect(() => {
    if (!showIntro || reducedMotion) {
      setShowIntro(false);
      return;
    }
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('pankh_intro_seen', '1');
      setShowIntro(false);
    }, 1050);
    return () => window.clearTimeout(timer);
  }, [showIntro, reducedMotion]);

  const dismissIntro = () => {
    sessionStorage.setItem('pankh_intro_seen', '1');
    setShowIntro(false);
  };

  const { scrollYProgress } = useScroll({
    target: scrollStageRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      scrollProgressRef.current = v;
    });
  }, [scrollYProgress]);

  const handleHeroPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !wordmarkRef.current) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = ((e.clientX - rect.left) / rect.width - 0.5) * -14;
    const dy = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    wordmarkRef.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  };

  // Continuous scroll transforms across Sections 01 -> 02
  const sec1Opacity = useTransform(scrollYProgress, [0, 0.34, 0.48], [1, 0.9, 0]);
  const sec1Y = useTransform(scrollYProgress, [0, 0.45], [0, -70]);
  const sec2Opacity = useTransform(scrollYProgress, [0.42, 0.56, 0.88, 1], [0, 1, 1, 0.4]);
  const sec2Y = useTransform(scrollYProgress, [0.42, 0.62], [32, 0]);

  return (
    <div className="min-h-screen bg-sand-50 text-obsidian-950 flex flex-col selection:bg-[#88B04B] selection:text-obsidian-950">
      {/* Optional, Skippable 1s Cinematic Opening */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 z-50 bg-obsidian-950 text-sand-50 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.35em' }}
              animate={{ opacity: 1, letterSpacing: '0.08em' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-5xl sm:text-7xl font-bold tracking-wider text-sand-50"
            >
              PANKH
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-36 h-0.5 bg-[#88B04B] mt-3 origin-left"
            />
            <button
              type="button"
              onClick={dismissIntro}
              className="mt-8 text-2xs font-mono uppercase tracking-widest text-stone-400 hover:text-[#A8C96D] transition-colors"
            >
              Skip Opening →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal Floating Navigation */}
      <header className="fixed top-0 inset-x-0 z-40 px-4 sm:px-8 pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto h-13 py-2.5 px-5 rounded-card bg-obsidian-950/80 backdrop-blur-md border border-white/10 shadow-editorial-dark flex items-center justify-between pointer-events-auto text-sand-50">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-subtle bg-sand-50 flex items-center justify-center">
              <img src="/pankh-logo.svg" alt="PANKH" className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-sm tracking-widest uppercase">
              PANKH
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-stone-400">
            <a href="#investigations" className="hover:text-sand-50 transition-colors">
              Archive
            </a>
            <a href="#simulation" className="hover:text-sand-50 transition-colors">
              Simulation
            </a>
            <a href="#enter" className="hover:text-sand-50 transition-colors">
              Platform
            </a>
          </nav>

          <NavLink to="/app/mission-control">
            <Button
              variant="outline"
              size="sm"
              magnetic
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="border-white/25 text-sand-50 hover:bg-[#88B04B] hover:text-obsidian-950 hover:border-[#88B04B]"
            >
              Enter Platform
            </Button>
          </NavLink>
        </div>
      </header>

      {/* SECTIONS 01 & 02: ASYMMETRIC CONTINUOUS 3D GLOBE SCROLL STAGE */}
      <div
        ref={scrollStageRef}
        onPointerMove={handleHeroPointerMove}
        className="relative h-[200vh] bg-obsidian-950 text-sand-50"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Interactive Dark Sage-Green-Edged 3D Globe (positioned right-center) */}
          <div className="absolute inset-0 z-0">
            <Suspense fallback={null}>
              <AerospaceOrbitalScene
                scrollProgressRef={scrollProgressRef}
                className="w-full h-full"
              />
            </Suspense>
          </div>

          {/* Left-weighted editorial vignette for crisp wordmark contrast */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(23,25,27,0.88) 0%, rgba(23,25,27,0.42) 48%, rgba(23,25,27,0.18) 100%)',
            }}
          />

          <div className="hidden 2xl:flex absolute right-4 top-24 bottom-24 items-center z-10 writing-vertical text-2xs font-mono tracking-[0.28em] text-stone-500/80 uppercase pointer-events-none">
            HOVER ORBITS • CLICK TRACKERS • DRAG GLOBE
          </div>

          {/* SECTION 01 — ASYMMETRIC MONUMENTAL HERO */}
          <motion.div
            style={{ y: sec1Y, opacity: sec1Opacity }}
            className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col justify-between pt-24 pb-12 pointer-events-none"
          >
            {/* Top Header Annotation */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="block text-2xs font-mono uppercase tracking-[0.25em] text-[#A8C96D]">
                  01 / AVIATION SAFETY INTELLIGENCE
                </span>
                <span className="block text-xs font-serif italic text-stone-400">
                  Where every flight tells a story
                </span>
              </div>
              <span className="hidden sm:block text-2xs font-mono text-stone-500">
                47°46′N 09°10′E • FL360
              </span>
            </div>

            {/* Left-Anchored Monumental PANKH Wordmark (Zero Collision with Globe) */}
            <div className="my-auto max-w-2xl select-none space-y-5">
              <h1
                ref={wordmarkRef}
                className="font-heading font-bold tracking-[-0.055em] leading-[0.84] text-[20vw] sm:text-[14vw] lg:text-[9.75rem] xl:text-[11.25rem] text-sand-50 transition-transform duration-200 ease-out will-change-transform"
              >
                <motion.span
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  PANKH
                </motion.span>
              </h1>

              <div className="w-24 h-px bg-[#88B04B]" />

              <p className="font-mono text-xs sm:text-sm tracking-[0.22em] uppercase text-[#A8C96D]">
                INVESTIGATE. UNDERSTAND. SIMULATE.
              </p>

              <p className="text-sm text-stone-300 max-w-md leading-relaxed">
                Historical aviation accident dossiers, traceable primary evidence, and interactive
                3D decision pathways.
              </p>
            </div>

            {/* Bottom CTA Row with Generous Breathing Room */}
            <div className="flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
              <div className="flex flex-wrap items-center gap-3.5">
                <NavLink to="/app/investigations">
                  <Button
                    variant="primary"
                    size="lg"
                    magnetic
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="bg-[#88B04B] text-obsidian-950 border-[#88B04B] hover:bg-[#769B3D] font-semibold"
                  >
                    Explore Incidents
                  </Button>
                </NavLink>
                <NavLink to="/app/simulation/HIST-2002-UBL">
                  <Button
                    variant="outline"
                    size="lg"
                    magnetic
                    className="border-white/25 text-sand-50 hover:bg-white/10"
                  >
                    Enter 3D Simulation
                  </Button>
                </NavLink>
              </div>

              <span className="hidden sm:inline-block text-2xs font-mono uppercase tracking-widest text-stone-400">
                Scroll to zoom into trajectories ↓
              </span>
            </div>
          </motion.div>

          {/* SECTION 02 — THE AVIATION INTELLIGENCE ENVIRONMENT */}
          <motion.div
            style={{ opacity: sec2Opacity, y: sec2Y }}
            className="absolute inset-0 z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col justify-center pointer-events-none"
          >
            <div className="max-w-lg bg-obsidian-950/92 backdrop-blur-md border border-white/15 rounded-card p-7 sm:p-9 space-y-4 pointer-events-auto shadow-editorial-dark">
              <span className="text-2xs font-mono uppercase tracking-widest text-[#A8C96D]">
                02 / Aviation Intelligence Environment
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-sand-50 leading-[1.05]">
                Every trajectory holds a{' '}
                <span className="font-serif italic font-normal text-[#A8C96D]">decision</span>.
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                From conflicting TCAS vs. ATC instructions over Lake Constance to pitot icing over
                the Atlantic and bidirectional airway convergence near Delhi—explore official findings
                and test alternative choices.
              </p>
              <div className="pt-1">
                <a
                  href="#investigations"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#A8C96D] hover:underline"
                >
                  Inspect Three Landmark Cases <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* KINETIC TYPOGRAPHY TRANSITION */}
      <div className="py-10 border-b border-obsidian-950/10 overflow-hidden select-none">
        <KineticText
          range={60}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight whitespace-nowrap text-outline-dark"
        >
          ÜBERLINGEN 2002 • AIR FRANCE 447 • CHARKHI DADRI 1996 • EVIDENCE-LINKED RESEARCH •
        </KineticText>
      </div>

      {/* SECTION 03 — INCIDENT ARCHIVE */}
      <section id="investigations" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-obsidian-950/15">
          <div>
            <span className="text-2xs font-mono uppercase tracking-widest text-stone-500">
              03 / Incident Archive
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-obsidian-950 mt-2">
              Three Landmark <span className="font-serif italic font-normal">Investigations</span>
            </h2>
          </div>
          <NavLink to="/app/investigations">
            <Button variant="outline" size="sm" magnetic rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
              Open Full Archive
            </Button>
          </NavLink>
        </div>

        <div className="divide-y divide-obsidian-950/12">
          {historicalIncidents.map((incident, idx) => (
            <NavLink
              key={incident.id}
              to={`/app/investigations/${incident.id}`}
              data-cursor="inspect"
              className="block group"
            >
              <InteractiveSurface
                tilt={false}
                spotlight
                className="py-9 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-card transition-colors hover:bg-sand-25 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-2 flex items-baseline gap-4">
                  <span className="font-serif italic text-4xl sm:text-5xl text-stone-400 group-hover:text-obsidian-950 transition-colors">
                    0{idx + 1}
                  </span>
                  <div className="font-mono text-2xs text-stone-500">
                    <div className="text-obsidian-950 font-semibold">{incident.date.slice(0, 4)}</div>
                    <div>{incident.id}</div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-obsidian-950 group-hover:translate-x-1.5 transition-transform">
                    {incident.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 opacity-75 group-hover:opacity-100 transition-opacity">
                    {incident.summary}
                  </p>
                </div>

                <div className="lg:col-span-3 flex items-center justify-start lg:justify-center text-stone-600">
                  {INCIDENT_MOTIFS[incident.id]}
                </div>

                <div className="lg:col-span-2 flex items-center justify-end">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-obsidian-950 px-3.5 py-2 rounded-subtle bg-sand-100 group-hover:bg-[#88B04B] group-hover:text-obsidian-950 transition-colors">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </InteractiveSurface>
            </NavLink>
          ))}
        </div>
      </section>

      {/* SECTION 04 — SIMULATION */}
      <section
        id="simulation"
        className="mx-3 sm:mx-6 lg:mx-10 rounded-[24px] bg-obsidian-950 text-sand-50 border border-obsidian-800 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-2xs font-mono uppercase tracking-widest text-[#A8C96D]">
              04 / Simulation
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-sand-50 leading-tight">
              Step into the{' '}
              <span className="font-serif italic font-normal text-[#A8C96D]">3D airspace</span>.
            </h2>
            <p className="text-sm sm:text-base text-stone-400 leading-relaxed max-w-md">
              Observe converging aircraft in 3D space, pause at critical conflict checkpoints, and
              compare branching outcomes against documented history.
            </p>
            <div className="pt-2">
              <NavLink to="/app/simulation/HIST-2002-UBL">
                <Button
                  variant="primary"
                  size="lg"
                  magnetic
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-[#88B04B] text-obsidian-950 border-[#88B04B] hover:bg-[#769B3D] font-semibold"
                >
                  Launch 3D Simulation
                </Button>
              </NavLink>
            </div>
          </div>

          <div className="lg:col-span-6 bg-obsidian-850 border border-white/10 rounded-card p-6 sm:p-8">
            <div className="flex items-center justify-between text-2xs font-mono text-stone-400 mb-4">
              <span>SCEN-2002-UBL • VERTICAL SEPARATION</span>
              <span className="text-[#A8C96D]">T+00:45 CHECKPOINT</span>
            </div>
            <svg viewBox="0 0 420 190" className="w-full h-auto" aria-hidden="true">
              <line x1="20" y1="95" x2="400" y2="95" stroke="rgba(243,241,235,0.12)" strokeDasharray="4 4" />
              <path d="M 20 95 L 180 95" stroke="#F3F1EB" strokeWidth="2.5" />
              <path d="M 180 95 C 240 95 280 35 395 35" fill="none" stroke="#88B04B" strokeWidth="3" />
              <path
                d="M 180 95 C 240 95 280 155 395 155"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
              <circle cx="180" cy="95" r="6" fill="#88B04B" stroke="#17191B" strokeWidth="2" />
              <text x="275" y="24" fill="#A8C96D" fontSize="11" fontFamily="JetBrains Mono">
                TCAS CLIMB (+1,700 FT)
              </text>
              <text x="275" y="174" fill="#F87171" fontSize="11" fontFamily="JetBrains Mono">
                ATC DESCENT (CONFLICT)
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* SECTION 05 — ENTER PANKH */}
      <section id="enter" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 w-full space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-obsidian-950/12 pb-12">
          <div className="space-y-3">
            <span className="text-2xs font-mono uppercase tracking-widest text-stone-500">
              05 / Enter Platform
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl font-bold text-obsidian-950 tracking-tight leading-none">
              Begin your{' '}
              <span className="font-serif italic font-normal">investigation</span>.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <NavLink to="/app/investigations">
              <Button variant="primary" size="lg" magnetic rightIcon={<ArrowRight className="w-4 h-4" />}>
                Open Incident Library
              </Button>
            </NavLink>
            <NavLink to="/app/mission-control">
              <Button variant="outline" size="lg" magnetic>
                Mission Control
              </Button>
            </NavLink>
          </div>
        </div>

        <div className="p-5 rounded-card bg-sand-100 border border-obsidian-950/12 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-600 leading-relaxed">
            <strong className="text-obsidian-950">Academic Prototype Disclaimer:</strong> PANKH is a
            student research portfolio project—not certified aviation software. It uses curated
            historical dossiers (BFU, BEA, DGCA India), a deterministic Q&amp;A assistant, and
            predefined 3D playback rather than live ATC feeds or physical flight dynamics.
          </p>
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="border-t border-obsidian-950/12 bg-sand-25 py-8 px-6 lg:px-10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500">
          <div className="flex items-center gap-2 text-obsidian-950 font-semibold">
            <Compass className="w-4 h-4" />
            <span>PANKH RESEARCH STUDIO</span>
          </div>
          <div className="flex items-center gap-6">
            <NavLink to="/app/investigations" className="hover:text-obsidian-950 transition-colors">
              Incident Library
            </NavLink>
            <NavLink to="/app/simulation/HIST-2002-UBL" className="hover:text-obsidian-950 transition-colors">
              Simulation Lab
            </NavLink>
            <NavLink to="/app/my-investigations" className="hover:text-obsidian-950 transition-colors">
              My Investigations
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};
