import { useState } from 'react';
import CoffeeMachine from '../components/CoffeeMachine';
import CupShelf from '../components/CupShelf';
import ActiveCup from '../components/ActiveCup';
import GamePaused from '../components/GamePaused';
import LatteDesign from '../components/LatteDesign';
import pauseSvg from '../assets/pause.svg';
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
  const [selectedCup, setSelectedCup] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLatteDesignOpen, setIsLatteDesignOpen] = useState(false);

  const handleIngredientClick = (ingredient) => {
    if (ingredient === 'latte-design') {
      setIsLatteDesignOpen(true);
    }
  };

  const handleServe = (result) => {
    const earnedPoints = result?.matchPercent ?? 0;
    recordCompletedGame(earnedPoints);
    setSelectedCup(null);
    setIsLatteDesignOpen(false);
  };

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

        <LatteDesign
          isOpen={isLatteDesignOpen}
          onServe={handleServe}
          onCancel={() => setIsLatteDesignOpen(false)}
        />

        <GamePaused
          isOpen={isPaused}
          onContinue={() => setIsPaused(false)}
          onRestart={() => {
            setSelectedCup(null);
            setIsLatteDesignOpen(false);
          }}
        />
      </main>
    </div>
  );
}

export default GameScreen;
