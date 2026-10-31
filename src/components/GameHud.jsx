const gameHudStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&display=swap');

.game-hud-timer {
  position: absolute;
  top: calc(14 / 1024 * 100%);
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  pointer-events: none;
  user-select: none;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(30px, 2.9vw, 42px);
  line-height: 1;
  color: #FFFFFF;
  -webkit-text-stroke: 2px #361E10;
  paint-order: stroke fill;
  text-shadow:
    -2px -2px 0 #361E10,
     2px -2px 0 #361E10,
    -2px  2px 0 #361E10,
     2px  2px 0 #361E10,
     0    3px 4px rgba(0, 0, 0, 0.4);
  letter-spacing: 1px;
  white-space: nowrap;
}

.game-hud-timer.is-low {
  color: #FFAAA6;
}

.game-hud-score {
  position: absolute;
  left: calc(30 / 1440 * 100%);
  top: calc(14 / 1024 * 100%);
  z-index: 15;
  pointer-events: none;
  user-select: none;
  display: flex;
  align-items: center;
  gap: clamp(6px, 0.6vw, 10px);
  white-space: nowrap;
}

.game-hud-star-icon {
  width: clamp(28px, 2.4vw, 36px);
  height: clamp(28px, 2.4vw, 36px);
  display: block;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35));
}

.game-hud-score-value {
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(26px, 2.4vw, 36px);
  line-height: 1;
  color: #FFFFFF;
  -webkit-text-stroke: 2px #361E10;
  paint-order: stroke fill;
  text-shadow:
    -2px -2px 0 #361E10,
     2px -2px 0 #361E10,
    -2px  2px 0 #361E10,
     2px  2px 0 #361E10,
     0    3px 4px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
}
`;

// 125 seconds becomes "2:05".
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ':' + String(seconds).padStart(2, '0');
}

function GameHud({ secondsLeft, score }) {
  return (
    <>
      <style>{gameHudStyles}</style>

      <div
        className={secondsLeft <= 30 ? 'game-hud-timer is-low' : 'game-hud-timer'}
        aria-label={'Time remaining: ' + formatTime(secondsLeft)}
      >
        {formatTime(secondsLeft)}
      </div>

      <div className="game-hud-score" aria-label={'Score: ' + score}>
        <svg
          className="game-hud-star-icon"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hudScoreStarGrad" x1="16" y1="2" x2="16" y2="29" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="50%" stopColor="#FFD23F" />
              <stop offset="100%" stopColor="#F39C12" />
            </linearGradient>
          </defs>
          <path
            d="M16 2.5L19.9 10.8L29 12L22.3 18.3L24 27.4L16 22.9L8 27.4L9.7 18.3L3 12L12.1 10.8Z"
            fill="url(#hudScoreStarGrad)"
            stroke="#361E10"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <span className="game-hud-score-value">{score}</span>
      </div>
    </>
  );
}

export default GameHud;
