import React from 'react';
import { Search } from 'lucide-react';

export const EmptyState = ({ message, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 glass-panel rounded-2xl max-w-lg mx-auto ${className}`}>
      <div className="p-4 bg-slate-800/50 dark:bg-slate-800/30 rounded-full text-slate-400 mb-4">
        <Search size={36} />
      </div>
      <h3 className="text-xl font-bold text-slate-100 dark:text-slate-100 mb-2">
        Sin Resultados
      </h3>
      <p className="text-slate-400 dark:text-slate-400 text-sm max-w-sm">
        {message || 'No encontramos ningún resultado que coincida con tu búsqueda. Intenta con otros términos o filtros.'}
      </p>
    </div>
  );
};
