import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageTransition } from '@/animations/PageTransition';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-navy-950 text-slate-100 font-sans">
      {/* Tactical Aerospace Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden bg-navy-900/60 bg-tactical-grid">
        {/* Top Header */}
        <Header />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>

        {/* Restrained Tactical Status Footer */}
        <footer className="h-7 bg-navy-950/90 border-t border-navy-800/80 px-4 flex items-center justify-between text-2xs font-mono text-slate-500 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">PANKH AEROSPACE INTELLIGENCE</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">SAFETY RESEARCH REPOSITORY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">NODE: ONLINE (LATENCY &lt; 8ms)</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
