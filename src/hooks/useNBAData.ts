import { useState, useEffect } from 'react';
import { fetchNBAData, NBAPlayer } from '@/data/nbaDataService';

export const useNBAData = () => {
  const [players, setPlayers] = useState<NBAPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNBAData();
        setPlayers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load NBA data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { players, loading, error };
}; 