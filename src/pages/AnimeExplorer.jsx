import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { SearchBar } from '../components/ui/SearchBar';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Card3D } from '../components/ui/Card3D';
import { useFavorites } from '../context/FavoritesContext';
import { Star, Film, Tv, Play, Award, Calendar } from 'lucide-react';

export const AnimeExplorer = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Fetch function based on query
  const fetchAnimes = React.useCallback(() => {
    if (query.trim() === '') {
      return api.anime.getTop(page);
    } else {
      return api.anime.search(query, page);
    }
  }, [query, page]);

  const { data, loading, error, execute } = useFetch(fetchAnimes, true);

  // Trigger search execution
  useEffect(() => {
    execute();
  }, [query, page, execute]);

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    setPage(1); // Reset page on new search
  };

  const handleOpenDetails = async (animeId) => {
    try {
      const details = await api.anime.getDetails(animeId);
      setSelectedAnime(details.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFav = (e, anime) => {
    e.stopPropagation();
    const favItem = {
      id: anime.mal_id,
      title: anime.title,
      image: anime.images?.jpg?.image_url,
      type: anime.type
    };

    if (isFavorite('anime', anime.mal_id)) {
      removeFavorite('anime', anime.mal_id);
    } else {
      addFavorite('anime', favItem);
    }
  };

  const animesList = data?.data || [];
  const paginationInfo = data?.pagination || {};
  const totalPages = paginationInfo.last_visible_page || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            ⛩️ Anime & Manga Explorer
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Explora las producciones de anime más populares utilizando la API pública de MyAnimeList.
          </p>
        </div>
        <SearchBar
          placeholder="Buscar anime (ej. Naruto, Attack on Titan)..."
          onSearch={handleSearch}
          value={query}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={execute} />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Skeleton key={n} variant="card" />
          ))}
        </div>
      ) : animesList.length === 0 ? (
        <EmptyState message="No encontramos animes que coincidan con tu búsqueda. Intenta de nuevo." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {animesList.map((anime) => {
              const isFav = isFavorite('anime', anime.mal_id);
              return (
                <Card3D
                  key={anime.mal_id}
                  onClick={() => handleOpenDetails(anime.mal_id)}
                  className="flex flex-col h-[400px] justify-between p-0 overflow-hidden"
                >
                  <div className="relative h-56 w-full overflow-hidden group">
                    <img
                      src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFav(e, anime)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all duration-300 active:scale-90 border cursor-pointer ${
                        isFav
                          ? 'bg-brand-pink/20 border-brand-pink/40 text-brand-pink'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
                    </button>

                    {/* Score Tag */}
                    {anime.score && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-slate-900/85 backdrop-blur-md rounded-lg border border-slate-800/60 text-amber-400 text-xs font-bold font-mono">
                        <Star size={12} fill="currentColor" />
                        <span>{anime.score.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {anime.type === 'Movie' ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded uppercase">
                            <Film size={10} /> Película
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-brand-violet bg-brand-violet/10 px-2 py-0.5 rounded uppercase">
                            <Tv size={10} /> TV Series
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-semibold font-mono">
                          {anime.episodes ? `${anime.episodes} eps` : 'En emisión'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-100 line-clamp-2 leading-snug">
                        {anime.title}
                      </h3>
                    </div>

                    <div className="border-t border-slate-850 pt-3 flex items-center justify-between mt-4">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        {anime.source || 'Original'}
                      </span>
                      <span className="text-[10px] text-brand-cyan font-bold flex items-center gap-1 hover:underline">
                        Ver detalles <Play size={10} />
                      </span>
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAnime?.title || 'Detalle del Anime'}
      >
        {selectedAnime && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-64 shrink-0 rounded-xl overflow-hidden border border-slate-850">
                <img
                  src={selectedAnime.images?.jpg?.large_image_url || selectedAnime.images?.jpg?.image_url}
                  alt={selectedAnime.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedAnime.genres?.map(g => (
                    <span key={g.mal_id} className="text-xs px-2.5 py-0.5 bg-slate-800 border border-slate-700/60 rounded-full text-slate-300 font-medium">
                      {g.name}
                    </span>
                  ))}
                </div>

                <h4 className="text-lg font-extrabold text-slate-100 leading-snug">
                  {selectedAnime.title_english || selectedAnime.title}
                </h4>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-850 py-3 font-mono">
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-amber-400" />
                    <span className="text-xs text-slate-400">Score:</span>
                    <span className="text-xs font-bold text-slate-200">{selectedAnime.score || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand-cyan" />
                    <span className="text-xs text-slate-400">Año:</span>
                    <span className="text-xs font-bold text-slate-200">{selectedAnime.year || 'N/A'}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div><strong className="text-slate-300">Popularidad:</strong> #{selectedAnime.popularity}</div>
                  <div><strong className="text-slate-300">Estudio:</strong> {selectedAnime.studios?.map(s => s.name).join(', ') || 'N/A'}</div>
                  <div><strong className="text-slate-300">Clasificación:</strong> {selectedAnime.rating || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-bold text-slate-200">Sinopsis</h5>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                {selectedAnime.synopsis || 'Sin sinopsis disponible.'}
              </p>
            </div>

            {selectedAnime.trailer?.embed_url && (
              <div className="space-y-2">
                <h5 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Play size={14} className="text-brand-pink" /> Trailer Promocional
                </h5>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-850">
                  <iframe
                    src={selectedAnime.trailer.embed_url}
                    title="Anime Trailer"
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
export default AnimeExplorer;
