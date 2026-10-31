const gameHudStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap');

.game-hud {
  position: absolute;
  left: calc(20 / 1440 * 100%);
  top: calc(8 / 1024 * 100%);
  width: calc(270 / 1440 * 100%);
  z-index: 14;
  container-type: inline-size;
  display: flex;
  gap: 3cqw;
  pointer-events: none;
  user-select: none;
}

.game-hud-pill {
  box-sizing: border-box;
  flex: 1;
  padding: 1.5cqw 2cqw;
  background: #FFF4DF;
  border: 0.9cqw solid #361E10;
  border-radius: 3cqw;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 6cqw;
  line-height: 1;
  text-align: center;
  color: #361E10;
}

.game-hud-pill.is-low {
  color: #C0392B;
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

      <div className="game-hud" aria-label="Time and score">
        <div className={secondsLeft <= 30 ? 'game-hud-pill is-low' : 'game-hud-pill'}>
          Time {formatTime(secondsLeft)}
        </div>
        <div className="game-hud-pill">Score {score}</div>
      </div>
    </>
  );
}

export default GameHud;