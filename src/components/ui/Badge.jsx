import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      // Rick and Morty styles
      case 'alive':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'dead':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'unknown':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';

      // Pokemon Type Styles
      case 'normal': return 'bg-amber-100/10 text-amber-200 border-amber-500/20';
      case 'fire': return 'bg-orange-500/15 text-orange-400 border-orange-500/35';
      case 'water': return 'bg-blue-500/15 text-blue-400 border-blue-500/35';
      case 'grass': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35';
      case 'electric': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/35';
      case 'ice': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/35';
      case 'fighting': return 'bg-red-500/15 text-red-400 border-red-500/35';
      case 'poison': return 'bg-purple-500/15 text-purple-400 border-purple-500/35';
      case 'ground': return 'bg-yellow-800/15 text-yellow-500 border-yellow-800/35';
      case 'flying': return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/35';
      case 'psychic': return 'bg-pink-500/15 text-pink-400 border-pink-500/35';
      case 'bug': return 'bg-lime-500/15 text-lime-400 border-lime-500/35';
      case 'rock': return 'bg-stone-500/15 text-stone-400 border-stone-500/35';
      case 'ghost': return 'bg-violet-500/15 text-violet-400 border-violet-500/35';
      case 'dragon': return 'bg-purple-600/15 text-purple-400 border-purple-600/35';
      case 'dark': return 'bg-neutral-800/80 text-neutral-300 border-neutral-700/50';
      case 'steel': return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/35';
      case 'fairy': return 'bg-pink-400/15 text-pink-300 border-pink-400/35';

      // Default tags
      case 'primary':
        return 'bg-brand-violet/10 text-brand-violet border-brand-violet/20';
      case 'cyan':
        return 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20';
      case 'amber':
        return 'bg-brand-amber/10 text-brand-amber border-brand-amber/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVariantStyles()} ${className}`}
    >
      {children}
    </span>
  );
};
