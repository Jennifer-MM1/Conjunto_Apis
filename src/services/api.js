// OpenWeather API Key provided by user
const WEATHER_API_KEY = 'ac0';

// Custom fetch wrapper with timeout
const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Límite de peticiones excedido (429). Por favor, espera un momento.');
      }
      throw new Error(`Error de servidor: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const api = {
  // 1. Anime Explorer (Jikan API v4)
  anime: {
    search: async (query = '', page = 1, limit = 12) => {
      const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
      return fetchWithTimeout(url);
    },
    getTop: async (page = 1, limit = 12) => {
      const url = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${limit}`;
      return fetchWithTimeout(url);
    },
    getDetails: async (id) => {
      const url = `https://api.jikan.moe/v4/anime/${id}/full`;
      return fetchWithTimeout(url);
    }
  },

  // 2. PokéAPI
  pokemon: {
    getList: async (page = 1, limit = 20) => {
      const offset = (page - 1) * limit;
      const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
      const data = await fetchWithTimeout(url);
      
      // Fetch detail for each pokemon to display images/types in grid
      const detailPromises = data.results.map(p => fetchWithTimeout(p.url));
      const details = await Promise.all(detailPromises);
      
      return {
        results: details.map(d => ({
          id: d.id,
          name: d.name,
          image: d.sprites.other['official-artwork'].front_default || d.sprites.front_default,
          types: d.types.map(t => t.type.name),
          stats: d.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
          abilities: d.abilities.map(a => a.ability.name),
          weight: d.weight / 10, // kg
          height: d.height / 10  // m
        })),
        totalCount: data.count
      };
    },
    getSpecies: async (id) => {
      const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
      return fetchWithTimeout(url).catch(() => ({ habitat: { name: 'Desconocido' }, flavor_text_entries: [] }));
    }
  },

  // 3. Rick & Morty API
  rickAndMorty: {
    getCharacters: async (page = 1, name = '', status = '', species = '') => {
      let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
      if (name) url += `&name=${encodeURIComponent(name)}`;
      if (status) url += `&status=${status}`;
      if (species) url += `&species=${encodeURIComponent(species)}`;
      return fetchWithTimeout(url);
    }
  },

  // 4. Chuck Norris Jokes
  chuckNorris: {
    getRandom: async (category = '') => {
      let url = 'https://api.chucknorris.io/jokes/random';
      if (category) url += `?category=${category}`;
      return fetchWithTimeout(url);
    },
    getCategories: async () => {
      const url = 'https://api.chucknorris.io/jokes/categories';
      return fetchWithTimeout(url);
    }
  },

  // 5. JSONPlaceholder (Forum)
  forum: {
    getPosts: async (limit = 10) => {
      const url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`;
      return fetchWithTimeout(url);
    },
    getComments: async (postId) => {
      const url = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
      return fetchWithTimeout(url);
    }
  },

  // 6. Random User Directory
  users: {
    getList: async (results = 12, page = 1) => {
      const url = `https://randomuser.me/api/?results=${results}&page=${page}&seed=hubdashboard`;
      return fetchWithTimeout(url);
    }
  },

  // 7. OpenWeather API
  weather: {
    getCurrent: async (city) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&lang=es`;
      return fetchWithTimeout(url);
    },
    getForecast: async (city) => {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&lang=es`;
      return fetchWithTimeout(url);
    }
  },

  // 8. COVID-19 Analytics (disease.sh API)
  covid: {
    getGlobal: async () => {
      const url = 'https://disease.sh/v3/covid-19/all';
      return fetchWithTimeout(url);
    },
    getCountries: async () => {
      const url = 'https://disease.sh/v3/covid-19/countries?sort=cases';
      return fetchWithTimeout(url);
    },
    getHistorical: async (days = 30) => {
      const url = `https://disease.sh/v3/covid-19/historical/all?lastdays=${days}`;
      return fetchWithTimeout(url);
    }
  },

  // 9. Crypto Tracker (CoinGecko API)
  crypto: {
    getMarkets: async (perPage = 10, page = 1) => {
      // CoinGecko can be rate-limited on free tier easily.
      // If fails, we fall back to pre-defined mock coins data so page never breaks.
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`;
      try {
        return await fetchWithTimeout(url, {}, 5000);
      } catch (err) {
        console.warn('CoinGecko API failed, using fallback mock data:', err);
        return getMockCryptoData(perPage, page);
      }
    }
  }
};

// Fallback Crypto Data to guarantee resilience (UX heuristic)
function getMockCryptoData(perPage, page) {
  const allMockCoins = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 64230.50, price_change_percentage_24h: 2.34, market_cap: 1264879201990, total_volume: 28450129033 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3480.25, price_change_percentage_24h: -1.12, market_cap: 418049102930, total_volume: 15920390192 },
    { id: 'tether', symbol: 'usdt', name: 'Tether', image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', current_price: 1.00, price_change_percentage_24h: 0.05, market_cap: 112930102000, total_volume: 48920102039 },
    { id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png', current_price: 575.40, price_change_percentage_24h: 4.89, market_cap: 84920192000, total_volume: 1920102030 },
    { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 138.65, price_change_percentage_24h: -5.43, market_cap: 64201902000, total_volume: 3840290122 },
    { id: 'ripple', symbol: 'xrp', name: 'Ripple', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', current_price: 0.485, price_change_percentage_24h: 0.76, market_cap: 26901020390, total_volume: 890102039 },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', current_price: 0.124, price_change_percentage_24h: -3.81, market_cap: 18019203940, total_volume: 1204910293 },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', current_price: 0.382, price_change_percentage_24h: 1.45, market_cap: 13692019203, total_volume: 320192039 },
    { id: 'shiba-inu', symbol: 'shib', name: 'Shiba Inu', image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png', current_price: 0.0000179, price_change_percentage_24h: -4.12, market_cap: 10592019203, total_volume: 450192039 },
    { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', current_price: 25.40, price_change_percentage_24h: 8.92, market_cap: 9840290390, total_volume: 512930291 }
  ];

  const startIndex = (page - 1) * perPage;
  const sliced = allMockCoins.slice(startIndex, startIndex + perPage);
  return sliced;
}
