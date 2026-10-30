import { createContext, useContext, useState } from 'react';
import { startSession } from '../services/api';

// Step 1: create the Context. It starts as null.
const GameContext = createContext(null);

// Step 2: the Provider component. It holds the shared data.
export function GameProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [config, setConfig] = useState(null);
  const [recipes, setRecipes] = useState([]);

  // Asks the server to start a game and saves what it sends back.
  // If the request fails, the error is thrown so the caller can show it.
  async function startGame() {
    const data = await startSession();
    setSessionId(data.sessionId);
    setConfig(data.config);
    setRecipes(data.recipes);
  }

  function clearGame() {
    setSessionId(null);
    setConfig(null);
    setRecipes([]);
  }

  const value = {
    sessionId: sessionId,
    config: config,
    recipes: recipes,
    startGame: startGame,
    clearGame: clearGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Step 3: a custom hook so components can read the data in one line.
export function useGame() {
  const context = useContext(GameContext);
  if (context === null) {
    throw new Error('useGame must be used inside a GameProvider');
  }
  return context;
}