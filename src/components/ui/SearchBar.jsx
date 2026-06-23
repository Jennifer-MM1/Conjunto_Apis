import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export const SearchBar = ({
  placeholder = 'Buscar...',
  onSearch,
  value: externalValue,
  debounceTime = 300,
  className = ''
}) => {
  const [query, setQuery] = useState(externalValue || '');
  const debouncedQuery = useDebounce(query, debounceTime);

  // Keep internal state updated if external value changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setQuery(externalValue);
    }
  }, [externalValue]);

  // Trigger search on debounce completion
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <span className="absolute left-4 text-slate-400">
        <Search size={18} />
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-2.5 bg-slate-900/60 dark:bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-cyan/60 focus:ring-1 focus:ring-brand-cyan/20 transition-all duration-300 text-sm"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3.5 p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
