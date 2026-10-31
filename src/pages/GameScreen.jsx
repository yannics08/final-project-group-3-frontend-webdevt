import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import { usePatience } from '../hooks/usePatience';
import { useGameClock } from '../hooks/useGameClock';
import {
  evaluateOrderLocally,
  submitOrder,
  finishSession,
  buildOrderPayload,
  pickNextCustomer,
  clearSavedLogin,
} from '../services/api';
import CoffeeMachine from '../components/CoffeeMachine';
import CupShelf from '../components/CupShelf';
import ActiveCup from '../components/ActiveCup';
import GamePaused from '../components/GamePaused';
import LatteDesign from '../components/LatteDesign';
import Customer from '../components/Customer';
import OrderBubble from '../components/OrderBubble';
import ServeButton from '../components/ServeButton';
import GameHud from '../components/GameHud';
import pauseSvg from '../assets/pause.svg';
import { useGame } from '../context/GameContext';
import './GameScreen.css';

const USERS_STORAGE_KEY = 'madcoffee_users';
const CURRENT_USER_STORAGE_KEY = 'madcoffee_current_user';

// A customer who leaves is sent with an empty drink.
const EMPTY_DRINK = {
  selectedCup: null,
  selectedTemperature: null,
  selectedIngredients: [],
};

// The customer looks angry when patience is this low or lower.
const LOW_PATIENCE = 30;

// Pauses an async function for a moment. "await wait(1500)" waits 1.5 seconds.
function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function GamePlay({ onRestartRun }) {
  const { sessionId, config, recipes, startGame, reloadRecipes, clearGame } = useGame();
  const order = useOrder(config);
  const navigate = useNavigate();

  // Account notice: if the admin deleted this account, send the player home.
  useEffect(() => {
    function checkAccountStatus() {
      try {
        const rawCurrent = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
        if (!rawCurrent) return;
        const current = JSON.parse(rawCurrent);
        const name = (current?.username || current?.displayName)?.toLowerCase();
        if (!name || current.isAdmin) return;
        const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const entry =
          users.find((u) => u.username?.toLowerCase() === name) ||
          users.find((u) => u.resetFrom?.toLowerCase() === name);
        if (!entry) return;
        if (entry.deleted) {
          navigate('/', { replace: true });
          return;
        }
        if (entry.username.toLowerCase() !== name) {
          localStorage.setItem(
            CURRENT_USER_STORAGE_KEY,
            JSON.stringify({
              ...current,
              username: entry.username,
              nameResetPending: Boolean(entry.nameResetPending),
            })
          );
        }
      } catch {
        return;
      }
    }

    checkAccountStatus();
    const intervalId = setInterval(checkAccountStatus, 1500);
    return () => clearInterval(intervalId);
  }, [navigate]);

  const [isPaused, setIsPaused] = useState(false);
  const [isLatteOpen, setIsLatteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // sending one customer's order
  const [isFinishing, setIsFinishing] = useState(false); // finishing, leaving or restarting
  const [finishResult, setFinishResult] = useState(null);
  const [finishError, setFinishError] = useState('');
  const [lastServe, setLastServe] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [serveMessage, setServeMessage] = useState('');

  // One customer at a time.
  const [customer, setCustomer] = useState(() => pickNextCustomer(0, config, recipes));
  const [mood, setMood] = useState('default');
  const [orderNumber, setOrderNumber] = useState(1);

  // The game clock (180 seconds, frozen while paused).
  const totalSeconds = config?.sessionLengthSeconds ?? 180;
  const maxPauseSeconds = config?.maxPauseSeconds ?? 120;
  const { playedSeconds, pausedSeconds, secondsLeft, isOver } = useGameClock(
    totalSeconds,
    isPaused
  );

  // The patience timer stops while paused, busy, or once the game is over.
  const { patience, secondsLeft: patienceSecondsLeft, resetPatience } = usePatience(
    customer.customerType,
    !isPaused && !isSubmitting && !isFinishing && !isOver
  );

  // When patience reaches 0, the customer leaves.
  useEffect(() => {
    if (patience <= 0 && !isOver) {
      handleCustomerLeft();
    }
    // The effect should only run when patience changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patience]);

  // When the pause time is used up, the game resumes by itself.
  useEffect(() => {
    if (isPaused && pausedSeconds >= maxPauseSeconds) {
      setIsPaused(false);
    }
  }, [isPaused, pausedSeconds, maxPauseSeconds]);

  // When the clock reaches 0, finish the game (after any order that is being sent).
  useEffect(() => {
    if (isOver && !isSubmitting && !isFinishing && finishResult === null && finishError === '') {
      finishGame();
    }
    // Only react to these two values changing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver, isSubmitting]);

  const handleIngredientClick = (buttonName) => {
    // Nothing works while paused, busy, or after the game is over.
    if (isPaused || isSubmitting || isFinishing || isOver) return false;

    if (buttonName === 'latte-design') {
      // Only for customers who asked for a design, and one attempt per drink.
      if (!customer.traceRequired || order.traceScore !== null) return false;
      setIsLatteOpen(true);
      return false; // false means no dispense animation
    }
    return order.pressButton(buttonName);
  };

  const handleLatteDone = (result) => {
    order.saveTrace(result.design, result.matchPercent);
    setIsLatteOpen(false);
  };

  // No session means the page was refreshed or /game was opened directly.
  // This must stay BELOW every hook above.
  if (!sessionId) {
    return <Navigate to="/" replace />;
  }

  // What the player has made so far, and a local estimate of the result.
  const servedNow = order.getServedItems();
  const localResult = evaluateOrderLocally(customer, {
    ...servedNow,
    traceShown: customer.traceRequired,
    traceScore: order.traceScore ?? 0,
    patienceRemaining: patience,
  });

  // An angry face when patience is low (unless a result is being shown).
  const shownMood = mood === 'default' && patience <= LOW_PATIENCE ? 'mad' : mood;

  // The pause total, as a whole number, never above the allowed maximum.
  function getPausedTotal() {
    return Math.min(Math.round(pausedSeconds), maxPauseSeconds);
  }

  // Brings in the next customer. (playedSeconds can be up to ~2 seconds old here,
  // which does not matter for the spawn weights.)
  function startNextCustomer(recipeList) {
    setCustomer(pickNextCustomer(playedSeconds, config, recipeList));
    setMood('default');
    setOrderNumber((previous) => previous + 1);
    resetPatience();
  }

  // Sends one customer's order to the server. Used for serving AND for leaving.
  async function finishCustomer(servedItems, traceScore, patienceValue, isLeaving) {
    // Never send two requests at once (rule 10 of the API).
    if (isSubmitting || isFinishing || isOver) return;

    setIsSubmitting(true);
    setServeMessage('');
    try {
      const payload = buildOrderPayload(customer, servedItems, traceScore, patienceValue);
      const data = await submitOrder(sessionId, payload);

      setLastServe({
        server: data.result,
        localCombined: isLeaving ? null : localResult.combinedAccuracy,
      });
      setSessionStats(data.session);
      order.resetOrder();
      setMood(data.result.satisfied ? 'happy' : 'mad');

      // Let the player see the reaction, then the next customer arrives.
      await wait(1500);
      startNextCustomer(recipes);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        // Login expired or banned: forget everything. With no session,
        // the guard above sends the player to the home page.
        clearSavedLogin();
        clearGame();
      } else if (error.code === 'RECIPE_NOT_FOUND') {
        // The recipe list changed on the server. Reload it and start fresh.
        try {
          const freshRecipes = await reloadRecipes();
          order.resetOrder();
          startNextCustomer(freshRecipes);
          setServeMessage('The menu was updated, so a new customer has arrived.');
        } catch (reloadError) {
          setServeMessage(reloadError.message);
        }
      } else {
        setServeMessage(error.message);
        // A customer who left cannot be retried, so move on to the next one.
        if (isLeaving) {
          order.resetOrder();
          startNextCustomer(recipes);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // The player pressed Serve.
  function handleServe() {
    if (!order.cupCode) return;
    finishCustomer(servedNow, order.traceScore, patience, false);
  }

  // The customer ran out of patience.
  function handleCustomerLeft() {
    setIsLatteOpen(false);
    finishCustomer(EMPTY_DRINK, null, 0, true);
  }

  // The clock reached 0: end the game on the server and get the results.
  async function finishGame() {
    // Never send the same finish request twice (rule 10 of the API).
    if (isFinishing) return;

    setIsFinishing(true);
    setFinishError('');
    try {
      let data;
      try {
        data = await finishSession(sessionId, 'completed', getPausedTotal());
      } catch (error) {
        // If "completed" is refused for timing (400), the API says to send "quit".
        if (error.status === 400) {
          data = await finishSession(sessionId, 'quit', getPausedTotal());
        } else {
          throw error;
        }
      }
      setFinishResult(data.result);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        clearSavedLogin();
        clearGame();
      } else {
        setFinishError(error.message);
      }
    } finally {
      setIsFinishing(false);
    }
  }

  // The player opened the pause menu.
  function handlePause() {
    if (isOver || isFinishing) return;
    // All 120 seconds of pause time are used up.
    if (pausedSeconds >= maxPauseSeconds) return;
    setIsPaused(true);
  }

  // Restart: the server closes the old session by itself when a new one starts.
  async function handleRestart() {
    if (isFinishing) return;

    setIsFinishing(true);
    try {
      await startGame();
      onRestartRun(); // remounts this whole component with fresh state
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        clearSavedLogin();
        clearGame();
      } else {
        setServeMessage(error.message);
      }
      setIsFinishing(false);
    }
  }

  // The player confirmed leaving through the pause menu.
  async function handleLeave() {
    if (isFinishing) return;

    setIsFinishing(true);
    try {
      await finishSession(sessionId, 'quit', getPausedTotal());
    } catch (error) {
      // The player wants to leave anyway, so we do not stop here.
      console.log('Could not save the quit request:', error);
    }
    clearGame(); // no session left, so the guard sends the player home
  }

  return (
    <div className="gameplay-container">
      <main className="gameplay-screen" aria-label="Mad Coffee Gameplay Screen">
        <GameHud
          secondsLeft={secondsLeft}
          score={sessionStats ? sessionStats.runningScore : 0}
        />

        <Customer
          key={customer.id}
          customerType={customer.customerType}
          customerVariant={customer.customerVariant}
          mood={shownMood}
        />

        <OrderBubble
          customer={customer}
          servedItems={servedNow}
          traceScore={order.traceScore}
          orderNumber={orderNumber}
          patience={patience}
          secondsLeft={patienceSecondsLeft}
        />

        <ServeButton
          onClick={handleServe}
          disabled={isSubmitting || isFinishing || isOver || !order.cupCode}
        />

        {/* TEMPORARY test panel. Delete it when you no longer need it. */}
        <div
          style={{
            position: 'absolute',
            left: 8,
            bottom: 8,
            zIndex: 100,
            background: 'rgba(255,255,255,0.92)',
            color: '#000000',
            padding: 8,
            fontSize: 12,
            fontFamily: 'monospace',
            maxWidth: 360,
          }}
        >
          <div>
            Clock: played {Math.round(playedSeconds)}s | paused {Math.round(pausedSeconds)}s
          </div>
          <div>
            Customer: {customer.customerType} {customer.customerVariant} | trace:{' '}
            {customer.traceRequired ? customer.traceDesign : 'none'}
          </div>
          <div>
            Target: {customer.recipe.cup}, {customer.recipe.temperature},{' '}
            {customer.recipe.ingredients.join(', ')}
          </div>
          <div>
            Served: {servedNow.selectedCup}, {servedNow.selectedTemperature},{' '}
            {servedNow.selectedIngredients.join(', ')}
          </div>
          <div>
            Mistakes: {localResult.mistakeCount} | Combined: {localResult.combinedAccuracy}%
          </div>

          {serveMessage && <div style={{ color: '#B00020' }}>{serveMessage}</div>}

          {lastServe && (
            <div style={{ marginTop: 6 }}>
              <div>
                Server: {lastServe.server.satisfied ? 'SATISFIED' : 'DISSATISFIED'} | points{' '}
                {lastServe.server.pointsEarned} | patience {lastServe.server.patienceRemaining}
              </div>
              <div>
                Needed {lastServe.server.requiredAccuracy}% | got {lastServe.server.combinedAccuracy}%
                {lastServe.localCombined !== null && (
                  <> (local estimate {lastServe.localCombined}%)</>
                )}
              </div>
              <div>Mistakes: {lastServe.server.mistakeCount}</div>
            </div>
          )}

          {sessionStats && (
            <div>
              Score: {sessionStats.runningScore} | completed {sessionStats.ordersCompleted} | failed{' '}
              {sessionStats.ordersFailed}
            </div>
          )}
        </div>

        <button
          type="button"
          className="gameplay-pause-btn"
          onClick={handlePause}
          aria-label="Pause Game"
          title="Pause"
        >
          <img src={pauseSvg} alt="" draggable="false" />
        </button>

        <CoffeeMachine
          selectedCup={order.cupCode}
          onIngredientClick={handleIngredientClick}
        />
        <ActiveCup cupType={order.cupCode} />
        <CupShelf onSelectCup={order.chooseCup} />

        {isLatteOpen && !isOver && (
          <LatteDesign
            isOpen={true}
            lockedDesign={customer.traceDesign}
            onDone={handleLatteDone}
            onCancel={() => setIsLatteOpen(false)}
            onPause={handlePause}
          />
        )}

        {/* The only pause menu. It sits above the latte design screen too. */}
        <GamePaused
          isOpen={isPaused}
          onContinue={() => setIsPaused(false)}
          onRestart={handleRestart}
          onLeave={handleLeave}
        />

        {isOver && (
          <ResultsScreen
            result={finishResult}
            errorMessage={finishError}
            isBusy={isFinishing}
            onRetry={finishGame}
            onHome={clearGame}
          />
        )}
      </main>
    </div>
  );
}

// The page itself. Changing the "key" throws away GamePlay and builds a brand-new
// one, which resets every piece of state, timer and customer in one step.
function GameScreen() {
  const [runNumber, setRunNumber] = useState(0);

  return (
    <GamePlay
      key={runNumber}
      onRestartRun={() => setRunNumber((previous) => previous + 1)}
    />
  );
}

export default GameScreen;