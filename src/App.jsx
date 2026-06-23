import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Layout } from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import AnimeExplorer from './pages/AnimeExplorer';
import Pokedex from './pages/Pokedex';
import RickAndMorty from './pages/RickAndMorty';
import ChuckNorris from './pages/ChuckNorris';
import Forum from './pages/Forum';
import UserDirectory from './pages/UserDirectory';
import Weather from './pages/Weather';
import CovidAnalytics from './pages/CovidAnalytics';
import CryptoTracker from './pages/CryptoTracker';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime" element={<AnimeExplorer />} />
              <Route path="/pokedex" element={<Pokedex />} />
              <Route path="/rickandmorty" element={<RickAndMorty />} />
              <Route path="/jokes" element={<ChuckNorris />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/directory" element={<UserDirectory />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/covid" element={<CovidAnalytics />} />
              <Route path="/crypto" element={<CryptoTracker />} />
            </Routes>
          </Layout>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
