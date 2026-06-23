import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Card3D } from '../components/ui/Card3D';
import { Laugh, Sparkles, History, Send, ChevronRight } from 'lucide-react';

export const ChuckNorris = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [jokeHistory, setJokeHistory] = useState([]);
  const [isRotating, setIsRotating] = useState(false);

  // Fetch random joke
  const fetchJoke = React.useCallback(() => {
    return api.chuckNorris.getRandom(selectedCategory);
  }, [selectedCategory]);

  const { data: jokeData, loading, error, execute: getNewJoke } = useFetch(fetchJoke, true);

  // Fetch categories on mount
  useEffect(() => {
    api.chuckNorris.getCategories()
      .then(res => setCategories(res))
      .catch(err => console.error(err));
  }, []);

  // Update history when a new joke is loaded
  useEffect(() => {
    if (jokeData && jokeData.value) {
      setJokeHistory(prev => {
        // Prevent duplicate consecutive entries
        if (prev.some(j => j.id === jokeData.id)) return prev;
        return [jokeData, ...prev.slice(0, 4)]; // Store last 5 jokes
      });
    }
  }, [jokeData]);

  const handleNextJoke = () => {
    setIsRotating(true);
    getNewJoke().finally(() => {
      // Small timeout for rotation animation
      setTimeout(() => setIsRotating(false), 500);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-100">
          🤠 Chuck Norris Jokes
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Genera chistes aleatorios del legendario Chuck Norris filtrando por categorías. Practica animaciones de transición rápidas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Generator Controls */}
        <div className="md:col-span-2 space-y-6">
          <Card3D className={`relative transition-all duration-500 overflow-hidden min-h-[220px] flex flex-col justify-between ${
            isRotating ? '[transform:rotateY(360deg)] duration-500' : ''
          }`}>
            {error ? (
              <ErrorState message={error} onRetry={handleNextJoke} className="border-none bg-transparent p-0" />
            ) : loading ? (
              <div className="space-y-4">
                <Skeleton variant="title" />
                <Skeleton variant="text" />
                <Skeleton variant="text" className="w-1/2" />
              </div>
            ) : (
              <div className="space-y-6 relative z-10 flex flex-col justify-between h-full flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      JOKE GENERATOR
                    </span>
                    {jokeData?.categories?.length > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                        {jokeData.categories[0]}
                      </span>
                    )}
                  </div>
                  <blockquote className="text-base md:text-lg font-semibold text-slate-200 leading-relaxed italic">
                    "{jokeData?.value}"
                  </blockquote>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-850 pt-4 mt-6">
                  <Laugh size={14} className="text-brand-violet animate-bounce" />
                  <span>Chuck Norris approved.</span>
                </div>
              </div>
            )}
          </Card3D>

          {/* Action Panel */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/40 p-4 border border-slate-900 rounded-2xl">
            {/* Category Select */}
            <div className="w-full sm:w-auto flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 focus:outline-none focus:border-brand-cyan/60 cursor-pointer"
              >
                <option value="">Cualquiera (Aleatorio)</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Generator Button */}
            <button
              onClick={handleNextJoke}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-brand-violet to-brand-cyan hover:from-brand-violet/90 hover:to-brand-cyan/90 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 active:scale-95 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 mt-4 sm:mt-0 self-end"
            >
              <Sparkles size={16} />
              Generar chiste
            </button>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
            <History size={16} />
            <h4>Historial Reciente</h4>
          </div>

          <div className="space-y-3">
            {jokeHistory.length <= 1 ? (
              <div className="text-center p-6 border border-slate-900 rounded-2xl text-xs text-slate-500">
                Los chistes generados en esta sesión se listarán aquí.
              </div>
            ) : (
              jokeHistory.slice(1).map((joke, idx) => (
                <div
                  key={joke.id || idx}
                  className="p-4 bg-slate-900/60 border border-slate-900 hover:border-slate-800 rounded-xl transition-all duration-300 text-xs text-slate-400 space-y-2"
                >
                  <p className="italic">"{joke.value}"</p>
                  {joke.categories?.length > 0 && (
                    <span className="inline-block text-[9px] font-bold text-brand-cyan uppercase bg-brand-cyan/10 px-2 py-0.5 rounded">
                      {joke.categories[0]}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChuckNorris;
