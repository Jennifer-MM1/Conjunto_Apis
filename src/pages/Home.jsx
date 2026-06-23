import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card3D } from '../components/ui/Card3D';
import {
  Tv,
  Sparkles,
  Smile,
  Laugh,
  MessageSquare,
  Users,
  CloudSun,
  HeartPulse,
  Coins,
  Cpu,
  Globe2,
  CheckCircle2
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  // Get active greeting based on local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const sections = [
    {
      path: '/anime',
      name: 'Anime Explorer',
      description: 'Explora y busca animes, películas y personajes populares con Jikan API.',
      icon: Tv,
      category: 'Geek Hub',
      color: 'border-violet-500/30 text-violet-400'
    },
    {
      path: '/pokedex',
      name: 'Pokédex Interactivo',
      description: 'Estadísticas visuales en gráficos, habilidades y hábitats con PokéAPI.',
      icon: Sparkles,
      category: 'Geek Hub',
      color: 'border-amber-500/30 text-amber-400'
    },
    {
      path: '/rickandmorty',
      name: 'Rick & Morty Explorer',
      description: 'Explorador con filtros de estado y especies mediante The Rick and Morty API.',
      icon: Smile,
      category: 'Geek Hub',
      color: 'border-emerald-500/30 text-emerald-400'
    },
    {
      path: '/jokes',
      name: 'Chuck Norris Jokes',
      description: 'Generador de chistes por categorías con transiciones y Chuck Norris API.',
      icon: Laugh,
      category: 'Geek Hub',
      color: 'border-pink-500/30 text-pink-400'
    },
    {
      path: '/forum',
      name: 'Foro Social',
      description: 'Foro simulado para leer publicaciones y agregar comentarios con JSONPlaceholder.',
      icon: MessageSquare,
      category: 'Simulación',
      color: 'border-blue-500/30 text-blue-400'
    },
    {
      path: '/directory',
      name: 'Directorio de Equipo',
      description: 'Manejo de usuarios, avatares, correos y ubicaciones con Random User API.',
      icon: Users,
      category: 'Simulación',
      color: 'border-teal-500/30 text-teal-400'
    },
    {
      path: '/weather',
      name: 'Clima & Mapas',
      description: 'Condiciones actuales y pronóstico con fondos dinámicos y OpenWeather API.',
      icon: CloudSun,
      category: 'Tiempo Real',
      color: 'border-orange-500/30 text-orange-400'
    },
    {
      path: '/covid',
      name: 'COVID Analytics',
      description: 'Panel de estadísticas históricas globales y tablas de países con disease.sh.',
      icon: HeartPulse,
      category: 'Tiempo Real',
      color: 'border-rose-500/30 text-rose-400'
    },
    {
      path: '/crypto',
      name: 'Crypto Tracker',
      description: 'Seguimiento financiero en vivo con CoinGecko y resiliencia en fallos.',
      icon: Coins,
      category: 'Tiempo Real',
      color: 'border-cyan-500/30 text-cyan-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative glass-panel p-8 md:p-10 rounded-3xl overflow-hidden border-slate-800/80 bg-gradient-to-r from-slate-900/60 via-slate-950/40 to-slate-900/60">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest bg-brand-cyan/10 px-3 py-1 rounded-full">
              SISTEMA MULTI-APIS INTEGRADO
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
              {getGreeting()} Bienvenido al API Hub
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Una plataforma interactiva premium diseñada para explorar y consumir 9 APIs públicas diferentes, cuidando al máximo la UX/UI, accesibilidad y rendimiento.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center p-4 bg-slate-900/80 border border-slate-800 rounded-2xl w-24">
              <Cpu size={24} className="text-brand-cyan mb-2" />
              <span className="text-2xl font-bold font-mono text-slate-100">9</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">APIs</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-900/80 border border-slate-800 rounded-2xl w-24">
              <Globe2 size={24} className="text-brand-violet mb-2" />
              <span className="text-2xl font-bold font-mono text-slate-100">100%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of API Pages */}
      <div>
        <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
          <span>Secciones del Dashboard</span>
          <span className="h-px bg-slate-800/80 flex-1 ml-4" />
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card3D
                key={idx}
                onClick={() => navigate(section.path)}
                className={`border-l-4 ${section.color.split(' ')[0]} flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800/60">
                      {section.category}
                    </span>
                    <CheckCircle2 size={14} className="text-brand-emerald" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 bg-slate-900/80 rounded-xl ${section.color.split(' ')[1]}`}>
                      <Icon size={20} />
                    </div>
                    <h4 className="text-base font-extrabold text-slate-200">
                      {section.name}
                    </h4>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-end">
                  <span className="text-[10px] font-bold text-brand-cyan group-hover:underline">
                    Explorar sección →
                  </span>
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Home;
