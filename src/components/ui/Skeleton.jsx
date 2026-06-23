import React from 'react';

export const Skeleton = ({ variant = 'text', className = '' }) => {
  const baseClasses = "relative overflow-hidden bg-slate-800 dark:bg-slate-800/40 rounded-lg shimmer-wave animate-shimmer";
  
  if (variant === 'text') {
    return <div className={`${baseClasses} h-4 w-3/4 ${className}`} />;
  }

  if (variant === 'title') {
    return <div className={`${baseClasses} h-6 w-1/2 mb-4 ${className}`} />;
  }

  if (variant === 'avatar') {
    return <div className={`${baseClasses} rounded-full h-12 w-12 ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} w-full h-64 p-6 flex flex-col justify-between ${className}`}>
        <div>
          <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-4" />
          <div className="h-4 bg-slate-700/50 rounded w-2/3 mb-2" />
          <div className="h-4 bg-slate-700/50 rounded w-5/6 mb-2" />
        </div>
        <div className="h-8 bg-slate-700/50 rounded w-1/4 mt-4" />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`${baseClasses} w-full h-72 p-6 flex flex-col justify-end gap-2 ${className}`}>
        <div className="flex items-end justify-between h-48 w-full gap-2 px-4">
          <div className="bg-slate-700/50 w-full rounded-t" style={{ height: '35%' }} />
          <div className="bg-slate-700/50 w-full rounded-t" style={{ height: '65%' }} />
          <div className="bg-slate-700/50 w-full rounded-t" style={{ height: '45%' }} />
          <div className="bg-slate-700/50 w-full rounded-t" style={{ height: '80%' }} />
          <div className="bg-slate-700/50 w-full rounded-t" style={{ height: '55%' }} />
          <div className="bg-slate-700/50 w-full rounded-t" style={{ height: '70%' }} />
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`w-full overflow-hidden ${className}`}>
        <div className="flex border-b border-slate-800 p-4 gap-4 bg-slate-900/50">
          <div className="h-4 bg-slate-700/50 rounded w-1/4" />
          <div className="h-4 bg-slate-700/50 rounded w-1/4" />
          <div className="h-4 bg-slate-700/50 rounded w-1/4" />
          <div className="h-4 bg-slate-700/50 rounded w-1/4" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex border-b border-slate-800/50 p-4 gap-4">
            <div className={`${baseClasses} h-4 w-1/4`} />
            <div className={`${baseClasses} h-4 w-1/4`} />
            <div className={`${baseClasses} h-4 w-1/4`} />
            <div className={`${baseClasses} h-4 w-1/4`} />
          </div>
        ))}
      </div>
    );
  }

  return <div className={`${baseClasses} ${className}`} />;
};
