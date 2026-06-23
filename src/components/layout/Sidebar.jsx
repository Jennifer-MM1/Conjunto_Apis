import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Tv,
  Sparkles,
  Smile,
  Laugh,
  MessageSquare,
  Users,
  CloudSun,
  HeartPulse,
  Coins,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isOpen, setIsOpen }) => {
  const menuGroups = [
    {
      title: 'Principal',
      items: [
        { path: '/', name: 'Dashboard', icon: Home }
      ]
    },
    {
      title: 'Geek Hub',
      items: [
        { path: '/anime', name: 'Anime Explorer', icon: Tv },
        { path: '/pokedex', name: 'Pokédex', icon: Sparkles },
        { path: '/rickandmorty', name: 'Rick & Morty', icon: Smile },
        { path: '/jokes', name: 'Chuck Norris Jokes', icon: Laugh }
      ]
    },
    {
      title: 'Simulación de Datos',
      items: [
        { path: '/forum', name: 'Foro Social', icon: MessageSquare },
        { path: '/directory', name: 'Directorio Equipo', icon: Users }
      ]
    },
    {
      title: 'Datos en Tiempo Real',
      items: [
        { path: '/weather', name: 'Clima & Mapas', icon: CloudSun },
        { path: '/covid', name: 'COVID Analytics', icon: HeartPulse },
        { path: '/crypto', name: 'Crypto Tracker', icon: Coins }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-45 flex flex-col bg-slate-950/80 dark:bg-slate-950/80 border-r border-slate-900 lg:static transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-900 bg-slate-950/40">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="p-2 bg-gradient-to-tr from-brand-violet to-brand-cyan rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-sm tracking-wider uppercase text-slate-100 bg-gradient-to-r from-brand-cyan to-white bg-clip-text text-transparent">
                API Hub
              </span>
            )}
          </div>

          {/* Desktop Collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 hover:bg-slate-900 border border-slate-900 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6 scrollbar-none">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-2">
              {/* Group Title (Only if sidebar is not collapsed) */}
              {!isCollapsed && (
                <h4 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  {group.title}
                </h4>
              )}
              {isCollapsed && <div className="border-t border-slate-900/60 my-2" />}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)} // Close sidebar on mobile item click
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group relative ${
                          isActive
                            ? 'bg-gradient-to-r from-brand-violet/20 to-brand-cyan/5 text-brand-cyan border-l-2 border-brand-cyan pl-[10px]'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent'
                        }`
                      }
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon size={18} className="shrink-0 transition-transform group-hover:scale-110" />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-900 bg-slate-950/20 text-center">
            <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block">
              Desarrollado en 2026
            </span>
          </div>
        )}
      </aside>
    </>
  );
};
