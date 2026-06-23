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
import { Badge } from '../components/ui/Badge';
import { useFavorites } from '../context/FavoritesContext';
import { Star, Smile, Heart, User, MapPin, Tv, Compass } from 'lucide-react';

export const RickAndMorty = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const fetchCharacters = React.useCallback(() => {
    return api.rickAndMorty.getCharacters(page, query, statusFilter, speciesFilter);
  }, [page, query, statusFilter, speciesFilter]);

  const { data, loading, error, execute } = useFetch(fetchCharacters, true);

  // Trigger search execution
  useEffect(() => {
    execute();
  }, [query, statusFilter, speciesFilter, page, execute]);

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    setPage(1); // Reset page on new search
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleSpeciesChange = (e) => {
    setSpeciesFilter(e.target.value);
    setPage(1);
  };

  const toggleFav = (e, char) => {
    e.stopPropagation();
    const favItem = {
      id: char.id,
      name: char.name,
      image: char.image,
      status: char.status,
      species: char.species
    };

    if (isFavorite('characters', char.id)) {
      removeFavorite('characters', char.id);
    } else {
      addFavorite('characters', favItem);
    }
  };

  const charactersList = data?.results || [];
  const totalPages = data?.info?.pages || 1;

  const speciesOptions = [
    'Human', 'Alien', 'Humanoid', 'Poopybutthole', 'Mythological Creature', 
    'Robot', 'Cronenberg', 'Disease', 'Animal', 'unknown'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            👽 Rick & Morty Explorer
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Explora las dimensiones de Rick & Morty buscando personajes y filtrando por estado o especie.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
          <SearchBar
            placeholder="Buscar personaje..."
            onSearch={handleSearch}
            value={query}
            className="w-full sm:max-w-xs"
          />

          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 focus:outline-none focus:border-brand-cyan/60 cursor-pointer"
          >
            <option value="">Cualquier Estado</option>
            <option value="alive">Vivo</option>
            <option value="dead">Muerto</option>
            <option value="unknown">Desconocido</option>
          </select>

          <select
            value={speciesFilter}
            onChange={handleSpeciesChange}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 focus:outline-none focus:border-brand-cyan/60 cursor-pointer"
          >
            <option value="">Cualquier Especie</option>
            {speciesOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        // If error contains 404 from API, it means no results found for filters
        error.includes('404') ? (
          <EmptyState message="No encontramos personajes que coincidan con los filtros aplicados." />
        ) : (
          <ErrorState message={error} onRetry={execute} />
        )
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Skeleton key={n} variant="card" />
          ))}
        </div>
      ) : charactersList.length === 0 ? (
        <EmptyState message="No se encontraron personajes." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {charactersList.map((char) => {
              const isFav = isFavorite('characters', char.id);
              const statusVariant = char.status.toLowerCase();
              return (
                <Card3D
                  key={char.id}
                  onClick={() => {
                    setSelectedCharacter(char);
                    setIsModalOpen(true);
                  }}
                  className="flex flex-col h-[380px] justify-between p-0 overflow-hidden"
                >
                  <div className="relative h-52 w-full overflow-hidden group">
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Fav Button */}
                    <button
                      onClick={(e) => toggleFav(e, char)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all duration-300 active:scale-90 border cursor-pointer ${
                        isFav
                          ? 'bg-brand-pink/20 border-brand-pink/40 text-brand-pink'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={statusVariant}>
                          {char.status === 'Alive' ? 'Vivo' : char.status === 'Dead' ? 'Muerto' : 'Desconocido'}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-semibold font-mono">
                          {char.species}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-100 line-clamp-2 leading-snug">
                        {char.name}
                      </h3>
                    </div>

                    <div className="border-t border-slate-850 pt-3 flex items-center justify-between mt-4 text-[10px] text-slate-500">
                      <span className="truncate max-w-[120px]" title={char.location.name}>
                        📍 {char.location.name}
                      </span>
                      <span className="text-brand-cyan font-bold hover:underline cursor-pointer">
                        Ver ficha
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
        title={selectedCharacter?.name || 'Ficha de Personaje'}
      >
        {selectedCharacter && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-slate-850">
              <div className="w-40 h-40 bg-slate-900 rounded-2xl overflow-hidden border border-slate-850 shrink-0">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 text-center sm:text-left w-full">
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                  <Badge variant={selectedCharacter.status.toLowerCase()}>
                    {selectedCharacter.status === 'Alive' ? 'Vivo' : selectedCharacter.status === 'Dead' ? 'Muerto' : 'Desconocido'}
                  </Badge>
                  <span className="text-xs px-2.5 py-0.5 bg-slate-800 border border-slate-700/60 rounded-full text-slate-300 font-medium">
                    {selectedCharacter.species}
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-slate-100">
                  {selectedCharacter.name}
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <User size={14} className="text-brand-cyan" />
                    <span>Género:</span>
                    <span className="font-bold text-slate-200">{selectedCharacter.gender === 'Female' ? 'Femenino' : selectedCharacter.gender === 'Male' ? 'Masculino' : 'Desconocido'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <Tv size={14} className="text-brand-violet" />
                    <span>Apariciones:</span>
                    <span className="font-bold text-slate-200">{selectedCharacter.episode?.length} eps</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-brand-cyan/10 rounded-lg text-brand-cyan mt-0.5">
                  <Compass size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Origen</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                    {selectedCharacter.origin.name}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-brand-violet/10 rounded-lg text-brand-violet mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Ubicación Actual</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                    {selectedCharacter.location.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default RickAndMorty;
