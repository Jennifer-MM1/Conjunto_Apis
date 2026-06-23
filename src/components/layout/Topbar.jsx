import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';

export const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  // Get total favorites count
  const totalFavorites = 
    (favorites.anime?.length || 0) + 
    (favorites.pokemon?.length || 0) + 
    (favorites.characters?.length || 0);

  // Map route paths to page titles
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard Home';
      case '/anime': return '⛩️ Anime Explorer';
      case '/pokedex': return '🐉 Pokédex Interactivo';
      case '/rickandmorty': return '👽 Rick & Morty Explorer';
      case '/jokes': return '🤠 Chuck Norris Jokes';
      case '/forum': return '📝 Foro Social / Comentarios';
      case '/directory': return '👥 Directorio de Equipo';
      case '/weather': return '🌦️ Clima Local & Mapas';
      case '/covid': return '📊 COVID Analytics';
      case '/crypto': return '💰 Crypto Tracker';
      default: return 'API Hub';
    }
  };

  return (
    <header className="h-16 px-6 border-b border-slate-900 bg-slate-950/60 dark:bg-slate-950/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu */}
        <button
          onClick={onMenuClick}
          className="p-2 lg:hidden hover:bg-slate-900 border border-slate-900 rounded-xl text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </button>

        {/* Dynamic Title / Breadcrumb */}
        <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <span className="text-slate-500 font-normal">Dashboard /</span>
          <span className="bg-gradient-to-r from-brand-cyan to-white bg-clip-text text-transparent">
            {getPageTitle()}
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Favorites count preview */}
        {totalFavorites > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-pink/10 border border-brand-pink/20 rounded-full text-brand-pink text-xs font-semibold animate-pulse">
            <Heart size={12} fill="currentColor" />
            <span>{totalFavorites} favs</span>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 hover:bg-slate-900 border border-slate-900 rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-300 active:scale-95 cursor-pointer"
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          aria-label="Alternar tema"
        >
          {isDark ? (
            <Sun size={16} className="text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon size={16} className="text-brand-violet" />
          )}
        </button>
      </div>
    </header>
  );
};
