import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { Skeleton } from '../components/ui/Skeleton';
import { SearchBar } from '../components/ui/SearchBar';
import { ErrorState } from '../components/ui/ErrorState';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Star, Info } from 'lucide-react';

export const CryptoTracker = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCryptoMarkets = React.useCallback(() => {
    return api.crypto.getMarkets(10, page);
  }, [page]);

  const { data: cryptoList, loading, error, execute, setData } = useFetch(fetchCryptoMarkets, true);

  // Auto Polling: refresh markets every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsRefreshing(true);
      fetchCryptoMarkets()
        .then(res => {
          setData(res);
        })
        .catch(err => console.warn('Polling error: ', err))
        .finally(() => setIsRefreshing(false));
    }, 60000);

    return () => clearInterval(timer);
  }, [fetchCryptoMarkets, setData]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    execute().finally(() => setIsRefreshing(false));
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
  };

  const filteredCoins = React.useMemo(() => {
    if (!cryptoList) return [];
    if (!searchQuery.trim()) return cryptoList;
    const query = searchQuery.toLowerCase();
    return cryptoList.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.symbol.toLowerCase().includes(query)
    );
  }, [cryptoList, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            💰 Crypto Tracker Financiero
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Precios en tiempo real, capitalización de mercado y variaciones porcentuales de criptomonedas (actualización automática).
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <SearchBar
            placeholder="Buscar cripto (ej. BTC, Solana)..."
            onSearch={handleSearch}
            value={searchQuery}
            className="w-full sm:max-w-xs"
          />

          <button
            onClick={handleManualRefresh}
            disabled={loading || isRefreshing}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-2 text-xs"
            title="Actualizar datos"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* Info notice about rate limiting / fallback */}
      <div className="flex items-center gap-2 p-3 bg-slate-900/60 border border-slate-900 rounded-2xl text-[10px] text-slate-400">
        <Info size={14} className="text-brand-cyan shrink-0 animate-pulse" />
        <span>
          <strong>Nota de Servicio</strong>: CoinGecko API limita las solicitudes gratuitas. Si se alcanza el límite de solicitudes, el sistema activa automáticamente un cargador de respaldo resiliente con cotizaciones seguras.
        </span>
      </div>

      {/* Table grid */}
      <div className="glass-panel rounded-3xl border border-slate-800/80 bg-slate-900/20 overflow-hidden">
        {loading ? (
          <Skeleton variant="table" />
        ) : filteredCoins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-xs font-semibold">No se encontraron criptomonedas con ese filtro.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Moneda</th>
                  <th className="px-6 py-4 text-right">Precio Actual</th>
                  <th className="px-6 py-4 text-right">Variación (24h)</th>
                  <th className="px-6 py-4 text-right hidden md:table-cell">Volumen (24h)</th>
                  <th className="px-6 py-4 text-right hidden lg:table-cell">Cap. de Mercado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs font-mono text-slate-300">
                {filteredCoins.map((coin, idx) => {
                  const change = coin.price_change_percentage_24h || 0;
                  const isPositive = change >= 0;
                  return (
                    <tr key={coin.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-semibold">{idx + 1}</td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-6 h-6 object-contain rounded-full"
                          loading="lazy"
                        />
                        <div>
                          <span className="font-extrabold text-slate-200 block">
                            {coin.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">
                            {coin.symbol}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-slate-100">
                        ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold`}>
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg ${
                          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {Math.abs(change).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400 hidden md:table-cell">
                        ${coin.total_volume?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400 hidden lg:table-cell">
                        ${coin.market_cap?.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default CryptoTracker;
