import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 glass-panel rounded-2xl border-brand-pink/20 max-w-lg mx-auto ${className}`}>
      <div className="p-4 bg-brand-pink/10 rounded-full text-brand-pink animate-pulse mb-4">
        <AlertCircle size={40} />
      </div>
      <h3 className="text-xl font-bold text-slate-100 dark:text-slate-100 mb-2">
        Error de Conexión
      </h3>
      <p className="text-slate-400 dark:text-slate-400 text-sm max-w-sm mb-6">
        {message || 'No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión o vuelve a intentarlo.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-violet to-brand-cyan hover:from-brand-violet/90 hover:to-brand-cyan/90 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 active:scale-95 cursor-pointer"
        >
          <RefreshCw size={16} />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
};
