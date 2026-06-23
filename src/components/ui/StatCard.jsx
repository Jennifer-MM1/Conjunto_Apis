import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  change,
  isPositive = true,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-36 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-10 bg-slate-800 rounded-xl w-10" />
        </div>
        <div className="h-8 bg-slate-800 rounded w-1/2" />
        <div className="h-3 bg-slate-800 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className={`glass-panel p-6 rounded-2xl hover:border-slate-700/80 transition-all duration-300 group ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-400 text-sm font-medium">
          {title}
        </span>
        {Icon && (
          <div className="p-2.5 bg-slate-900/80 rounded-xl text-brand-cyan group-hover:text-brand-violet transition-colors duration-300">
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <h3 className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight">
          {value}
        </h3>
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/10 text-rose-400'
            }`}
          >
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {description}
        </p>
      )}
    </div>
  );
};
