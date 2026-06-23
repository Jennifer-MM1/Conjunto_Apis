import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Card3D } from '../components/ui/Card3D';
import {
  CloudSun,
  Droplets,
  Wind,
  Compass,
  Thermometer,
  Search,
  Calendar,
  CloudLightning,
  CloudRain,
  Sun,
  Cloud,
  Snowflake
} from 'lucide-react';

export const Weather = () => {
  const [city, setCity] = useState('Mexico City');
  const [searchCity, setSearchCity] = useState('Mexico City');
  const [forecastData, setForecastData] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  const fetchWeather = React.useCallback(() => {
    return api.weather.getCurrent(searchCity);
  }, [searchCity]);

  const { data: weatherData, loading: weatherLoading, error: weatherError, execute } = useFetch(fetchWeather, true);

  // Fetch forecast when search city changes
  useEffect(() => {
    setForecastLoading(true);
    api.weather.getForecast(searchCity)
      .then(res => {
        // Forecast returns list of items every 3 hours.
        // We filter to get one item per day (around 12:00 PM)
        const daily = res.list.filter(item => item.dt_txt.includes('12:00:00'));
        setForecastData(daily);
      })
      .catch(err => console.error(err))
      .finally(() => setForecastLoading(false));
  }, [searchCity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== '') {
      setSearchCity(city);
    }
  };

  // Get dynamic weather icons based on weather condition
  const getWeatherIcon = (mainCondition, size = 24) => {
    switch (mainCondition?.toLowerCase()) {
      case 'thunderstorm':
        return <CloudLightning size={size} className="text-brand-pink" />;
      case 'drizzle':
      case 'rain':
        return <CloudRain size={size} className="text-brand-cyan animate-pulse" />;
      case 'snow':
        return <Snowflake size={size} className="text-blue-200" />;
      case 'clear':
        return <Sun size={size} className="text-amber-400 animate-spin-slow" />;
      case 'clouds':
        return <Cloud size={size} className="text-slate-400" />;
      default:
        return <CloudSun size={size} className="text-brand-violet" />;
    }
  };

  // Get dynamic background gradient class based on weather
  const getDynamicBackground = () => {
    if (!weatherData) return 'from-slate-900/60 to-slate-950';
    const cond = weatherData.weather[0]?.main?.toLowerCase();
    switch (cond) {
      case 'clear':
        return 'from-amber-500/10 via-orange-600/5 to-slate-950 border-amber-500/10';
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return 'from-indigo-600/10 via-cyan-950/5 to-slate-950 border-indigo-500/10';
      case 'snow':
        return 'from-cyan-400/10 via-blue-900/5 to-slate-950 border-cyan-400/10';
      case 'clouds':
        return 'from-slate-700/10 via-slate-800/5 to-slate-950 border-slate-700/10';
      default:
        return 'from-slate-900/60 to-slate-950 border-slate-800/80';
    }
  };

  // Translate day names
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            🌦️ Pronóstico Climatológico
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Buscador del clima actual y pronóstico semanal utilizando la API de OpenWeather. El fondo cambia según las condiciones.
          </p>
        </div>

        {/* Search City form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto max-w-sm">
          <div className="relative flex items-center w-full">
            <span className="absolute left-3.5 text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Buscar ciudad (ej. Madrid, Tokyo)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/60 dark:bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-cyan/60 text-xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-brand-violet to-brand-cyan hover:from-brand-violet/90 hover:to-brand-cyan/90 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md hover:shadow-cyan-500/10"
          >
            Buscar
          </button>
        </form>
      </div>

      {weatherError ? (
        <ErrorState message="No pudimos encontrar el clima de la ciudad especificada. Por favor, verifica la ortografía." onRetry={execute} />
      ) : weatherLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-2 h-80 bg-slate-900 rounded-2xl" />
          <div className="h-80 bg-slate-900 rounded-2xl" />
        </div>
      ) : (
        weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Weather Card */}
            <div className={`lg:col-span-2 glass-panel p-8 rounded-3xl border bg-gradient-to-br ${getDynamicBackground()} transition-all duration-500 flex flex-col justify-between min-h-[320px]`}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    CLIMA ACTUAL
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-100 uppercase tracking-wide">
                    {weatherData.name}, {weatherData.sys?.country}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize">
                    {weatherData.weather[0]?.description}
                  </p>
                </div>

                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-inner">
                  {getWeatherIcon(weatherData.weather[0]?.main, 36)}
                </div>
              </div>

              <div className="flex items-baseline gap-2 my-6">
                <span className="text-6xl font-extrabold text-slate-100 font-mono tracking-tighter">
                  {Math.round(weatherData.main.temp)}°C
                </span>
                <div className="text-xs text-slate-500 font-mono">
                  <div>Máx: {Math.round(weatherData.main.temp_max)}°C</div>
                  <div>Mín: {Math.round(weatherData.main.temp_min)}°C</div>
                </div>
              </div>

              {/* Extra Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-900 pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900/60 rounded-xl text-brand-cyan">
                    <Thermometer size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Sensación</span>
                    <span className="text-xs font-semibold text-slate-200 font-mono">{Math.round(weatherData.main.feels_like)}°C</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900/60 rounded-xl text-brand-violet">
                    <Droplets size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Humedad</span>
                    <span className="text-xs font-semibold text-slate-200 font-mono">{weatherData.main.humidity}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900/60 rounded-xl text-emerald-400">
                    <Wind size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Viento</span>
                    <span className="text-xs font-semibold text-slate-200 font-mono">{Math.round(weatherData.wind.speed * 3.6)} km/h</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900/60 rounded-xl text-amber-500">
                    <Compass size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Presión</span>
                    <span className="text-xs font-semibold text-slate-200 font-mono">{weatherData.main.pressure} hPa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Panel */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 bg-slate-900/20 flex flex-col">
              <h4 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">
                <Calendar size={16} className="text-brand-cyan" />
                <span>Pronóstico de la Semana</span>
              </h4>

              {forecastLoading ? (
                <div className="space-y-4 flex-1 justify-center flex flex-col">
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </div>
              ) : (
                <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                  {forecastData?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/60 border border-slate-900 hover:border-slate-800 rounded-xl flex items-center justify-between gap-4 transition-all duration-200"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-200 capitalize block">
                          {getDayName(item.dt_txt)}
                        </span>
                        <span className="text-[9px] text-slate-500 font-semibold capitalize block">
                          {item.weather[0]?.description}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono">
                        {getWeatherIcon(item.weather[0]?.main, 18)}
                        <span className="text-xs font-extrabold text-slate-100">
                          {Math.round(item.main.temp)}°C
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
export default Weather;
