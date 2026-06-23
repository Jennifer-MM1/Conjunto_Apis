import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { SearchBar } from '../components/ui/SearchBar';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Card3D } from '../components/ui/Card3D';
import {
  Grid,
  List,
  Mail,
  MapPin,
  Phone,
  UserPlus,
  ArrowUpDown,
  User,
  ExternalLink
} from 'lucide-react';

export const UserDirectory = () => {
  const [usersList, setUsersList] = useState([]);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'country'
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchInitialUsers = React.useCallback(() => {
    return api.users.getList(12, 1);
  }, []);

  const { data: initialData, loading, error, execute } = useFetch(fetchInitialUsers, true);

  // Sync initial users
  useEffect(() => {
    if (initialData?.results) {
      setUsersList(initialData.results);
      setPage(1);
    }
  }, [initialData]);

  // Load more users
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await api.users.getList(12, nextPage);
      setUsersList(prev => [...prev, ...res.results]);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
  };

  // Filter and Sort Users
  const processedUsers = React.useMemo(() => {
    let list = [...usersList];

    // Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      list = list.filter(u => {
        const fullName = `${u.name.first} ${u.name.last}`.toLowerCase();
        return (
          fullName.includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.location.country.toLowerCase().includes(query)
        );
      });
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.name.first} ${a.name.last}`.toLowerCase();
        const nameB = `${b.name.first} ${b.name.last}`.toLowerCase();
        return nameA.localeCompare(nameB);
      } else {
        const countryA = a.location.country.toLowerCase();
        const countryB = b.location.country.toLowerCase();
        return countryA.localeCompare(countryB);
      }
    });

    return list;
  }, [usersList, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            👥 Directorio de Equipo y Usuarios
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Gestión y filtrado de usuarios generados aleatoriamente con Random User API. Soporta vistas híbridas y ordenamiento.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          <SearchBar
            placeholder="Buscar por nombre, email o país..."
            onSearch={handleSearch}
            value={searchQuery}
            className="w-full sm:max-w-xs"
          />

          {/* Sort Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5">
            <ArrowUpDown size={14} className="text-slate-500 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 bg-transparent text-xs text-slate-400 focus:outline-none cursor-pointer"
            >
              <option value="name">Ordenar por Nombre</option>
              <option value="country">Ordenar por País</option>
            </select>
          </div>

          {/* Toggle View Mode */}
          <div className="flex border border-slate-800 bg-slate-900/60 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-800 text-brand-cyan' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Vista cuadrícula"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-800 text-brand-cyan' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Vista lista"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={execute} />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <Skeleton key={n} variant="card" className="h-64" />
          ))}
        </div>
      ) : processedUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">No encontramos ningún usuario que coincida con tus filtros.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedUsers.map((user, idx) => (
            <Card3D
              key={user.login?.uuid || idx}
              className="flex flex-col items-center justify-between p-6 text-center h-[300px]"
            >
              <div className="space-y-4 flex flex-col items-center w-full">
                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-800 p-0.5 shadow-lg">
                  <img
                    src={user.picture.large}
                    alt={user.name.first}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-100 truncate max-w-[180px]">
                    {user.name.first} {user.name.last}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    {user.location.city}, {user.location.country}
                  </span>
                </div>

                {/* Details contacts */}
                <div className="space-y-1.5 w-full text-[10px] text-slate-400 font-mono text-left bg-slate-950/20 p-2.5 border border-slate-900 rounded-xl">
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={12} className="text-brand-cyan shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Phone size={12} className="text-brand-violet shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      ) : (
        /* List Layout */
        <div className="space-y-3">
          {processedUsers.map((user, idx) => (
            <div
              key={user.login?.uuid || idx}
              className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4 border border-slate-800/80 hover:border-slate-700/60 transition-all duration-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={user.picture.medium}
                  alt={user.name.first}
                  className="w-12 h-12 rounded-full object-cover border border-slate-800"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-100 truncate">
                    {user.name.first} {user.name.last}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 truncate mt-0.5">
                    <Mail size={12} className="text-brand-cyan shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-semibold font-mono">
                <MapPin size={12} className="text-brand-violet" />
                <span>{user.location.city}, {user.location.country}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Phone size={12} />
                <span>{user.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl transition-all duration-300 disabled:opacity-40 cursor-pointer text-xs"
        >
          <UserPlus size={14} />
          {isLoadingMore ? 'Cargando más...' : 'Cargar más usuarios'}
        </button>
      </div>
    </div>
  );
};
export default UserDirectory;
