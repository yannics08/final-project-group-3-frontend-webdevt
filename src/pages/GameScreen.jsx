import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import { usePatience } from '../hooks/usePatience';
import {
  evaluateOrderLocally,
  submitOrder,
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
import pauseSvg from '../assets/pause.svg';
import { useGame } from '../context/GameContext';
import './GameScreen.css';

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

function GameScreen() {
  const { sessionId, config, recipes, reloadRecipes, clearGame } = useGame();
  const order = useOrder(config);
  const [isPaused, setIsPaused] = useState(false);
  const [isLatteOpen, setIsLatteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastServe, setLastServe] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [serveMessage, setServeMessage] = useState('');

  // One customer at a time.
  const [customer, setCustomer] = useState(() => pickNextCustomer(0, config, recipes));
  const [mood, setMood] = useState('default');
  const [orderNumber, setOrderNumber] = useState(1);
  const gameStartRef = useRef(Date.now());

  // The patience timer stops while paused or while a result is being handled.
  const { patience, secondsLeft, resetPatience } = usePatience(
    customer.customerType,
    !isPaused && !isSubmitting
  );

  // When patience reaches 0, the customer leaves.
  useEffect(() => {
    if (patience <= 0) {
      handleCustomerLeft();
    }
    // The effect should only run when patience changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patience]);

  const handleIngredientClick = (buttonName) => {
    // Nothing works while a result is being shown.
    if (isSubmitting) return false;

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

  // Brings in the next customer.
  function startNextCustomer(recipeList) {
    const secondsPlayed = (Date.now() - gameStartRef.current) / 1000;
    setCustomer(pickNextCustomer(secondsPlayed, config, recipeList));
    setMood('default');
    setOrderNumber((previous) => previous + 1);
    resetPatience();
  }

  // Sends one customer's order to the server. Used for serving AND for leaving.
  async function finishCustomer(servedItems, traceScore, patienceValue, isLeaving) {
    // Never send two requests at once (rule 10 of the API).
    if (isSubmitting) return;

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

  return (
    <div className="gameplay-container">
      <main className="gameplay-screen" aria-label="Mad Coffee Gameplay Screen">
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
          secondsLeft={secondsLeft}
        />

        <ServeButton
          onClick={handleServe}
          disabled={isSubmitting || !order.cupCode}
        />

        {/* TEMPORARY test panel, moved to the bottom-left corner. */}
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
          onClick={() => setIsPaused(true)}
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

        <GamePaused
          isOpen={isPaused}
          onContinue={() => setIsPaused(false)}
          onRestart={() => {
            order.resetOrder();
          }}
        />

        {isLatteOpen && (
          <LatteDesign
            isOpen={true}
            lockedDesign={customer.traceDesign}
            onDone={handleLatteDone}
            onCancel={() => setIsLatteOpen(false)}
          />
        )}
      </main>
    </div>
  );
}

export default GameScreen;