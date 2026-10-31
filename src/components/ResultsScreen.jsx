const resultsStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&family=Lilita+One&family=Nunito:wght@600;700;800;900&display=swap');

.results-backdrop {
  position: absolute;
  inset: 0;
  z-index: 90;
  background: rgba(20, 10, 5, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  user-select: none;
}

.results-frame {
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  background: #C48B56;
  border: 4px solid #361E10;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}

.results-board {
  box-sizing: border-box;
  width: 100%;
  background: #FFF4DF;
  border: 3px solid #361E10;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 28px 26px;
}

.results-title {
  margin: 0;
  font-family: 'Lilita One', 'Fredoka', cursive, sans-serif;
  font-size: 34px;
  color: #361E10;
  text-align: center;
  letter-spacing: 0.03em;
  line-height: 1;
}

.results-new-record {
  margin: 10px 0 0 0;
  padding: 4px 14px;
  background: #F2B84B;
  border: 2.5px solid #361E10;
  border-radius: 20px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: 14px;
  color: #1E120A;
}

.results-score-label {
  margin: 20px 0 0 0;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 14px;
  color: #7A5A40;
}

.results-score {
  margin: 0 0 14px 0;
  font-family: 'Fredoka', 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 60px;
  line-height: 1.1;
  color: #DDA164;
  -webkit-text-stroke: 2px #6A4223;
  paint-order: stroke fill;
}

.results-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 6px;
  border-bottom: 2px dashed #D8BF99;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 16px;
  color: #361E10;
}

.results-row:last-of-type {
  border-bottom: none;
}

.results-message {
  margin: 22px 0 6px 0;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #361E10;
  text-align: center;
}

.results-error {
  color: #B93829;
}

.results-actions {
  display: flex;
  gap: 16px;
  width: 100%;
  margin-top: 20px;
}

.results-secondary-btn,
.results-primary-btn {
  flex: 1;
  height: 44px;
  border: 2px solid #361E10;
  border-radius: 10px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-size: 16px;
  cursor: pointer;
  outline: none;
}

.results-secondary-btn {
  background: #FFF4DF;
  color: #1E120A;
  font-weight: 700;
}

.results-primary-btn {
  background: #B97C49;
  color: #FFF4DF;
  font-weight: 800;
}

.results-secondary-btn:hover:not(:disabled),
.results-primary-btn:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.results-secondary-btn:disabled,
.results-primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

function ResultsScreen({ result, errorMessage, isBusy, onRetry, onPlayAgain, onHome }) {
  // Three situations: waiting for the server, an error, or the final result.
  const isWaiting = !result && !errorMessage;

  return (
    <>
      <style>{resultsStyles}</style>
      <div className="results-backdrop" role="dialog" aria-modal="true" aria-label="Game results">
        <div className="results-frame">
          <div className="results-board">
            <h2 className="results-title">TIME&apos;S UP!</h2>

            {isWaiting && (
              <p className="results-message">Counting your score...</p>
            )}

            {!result && errorMessage && (
              <>
                <p className="results-message results-error" role="alert">
                  {errorMessage}
                </p>
                <div className="results-actions">
                  <button
                    type="button"
                    className="results-secondary-btn"
                    disabled={isBusy}
                    onClick={onHome}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    className="results-primary-btn"
                    disabled={isBusy}
                    onClick={onRetry}
                  >
                    {isBusy ? 'Trying...' : 'Try again'}
                  </button>
                </div>
              </>
            )}

            {result && (
              <>
                {result.isNewHighScore && (
                  <p className="results-new-record">NEW HIGH SCORE!</p>
                )}

                <p className="results-score-label">YOUR SCORE</p>
                <p className="results-score">{result.totalScore}</p>

                <div className="results-row">
                  <span>Happy customers</span>
                  <span>{result.ordersCompleted}</span>
                </div>
                <div className="results-row">
                  <span>Unhappy customers</span>
                  <span>{result.ordersFailed}</span>
                </div>
                <div className="results-row">
                  <span>High score</span>
                  <span>{result.highScore}</span>
                </div>

                <div className="results-actions">
                  <button
                    type="button"
                    className="results-secondary-btn"
                    disabled={isBusy}
                    onClick={onHome}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    className="results-primary-btn"
                    disabled={isBusy}
                    onClick={onPlayAgain}
                  >
                    {isBusy ? 'Starting...' : 'Play again'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultsScreen;