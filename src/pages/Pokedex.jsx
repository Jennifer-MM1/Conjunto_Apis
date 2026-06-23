import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Card3D } from '../components/ui/Card3D';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { BarChart } from '../components/charts/BarChart';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, Search, Ruler, Weight, ShieldAlert } from 'lucide-react';

export const Pokedex = () => {
  const [page, setPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonHabitat, setPokemonHabitat] = useState('Desconocido');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const fetchPokemonList = React.useCallback(() => {
    return api.pokemon.getList(page, 20);
  }, [page]);

  const { data, loading, error, execute } = useFetch(fetchPokemonList, true);

  // When selected pokemon changes, load its species data for habitat/desc
  useEffect(() => {
    if (!selectedPokemon) return;
    
    setPokemonHabitat('Cargando...');
    api.pokemon.getSpecies(selectedPokemon.id)
      .then(speciesData => {
        const habitatName = speciesData.habitat?.name || 'Desconocido';
        const localizedHabitat = {
          cave: 'Cueva',
          forest: 'Bosque',
          grassland: 'Pradera',
          mountain: 'Montaña',
          rare: 'Raro',
          rough: 'Terreno Áspero',
          sea: 'Mar',
          urban: 'Urbano',
          waters_edge: 'Orilla del Agua'
        }[habitatName] || habitatName;
        
        setPokemonHabitat(localizedHabitat);
      })
      .catch(() => setPokemonHabitat('Desconocido'));
  }, [selectedPokemon]);

  const handleOpenDetails = (pokemon) => {
    setSelectedPokemon(pokemon);
    setActiveTab('stats');
    setIsModalOpen(true);
  };

  const toggleFav = (e, pokemon) => {
    e.stopPropagation();
    const favItem = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      types: pokemon.types
    };

    if (isFavorite('pokemon', pokemon.id)) {
      removeFavorite('pokemon', pokemon.id);
    } else {
      addFavorite('pokemon', favItem);
    }
  };

  const pokemonList = data?.results || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 20) || 1;

  // Local client-side filters for current page items
  const filteredList = pokemonList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.id.toString() === searchFilter;
    const matchesType = typeFilter === '' || p.types.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  const pokemonTypes = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 
    'fighting', 'poison', 'ground', 'flying', 'psychic', 
    'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  // Chart config
  const statLabels = selectedPokemon?.stats.map(s => {
    return {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defensa',
      'special-attack': 'Atq. Esp',
      'special-defense': 'Def. Esp',
      speed: 'Velocidad'
    }[s.name] || s.name;
  }) || [];
  const statValues = selectedPokemon?.stats.map(s => s.value) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            🐉 Pokédex Interactivo
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Consulta la base de datos de Pokémon con estadísticas avanzadas y clasificaciones por tipo.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Text Search */}
          <div className="relative flex items-center max-w-xs w-full">
            <span className="absolute left-3 text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Filtro rápido (ej. Pikachu)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/60 dark:bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-cyan/60 text-xs"
            />
          </div>

          {/* Type dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 focus:outline-none focus:border-brand-cyan/60 cursor-pointer"
          >
            <option value="">Todos los tipos</option>
            {pokemonTypes.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={execute} />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <Skeleton key={n} variant="card" className="h-60" />
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <EmptyState message="No encontramos ningún Pokémon que coincida con tus filtros locales en esta página. Prueba cambiando los filtros o navegando a otra página." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredList.map((pokemon) => {
              const isFav = isFavorite('pokemon', pokemon.id);
              return (
                <Card3D
                  key={pokemon.id}
                  onClick={() => handleOpenDetails(pokemon)}
                  className="flex flex-col items-center justify-between text-center p-5 min-h-[250px]"
                >
                  <div className="relative w-full">
                    {/* Index */}
                    <span className="absolute top-0 left-0 text-[10px] font-bold font-mono text-slate-600">
                      #{pokemon.id.toString().padStart(3, '0')}
                    </span>
                    {/* Fav */}
                    <button
                      onClick={(e) => toggleFav(e, pokemon)}
                      className={`absolute top-0 right-0 p-1.5 rounded-lg border backdrop-blur-sm cursor-pointer ${
                        isFav
                          ? 'bg-brand-pink/20 border-brand-pink/40 text-brand-pink'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Artwork image */}
                  <div className="w-28 h-28 my-2 flex items-center justify-center relative">
                    {/* Background blob glowing */}
                    <div className="absolute inset-0 bg-brand-cyan/5 rounded-full blur-xl group-hover:bg-brand-violet/10 transition-colors" />
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="w-full space-y-3">
                    <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wide">
                      {pokemon.name}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-1">
                      {pokemon.types.map((t) => (
                        <Badge key={t} variant={t}>
                          {t}
                        </Badge>
                      ))}
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
        title={selectedPokemon ? `${selectedPokemon.name.toUpperCase()} (#${selectedPokemon.id.toString().padStart(3, '0')})` : ''}
      >
        {selectedPokemon && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-slate-850">
              <div className="w-40 h-40 bg-slate-900/50 rounded-2xl p-4 border border-slate-850 flex items-center justify-center relative">
                <img
                  src={selectedPokemon.image}
                  alt={selectedPokemon.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {selectedPokemon.types.map(t => (
                    <Badge key={t} variant={t}>
                      {t}
                    </Badge>
                  ))}
                </div>
                <h4 className="text-xl font-extrabold text-slate-100 uppercase tracking-wider">
                  {selectedPokemon.name}
                </h4>
                <div className="flex gap-4 justify-center sm:justify-start font-mono text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Weight size={14} className="text-brand-cyan" /> {selectedPokemon.weight} kg
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler size={14} className="text-brand-violet" /> {selectedPokemon.height} m
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Tabs */}
            <Tabs
              tabs={[
                { id: 'stats', label: 'Estadísticas' },
                { id: 'general', label: 'Información General' },
                { id: 'habitat', label: 'Hábitat' }
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Contents */}
            {activeTab === 'stats' && (
              <div className="h-72">
                <BarChart
                  labels={statLabels}
                  dataValues={statValues}
                  label="Stats Base"
                  color="#a78bfa"
                />
              </div>
            )}

            {activeTab === 'general' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Habilidades</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedPokemon.abilities.map(a => (
                      <span key={a} className="text-xs bg-slate-800 px-2.5 py-1 rounded-md text-slate-300 font-medium font-mono uppercase">
                        {a.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Habilidades Ocultas</span>
                  <span className="text-xs text-slate-400">
                    Ocultas disponibles en combates competitivos oficiales.
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'habitat' && (
              <div className="p-6 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-bold text-slate-200">Hábitat del Pokémon</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    Zona geográfica natural donde se puede capturar de forma salvaje.
                  </p>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-brand-violet/20 to-brand-cyan/20 border border-brand-cyan/30 rounded-xl text-brand-cyan font-bold text-sm">
                  {pokemonHabitat}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
export default Pokedex;
