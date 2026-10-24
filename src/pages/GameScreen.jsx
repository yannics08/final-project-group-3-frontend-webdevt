import { useState } from 'react';
import CoffeeMachine from '../components/CoffeeMachine';
import CupShelf from '../components/CupShelf';
import ActiveCup from '../components/ActiveCup';
import GamePaused from '../components/GamePaused';
import LatteDesign from '../components/LatteDesign';
import pauseSvg from '../assets/pause.svg';
import './GameScreen.css';

function GameScreen() {
  const [selectedCup, setSelectedCup] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLatteDesignOpen, setIsLatteDesignOpen] = useState(false);

  const handleIngredientClick = (ingredient) => {
    if (ingredient === 'latte-design') {
      setIsLatteDesignOpen(true);
    }
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
          onServe={() => setIsLatteDesignOpen(false)}
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
