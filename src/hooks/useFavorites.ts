import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'shallow-nav-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((siteId: string) => {
    setFavorites(prev =>
      prev.includes(siteId)
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  }, []);

  const isFavorite = useCallback(
    (siteId: string) => favorites.includes(siteId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
