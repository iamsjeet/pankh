import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageTransition } from '@/animations/PageTransition';

export const AppLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-sand-50 text-obsidian-950 font-sans">
      {/* Editorial Sidebar + Mobile Drawer */}
      <Sidebar
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden bg-sand-50 bg-tactical-grid">
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>

        {/* Restrained Research Footer */}
        <footer className="h-8 bg-sand-25 border-t border-obsidian-950/10 px-4 sm:px-6 flex items-center justify-between text-2xs font-mono text-stone-500 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <span className="text-obsidian-950 font-medium">PANKH RESEARCH STUDIO</span>
            <span className="hidden sm:inline text-stone-400">•</span>
            <span className="hidden sm:inline">NON-CERTIFIED ACADEMIC PROTOTYPE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
            <span className="text-obsidian-950">LOCAL SESSION</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
