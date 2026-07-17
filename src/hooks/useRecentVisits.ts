import { useState, useCallback, useEffect } from 'react';
import type { Site } from '../types';

const STORAGE_KEY = 'shallow-nav-recent';
const MAX_RECENT = 10;

export function useRecentVisits() {
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds));
  }, [recentIds]);

  const addVisit = useCallback((siteId: string) => {
    setRecentIds(prev => {
      const filtered = prev.filter(id => id !== siteId);
      return [siteId, ...filtered].slice(0, MAX_RECENT);
    });
  }, []);

  const getRecentSites = useCallback((allSites: Site[]) => {
    return recentIds
      .map(id => allSites.find(s => s.id === id))
      .filter((s): s is Site => s !== undefined);
  }, [recentIds]);

  const clearRecent = useCallback(() => {
    setRecentIds([]);
  }, []);

  return { recentIds, addVisit, getRecentSites, clearRecent };
}
