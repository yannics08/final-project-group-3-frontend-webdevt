import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const gamePausedStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Poppins:wght@600;700;800&display=swap');

/* ==========================================================================
   Game Paused Modal Overlay & Board (1440 x 1024 Screen Proportions)
   Outer Frame: 696 x 594 centered on screen
   ========================================================================== */

.pause-modal-backdrop {
  position: absolute;
  inset: 0;
  z-index: 60;
  background: rgba(20, 10, 5, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pauseBackdropFadeIn 0.18s ease-out;
}

@keyframes pauseBackdropFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pauseBoardPopIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Outer Wooden Frame (#B87B47 with #361E10 border & top lighting highlight) */
.pause-modal-frame {
  box-sizing: border-box;
  width: calc(696 / 1440 * 100%);
  aspect-ratio: 696 / 594;
  background: #B87B47;
  border: 4px solid #361E10;
  border-radius: 6px;
  box-shadow: inset 0px 5px 0px rgba(255, 255, 255, 0.25);
  padding: 2.35%;
  display: flex;
  animation: pauseBoardPopIn 0.2s cubic-bezier(0.34, 1.35, 0.64, 1);
  user-select: none;
}

/* Inner Cream Panel (#FFF4DF with #361E10 border & right inner shadow strip) */
.pause-modal-board {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #FFF4DF;
  border: 4px solid #361E10;
  border-radius: 2px;
  box-shadow: inset -14px 0px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 7.5% 7% 8%;
}

/* Title: GAME PAUSED */
.pause-modal-title {
  margin: 0;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(20px, 3.1vw, 44px);
  letter-spacing: 0.02em;
  color: #361E10;
  text-align: center;
  line-height: 1.1;
}

/* Volume Control Row */
.pause-volume-row {
  width: 72%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5%;
}

.pause-speaker-btn {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  width: 14%;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  flex-shrink: 0;
  transition: transform 0.12s ease;
}

.pause-speaker-btn:hover {
  transform: scale(1.08);
}

.pause-speaker-btn:active {
  transform: scale(0.94);
}

.pause-speaker-btn svg {
  width: 100%;
  height: 100%;
  display: block;
}

.pause-volume-track {
  position: relative;
  flex: 1;
  height: clamp(14px, 1.7vw, 22px);
  background: #361E10;
  border: 4px solid #361E10;
  border-radius: 999px;
  cursor: pointer;
  overflow: hidden;
  box-sizing: border-box;
}

.pause-volume-fill {
  height: 100%;
  background: #B87B47;
  border-radius: 999px;
  transition: width 0.12s ease;
}

.pause-volume-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
}

/* Middle Action Tiles Row (Home & Restart) */
.pause-actions-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10%;
  width: 100%;
}

.pause-icon-tile {
  box-sizing: border-box;
  width: 21%;
  aspect-ratio: 89 / 84;
  background: #FFF4DF;
  border: none;
  border-radius: 15px;
  box-shadow:
    0px 4px 4px rgba(185, 124, 73, 0.27),
    inset 0px 4px 4px rgba(185, 124, 73, 0.08);
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.4%;
  transition: transform 0.14s ease, filter 0.14s ease, box-shadow 0.14s ease;
}

.pause-icon-tile svg {
  width: 72%;
  height: 72%;
  display: block;
}

.pause-icon-tile svg.pause-retry-icon {
  width: 78%;
  height: 78%;
}

.pause-icon-tile:hover {
  transform: translateY(-2px);
  filter: brightness(1.02);
  box-shadow:
    0px 6px 8px rgba(185, 124, 73, 0.34),
    inset 0px 4px 4px rgba(185, 124, 73, 0.08);
}

.pause-icon-tile:active {
  transform: translateY(2px) scale(0.96);
  filter: brightness(0.96);
}

/* Bottom CONTINUE Button */
.pause-continue-btn {
  box-sizing: border-box;
  width: 76%;
  aspect-ratio: 420 / 76;
  background: #B87B47;
  border: 3.5px solid #361E10;
  border-radius: 12px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(16px, 2.25vw, 31px);
  letter-spacing: 0.03em;
  color: #FFF4DF;
  transition: transform 0.14s ease, filter 0.14s ease;
}

.pause-continue-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.pause-continue-btn:active {
  transform: translateY(2px) scale(0.98);
  filter: brightness(0.95);
}

/* ==========================================================================
   Leave Confirmation View (Medium Dialog Size)
   ========================================================================== */

.pause-modal-frame.is-confirm {
  width: calc(580 / 1440 * 100%);
  aspect-ratio: 580 / 420;
  padding: 2.1%;
}

.pause-confirm-board {
  justify-content: center;
  gap: 13%;
  padding: 8.5% 7.5%;
}

.pause-confirm-text-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.pause-confirm-heading {
  margin: 0;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(16px, 2.3vw, 32px);
  letter-spacing: 0.01em;
  color: #361E10;
  line-height: 1.2;
}

.pause-confirm-subtitle {
  margin: 0;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 600;
  font-size: clamp(13px, 1.6vw, 22px);
  color: #7A4B2A;
  line-height: 1.25;
}

.pause-confirm-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8%;
  width: 80%;
}

.pause-confirm-btn {
  box-sizing: border-box;
  flex: 1;
  aspect-ratio: 170 / 60;
  border: 3.5px solid #361E10;
  border-radius: 11px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(14px, 1.85vw, 25px);
  letter-spacing: 0.03em;
  transition: transform 0.14s ease, filter 0.14s ease;
}

.pause-confirm-btn.is-yes {
  background: #B87B47;
  color: #FFF4DF;
}

.pause-confirm-btn.is-no {
  background: #EAD4B4;
  color: #361E10;
}

.pause-confirm-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.pause-confirm-btn:active {
  transform: translateY(2px) scale(0.97);
  filter: brightness(0.95);
}
`;

function GamePaused({ isOpen, onContinue, onRestart }) {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(62);
  const [isMuted, setIsMuted] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  if (!isOpen) return null;

  const displayedVolume = isMuted ? 0 : volume;

  const handleCloseModal = () => {
    setShowLeaveConfirm(false);
    if (onContinue) {
      onContinue();
    }
  };

  const handleRestart = () => {
    setShowLeaveConfirm(false);
    if (onRestart) {
      onRestart();
    }
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <>
      <style>{gamePausedStyles}</style>

      <div
        className="pause-modal-backdrop"
        onClick={handleCloseModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-modal-title"
      >
        <div
          key={showLeaveConfirm ? "confirm-leave" : "pause-menu"}
          className={showLeaveConfirm ? "pause-modal-frame is-confirm" : "pause-modal-frame"}
          onClick={(e) => e.stopPropagation()}
        >
          {!showLeaveConfirm ? (
            <div className="pause-modal-board">
              <h2 id="pause-modal-title" className="pause-modal-title">
                GAME PAUSED
              </h2>

              {/* Volume Control Row */}
              <div className="pause-volume-row">
                <button
                  type="button"
                  className="pause-speaker-btn"
                  onClick={() => setIsMuted((prev) => !prev)}
                  aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  <svg viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Speaker Cone */}
                    <path
                      d="M3 13.5C3 12.1 4.1 11 5.5 11H11.5L19.8 4.4C21.4 3.1 23.8 4.3 23.8 6.4V29.6C23.8 31.7 21.4 32.9 19.8 31.6L11.5 25H5.5C4.1 25 3 23.9 3 22.5V13.5Z"
                      fill="#361E10"
                    />
                    {/* Sound Waves */}
                    {!isMuted && (
                      <>
                        <path
                          d="M28.5 12.5C30.8 15.5 30.8 20.5 28.5 23.5"
                          stroke="#361E10"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M33 8.5C36.8 13.8 36.8 22.2 33 27.5"
                          stroke="#361E10"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                      </>
                    )}
                  </svg>
                </button>

                <div className="pause-volume-track">
                  <div
                    className="pause-volume-fill"
                    style={{ width: `${displayedVolume}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={displayedVolume}
                    onChange={(e) => {
                      const nextVolume = Number(e.target.value);
                      setVolume(nextVolume);
                      if (nextVolume > 0 && isMuted) {
                        setIsMuted(false);
                      }
                    }}
                    className="pause-volume-input"
                    aria-label="Volume"
                  />
                </div>
              </div>

              {/* Home & Restart Buttons */}
              <div className="pause-actions-row">
                <button
                  type="button"
                  className="pause-icon-tile"
                  onClick={() => setShowLeaveConfirm(true)}
                  aria-label="Return to Home Screen"
                  title="Home"
                >
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.2 7.6C23.2 6.7 24.8 6.7 25.8 7.6L41.8 21.8C43.4 23.2 42.4 25.8 40.3 25.8H37V38.5C37 40.2 35.7 41.5 34 41.5H27.5V29.5H20.5V41.5H14C12.3 41.5 11 40.2 11 38.5V25.8H7.7C5.6 25.8 4.6 23.2 6.2 21.8L22.2 7.6Z"
                      fill="#B87B47"
                      stroke="#361E10"
                      strokeWidth="2.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="pause-icon-tile"
                  onClick={handleRestart}
                  aria-label="Restart Game"
                  title="Restart"
                >
                  <svg
                    className="pause-retry-icon"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26 7C16.1 7 8 15.1 8 25H3L11.5 34.5L20 25H14.4C14.4 18.6 19.6 13.4 26 13.4C32.4 13.4 37.6 18.6 37.6 25C37.6 31.4 32.4 36.6 26 36.6V43C35.9 43 44 34.9 44 25C44 15.1 35.9 7 26 7Z"
                      fill="#B87B47"
                      stroke="#361E10"
                      strokeWidth="2.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Continue Button */}
              <button
                type="button"
                className="pause-continue-btn"
                onClick={handleCloseModal}
              >
                CONTINUE
              </button>
            </div>
          ) : (
            <div className="pause-modal-board pause-confirm-board">
              <div className="pause-confirm-text-group">
                <h2 id="pause-modal-title" className="pause-confirm-heading">
                  Are you sure you want to leave?
                </h2>
                <p className="pause-confirm-subtitle">
                  You&apos;ll lose your progress
                </p>
              </div>

              <div className="pause-confirm-buttons">
                <button
                  type="button"
                  className="pause-confirm-btn is-yes"
                  onClick={() => navigate('/')}
                >
                  YES
                </button>
                <button
                  type="button"
                  className="pause-confirm-btn is-no"
                  onClick={() => setShowLeaveConfirm(false)}
                >
                  NO
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GamePaused;
