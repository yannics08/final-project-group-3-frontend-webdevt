import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import {
  evaluateOrderLocally,
  submitOrder,
  buildOrderPayload,
  clearSavedLogin,
} from '../services/api';
import CoffeeMachine from '../components/CoffeeMachine';
import CupShelf from '../components/CupShelf';
import ActiveCup from '../components/ActiveCup';
import GamePaused from '../components/GamePaused';
import LatteDesign from '../components/LatteDesign';
import pauseSvg from '../assets/pause.svg';
import { useGame } from '../context/GameContext';
import './GameScreen.css';

function GameScreen() {
  const { sessionId, config, recipes, reloadRecipes, clearGame } = useGame();
  const order = useOrder(config);
  const [isPaused, setIsPaused] = useState(false);
  const [isLatteOpen, setIsLatteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastServe, setLastServe] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [serveMessage, setServeMessage] = useState('');

  // TEMPORARY stand-ins until customers exist (Section 7).
  const testRecipe = recipes[0];
  const testTraceDesign = 'swan';
  const testCustomer = {
    recipeId: testRecipe ? testRecipe.id : null,
    recipe: testRecipe,
    customerType: 'student',
    customerVariant: 'boy',
    traceRequired: true,
    traceDesign: testTraceDesign,
  };

  const handleIngredientClick = (buttonName) => {
    if (buttonName === 'latte-design') {
      // One attempt per drink. Ignore the button once the trace is done.
      if (order.traceScore !== null) return false;
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

  // TEMPORARY: a local estimate, so we can compare it with the server.
  const servedNow = order.getServedItems();
  const testResult = evaluateOrderLocally(testCustomer, {
    ...servedNow,
    traceShown: true,
    traceScore: order.traceScore ?? 0,
    patienceRemaining: 100,
  });

  async function handleServe() {
    // Never send two requests at once (rule 10 of the API).
    if (isSubmitting || !order.cupCode) return;

    setIsSubmitting(true);
    setServeMessage('');
    try {
      const payload = buildOrderPayload(
        testCustomer,
        servedNow,
        order.traceScore,
        100 // stand-in patience, the real timer comes in Section 9
      );
      const data = await submitOrder(sessionId, payload);

      setLastServe({ server: data.result, localCombined: testResult.combinedAccuracy });
      setSessionStats(data.session);
      order.resetOrder();
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        // Login expired or banned: forget everything. With no session,
        // the guard above sends the player to the home page.
        clearSavedLogin();
        clearGame();
      } else if (error.code === 'RECIPE_NOT_FOUND') {
        reloadRecipes().catch(() => {});
        setServeMessage('The recipe list was out of date and has been reloaded. Please serve again.');
      } else {
        setServeMessage(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="gameplay-container">
      <main className="gameplay-screen" aria-label="Mad Coffee Gameplay Screen">
        {testRecipe && (
          <div
            style={{
              position: 'absolute',
              left: 8,
              top: 8,
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
              Target: {testRecipe.cup}, {testRecipe.temperature}, {testRecipe.ingredients.join(', ')}
            </div>
            <div>
              Served: {servedNow.selectedCup}, {servedNow.selectedTemperature},{' '}
              {servedNow.selectedIngredients.join(', ')}
            </div>
            <div>
              Mistakes: {testResult.mistakeCount} | Accuracy: {testResult.ingredientAccuracy}%
            </div>
            <div>
              Trace ({testTraceDesign}): {order.traceScore === null ? 'not done' : order.traceScore + '%'} |
              Combined: {testResult.combinedAccuracy}%
            </div>

            <button
              type="button"
              onClick={handleServe}
              disabled={isSubmitting || !order.cupCode}
              style={{ marginTop: 6 }}
            >
              {isSubmitting ? 'Sending...' : 'Serve (test)'}
            </button>

            {serveMessage && <div style={{ color: '#B00020' }}>{serveMessage}</div>}

            {lastServe && (
              <div style={{ marginTop: 6 }}>
                <div>
                  Server: {lastServe.server.satisfied ? 'SATISFIED' : 'DISSATISFIED'} | points{' '}
                  {lastServe.server.pointsEarned}
                </div>
                <div>
                  Needed {lastServe.server.requiredAccuracy}% | got {lastServe.server.combinedAccuracy}%
                  {' '}(local estimate {lastServe.localCombined}%)
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
        )}

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
            lockedDesign={testTraceDesign}
            onDone={handleLatteDone}
            onCancel={() => setIsLatteOpen(false)}
          />
        )}
      </main>
    </div>
  );
}

export default GameScreen;