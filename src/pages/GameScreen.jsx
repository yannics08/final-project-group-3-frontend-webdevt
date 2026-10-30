import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom'; // NEW: Navigate
import CoffeeMachine from '../components/CoffeeMachine';
import CupShelf from '../components/CupShelf';
import ActiveCup from '../components/ActiveCup';
import GamePaused from '../components/GamePaused';
import pauseSvg from '../assets/pause.svg';
import { useGame } from '../context/GameContext'; // NEW
import './GameScreen.css';

const USERS_STORAGE_KEY = 'madcoffee_users';
const CURRENT_USER_STORAGE_KEY = 'madcoffee_current_user';

function recordCompletedGame(earnedPoints = 0) {
  try {
    const rawCurrent = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!rawCurrent) return;
    const current = JSON.parse(rawCurrent);
    if (!current?.username) return;

    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const users = rawUsers ? JSON.parse(rawUsers) : [];
    let updatedCurrent = {
      ...current,
      day: (current.day ?? 0) + 1,
      points: (current.points ?? 0) + earnedPoints,
    };

    const updatedUsers = users.map((u) => {
      if (u.username.toLowerCase() === current.username.toLowerCase()) {
        const nextDay = (u.day ?? 0) + 1;
        const nextPoints = (u.points ?? 0) + earnedPoints;
        updatedCurrent = { ...updatedCurrent, day: nextDay, points: nextPoints };
        return { ...u, day: nextDay, points: nextPoints };
      }
      return u;
    });

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedCurrent));
  } catch {
    return;
  }
}

function GameScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, recipes } = useGame(); // NEW
  const [selectedCup, setSelectedCup] = useState(
    () => location.state?.selectedCup ?? null
  );
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (location.state?.latteResult) {
      const earnedPoints = location.state.latteResult.matchPercent ?? 0;
      recordCompletedGame(earnedPoints);
      navigate(location.pathname, {
        replace: true,
        state: { selectedCup: location.state?.selectedCup ?? null },
      });
    }
  }, [location.pathname, location.state, navigate]);

  const handleIngredientClick = (ingredient) => {
    if (ingredient === 'latte-design') {
      navigate('/latte-design', { state: { selectedCup } });
    }
  };

  // NEW: no session means the page was refreshed or /game was opened directly.
  // This must stay BELOW every hook above (useState, useEffect, useGame).
  if (!sessionId) {
    return <Navigate to="/" replace />;
  }

  console.log('Session:', sessionId, 'Recipes:', recipes); // NEW: temporary test line

  return (
    <div className="gameplay-container">
      <main className="gameplay-screen" aria-label="Mad Coffee Gameplay Screen">
        <button
          type="button"
          className="gameplay-pause-btn"
          onClick={() => setIsPaused(true)}
          aria-label="Pause Game"
          title="Pause"
        >
          <img src={pauseSvg} alt="" draggable="false" />
        </button>

        <CoffeeMachine
          selectedCup={selectedCup}
          onIngredientClick={handleIngredientClick}
        />
        <ActiveCup cupType={selectedCup} />
        <CupShelf onSelectCup={setSelectedCup} />

        <GamePaused
          isOpen={isPaused}
          onContinue={() => setIsPaused(false)}
          onRestart={() => {
            setSelectedCup(null);
          }}
        />
      </main>
    </div>
  );
}

export default GameScreen;