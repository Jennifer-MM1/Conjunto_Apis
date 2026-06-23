import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : { anime: [], pokemon: [], characters: [] };
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (category, item) => {
    setFavorites(prev => {
      const list = prev[category] || [];
      if (list.some(i => i.id === item.id)) return prev;
      return {
        ...prev,
        [category]: [...list, item]
      };
    });
  };

  const removeFavorite = (category, itemId) => {
    setFavorites(prev => {
      const list = prev[category] || [];
      return {
        ...prev,
        [category]: list.filter(item => item.id !== itemId)
      };
    });
  };

  const isFavorite = (category, itemId) => {
    const list = favorites[category] || [];
    return list.some(item => item.id === itemId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser utilizado dentro de un FavoritesProvider');
  }
  return context;
};
