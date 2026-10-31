import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';

// Loads the leaderboard and tells the component what state it is in.
export function useLeaderboard(limit) {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // If the component closes before the answer arrives,
    // the cleanup below sets this to true and the answer is ignored.
    let isCancelled = false;

    async function loadLeaderboard() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await getLeaderboard(limit);
        if (isCancelled) return;
        setPlayers(data.leaderboard);
      } catch (error) {
        if (isCancelled) return;
        setErrorMessage(error.message);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadLeaderboard();

    return () => {
      isCancelled = true;
    };
  }, [limit, reloadKey]);

  // The component can call this to try again after an error.
  function reload() {
    setReloadKey((key) => key + 1);
  }

  return { players, isLoading, errorMessage, reload };
}