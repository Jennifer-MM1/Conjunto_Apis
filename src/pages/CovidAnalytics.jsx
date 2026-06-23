import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { StatCard } from '../components/ui/StatCard';
import { LineChart } from '../components/charts/LineChart';
import { DoughnutChart } from '../components/charts/DoughnutChart';
import { Search } from 'lucide-react';

export const CovidAnalytics = () => {
  const [countriesList, setCountriesList] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [searchCountry, setSearchCountry] = useState('');
  
  const [historicalData, setHistoricalData] = useState(null);
  const [historicalLoading, setHistoricalLoading] = useState(false);

  // Fetch Global stats
  const fetchGlobal = React.useCallback(() => {
    return api.covid.getGlobal();
  }, []);

  const { data: globalData, loading: globalLoading, error: globalError, execute } = useFetch(fetchGlobal, true);

  // Fetch countries and history
  useEffect(() => {
    setCountriesLoading(true);
    api.covid.getCountries()
      .then(res => setCountriesList(res))
      .catch(err => console.error(err))
      .finally(() => setCountriesLoading(false));

    setHistoricalLoading(true);
    api.covid.getHistorical(30)
      .then(res => setHistoricalData(res))
      .catch(err => console.error(err))
      .finally(() => setHistoricalLoading(false));
  }, []);

  // Filter countries
  const filteredCountries = React.useMemo(() => {
    if (!searchCountry.trim()) return countriesList.slice(0, 100); // limit to top 100
    const query = searchCountry.toLowerCase();
    return countriesList.filter(c => 
      c.country.toLowerCase().includes(query)
    );
  }, [countriesList, searchCountry]);

  // Format historical chart data
  const chartLabels = historicalData ? Object.keys(historicalData.cases) : [];
  const chartValues = historicalData ? Object.values(historicalData.cases) : [];

  // Format distribution chart
  const doughnutLabels = ['Casos Activos', 'Recuperados', 'Fallecidos'];
  const doughnutValues = globalData ? [globalData.active, globalData.recovered, globalData.deaths] : [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-100">
          📊 Analytics de Salud Global
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Centro de análisis de datos de salud y pandemias globales en base histórica mediante disease.sh.
        </p>
      </div>

      {globalError ? (
        <ErrorState message={globalError} onRetry={execute} />
      ) : (
        <>
          {/* StatCards Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total de Casos"
              value={globalLoading ? '...' : globalData?.cases?.toLocaleString()}
              description="Casos históricos registrados"
              loading={globalLoading}
            />
            <StatCard
              title="Casos Activos"
              value={globalLoading ? '...' : globalData?.active?.toLocaleString()}
              description="Actualmente bajo cuidado"
              className="border-l-4 border-l-cyan-500/60"
              loading={globalLoading}
            />
            <StatCard
              title="Recuperados"
              value={globalLoading ? '...' : globalData?.recovered?.toLocaleString()}
              description="Altas médicas certificadas"
              className="border-l-4 border-l-emerald-500/60"
              loading={globalLoading}
            />
            <StatCard
              title="Fallecidos"
              value={globalLoading ? '...' : globalData?.deaths?.toLocaleString()}
              description="Decesos oficiales acumulados"
              className="border-l-4 border-l-rose-500/60"
              loading={globalLoading}
            />
          </div>

          {/* Charts Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Historic Line chart */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800/80 bg-slate-900/20 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200">
                  Histórico de Casos Acumulados
                </h4>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  Evolución temporal de la propagación del virus (últimos 30 días).
                </p>
              </div>

              <div className="h-72">
                {historicalLoading ? (
                  <Skeleton variant="chart" />
                ) : (
                  <LineChart
                    labels={chartLabels}
                    dataValues={chartValues}
                    label="Casos Totales"
                    color="#06b6d4"
                  />
                )}
              </div>
            </div>

            {/* Doughnut distribution */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 bg-slate-900/20 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200">
                  Distribución Global
                </h4>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  Proporción de estados activos, recuperados y muertes.
                </p>
              </div>

              <div className="h-72 flex items-center justify-center">
                {globalLoading ? (
                  <Skeleton variant="avatar" className="h-36 w-36" />
                ) : (
                  <DoughnutChart
                    labels={doughnutLabels}
                    dataValues={doughnutValues}
                    colors={['#06b6d4', '#10b981', '#f43f5e']}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Table Panel */}
          <div className="glass-panel rounded-3xl border border-slate-800/80 bg-slate-900/20 overflow-hidden space-y-4">
            <div className="p-6 pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200">
                  Distribución por Países
                </h4>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  Desglose nacional detallado ordenado por volumen de casos totales.
                </p>
              </div>

              {/* Table search */}
              <div className="relative flex items-center w-full sm:max-w-xs">
                <span className="absolute left-3 text-slate-500">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Buscar país..."
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900/60 dark:bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-cyan/60 text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {countriesLoading ? (
                <Skeleton variant="table" />
              ) : (
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      <th className="px-6 py-3.5">País</th>
                      <th className="px-6 py-3.5 text-right">Casos Totales</th>
                      <th className="px-6 py-3.5 text-right">Activos</th>
                      <th className="px-6 py-3.5 text-right text-emerald-400">Recuperados</th>
                      <th className="px-6 py-3.5 text-right text-rose-400">Fallecidos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300 font-mono">
                    {filteredCountries.slice(0, 10).map((c) => (
                      <tr key={c.country} className="hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-3.5 flex items-center gap-3 font-semibold text-slate-200">
                          {c.countryInfo?.flag && (
                            <img
                              src={c.countryInfo.flag}
                              alt={c.country}
                              className="w-6 h-4 object-cover rounded border border-slate-850"
                              loading="lazy"
                            />
                          )}
                          <span>{c.country}</span>
                        </td>
                        <td className="px-6 py-3.5 text-right font-extrabold text-slate-100">{c.cases.toLocaleString()}</td>
                        <td className="px-6 py-3.5 text-right">{c.active.toLocaleString()}</td>
                        <td className="px-6 py-3.5 text-right text-emerald-400 font-semibold">{c.recovered.toLocaleString()}</td>
                        <td className="px-6 py-3.5 text-right text-rose-400 font-semibold">{c.deaths.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default CovidAnalytics;
