import React from 'react';

export const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex border-b border-slate-800/80 mb-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 pb-3 text-sm font-semibold transition-all duration-300 relative cursor-pointer ${
              isActive
                ? 'text-brand-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-violet to-brand-cyan rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
