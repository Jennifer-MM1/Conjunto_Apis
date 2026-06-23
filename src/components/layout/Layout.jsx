import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ParticleBackground3D } from '../ui/ParticleBackground3D';

export const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 dark:bg-slate-950 text-slate-100 theme-transition relative">
      {/* Background Interactive Particles */}
      <ParticleBackground3D />

      {/* Navigation Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpen={isMobileOpen}
        setIsOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Top Navigation */}
        <Topbar onMenuClick={() => setIsMobileOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto px-6 py-8 scrollbar-thin scrollbar-thumb-slate-900 bg-slate-950/40">
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
