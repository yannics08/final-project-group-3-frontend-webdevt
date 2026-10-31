import { useEffect } from "react";
import adminBgSvg from "../assets/admin (bg).svg";
import closeButtonSvg from "../assets/close button.svg";
import { useLeaderboard } from "../hooks/useLeaderboard";

const leaderboardStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&family=Lilita+One&family=Nunito:wght@600;700;800;900&display=swap');

.leaderboard-screen-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  background-image: url("${adminBgSvg}");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.leaderboard-board-frame {
  box-sizing: border-box;
  position: relative;
  width: 69.5%;
  height: 82%;
  background: #C48B56;
  border: 4px solid #361E10;
  border-radius: 14px;
  padding: 1.4%;
  display: flex;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.32);
}

.leaderboard-close-btn {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 54px;
  height: 54px;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  z-index: 10;
  display: block;
  outline: none;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.leaderboard-close-btn img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.leaderboard-close-btn:hover {
  transform: scale(1.08);
  filter: brightness(1.05);
}

.leaderboard-close-btn:active {
  transform: scale(0.94);
}

.leaderboard-board-inner {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #FFF4DF;
  border: 3.5px solid #361E10;
  border-radius: 4px;
  box-shadow: inset -12px 0 0 rgba(54, 30, 16, 0.18);
  display: flex;
  flex-direction: column;
  padding: 3.8% 9% 3.2%;
  overflow: hidden;
}

.leaderboard-title {
  margin: 0 0 3.2% 0;
  font-family: 'Lilita One', 'Fredoka', cursive, sans-serif;
  font-weight: 700;
  font-size: clamp(24px, 3.3vw, 44px);
  color: #361E10;
  text-align: center;
  letter-spacing: 0.02em;
  line-height: 1;
}

.leaderboard-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.leaderboard-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 2px dashed #D8BF99;
  min-height: 64px;
  box-sizing: border-box;
}

.leaderboard-row:last-child {
  border-bottom: none;
}

.leaderboard-user-side {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
}

.leaderboard-rank-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: 18px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.leaderboard-rank-badge.rank-1 {
  background: #F2B84B;
  border: 2.5px solid #361E10;
  color: #1E120A;
}

.leaderboard-rank-badge.rank-2 {
  background: #D0D5DD;
  border: 2.5px solid #361E10;
  color: #1E120A;
}

.leaderboard-rank-badge.rank-3 {
  background: #D9823B;
  border: 2.5px solid #361E10;
  color: #1E120A;
}

.leaderboard-rank-badge.rank-other {
  background: transparent;
  border: none;
  color: #7A4E30;
}

.leaderboard-username {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: clamp(15px, 1.4vw, 19px);
  color: #1E120A;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.leaderboard-points {
  font-family: 'Fredoka', 'Nunito', sans-serif;
  font-weight: 800;
  font-size: clamp(16px, 1.55vw, 22px);
  color: #DDA164;
  -webkit-text-stroke: 1.4px #6A4223;
  paint-order: stroke fill;
  letter-spacing: 0.03em;
}

.leaderboard-empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #7A5A40;
}

.leaderboard-error-state {
  flex-direction: column;
  gap: 14px;
  text-align: center;
  color: #B93829;
}

.leaderboard-retry-btn {
  height: 38px;
  padding: 0 22px;
  background: #B97C49;
  border: 2px solid #361E10;
  border-radius: 10px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 15px;
  color: #FFF4DF;
  cursor: pointer;
  outline: none;
}
  
`;

function Leaderboard({ onClose }) {
  const { players, isLoading, errorMessage, reload } = useLeaderboard(100);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <style>{leaderboardStyles}</style>
      <div
        className="leaderboard-screen-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Leaderboard"
      >
        <div className="leaderboard-board-frame">
          <button
            type="button"
            className="leaderboard-close-btn"
            onClick={onClose}
            aria-label="Close Leaderboard"
            title="Close"
          >
            <img src={closeButtonSvg} alt="Close" draggable="false" />
          </button>

          <div className="leaderboard-board-inner">
            <h2 className="leaderboard-title">LEADERBOARD</h2>

            <div className="leaderboard-list">
              {isLoading && (
                <div className="leaderboard-empty-state">Loading...</div>
              )}

              {!isLoading && errorMessage && (
                <div
                  className="leaderboard-empty-state leaderboard-error-state"
                  role="alert"
                >
                  <span>{errorMessage}</span>
                  <button
                    type="button"
                    className="leaderboard-retry-btn"
                    onClick={reload}
                  >
                    Try again
                  </button>
                </div>
              )}

              {!isLoading && !errorMessage && players.length === 0 && (
                <div className="leaderboard-empty-state">No scores yet</div>
              )}

              {!isLoading &&
                !errorMessage &&
                players.map((player, idx) => {
                  const rank = idx + 1;
                  const rankClass =
                    rank === 1
                      ? "rank-1"
                      : rank === 2
                        ? "rank-2"
                        : rank === 3
                          ? "rank-3"
                          : "rank-other";

                  return (
                    <div key={player.displayName} className="leaderboard-row">
                      <div className="leaderboard-user-side">
                        <span className={`leaderboard-rank-badge ${rankClass}`}>
                          {rank}
                        </span>
                        <span className="leaderboard-username">
                          {player.displayName}
                        </span>
                      </div>

                      <span className="leaderboard-points">
                        {player.highScore}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
