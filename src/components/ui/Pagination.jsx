import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  // Generate range of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages to show before/after current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={`flex items-center justify-center gap-2 mt-8 ${className}`}>
      {/* Prev Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors cursor-pointer"
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Pages */}
      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 text-slate-500 text-sm">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-brand-violet to-brand-cyan text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors cursor-pointer"
        aria-label="Página siguiente"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
