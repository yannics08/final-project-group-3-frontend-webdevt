import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import volumeSvg from '../assets/volume.svg';
import noVolumeSvg from '../assets/no volume.svg';

const VOLUME_STORAGE_KEY = 'madcoffee_volume';
const MUTED_STORAGE_KEY = 'madcoffee_muted';

const gamePausedStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Lilita+One&family=Poppins:wght@600;700;800&display=swap');

.pause-modal-backdrop {
  position: absolute;
  inset: 0;
  z-index: 60;
  background: rgba(20, 10, 5, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
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

.pause-modal-frame {
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  background: #B87B47;
  border: 4px solid #361E10;
  border-radius: 12px;
  box-shadow:
    inset 0px 4px 0px rgba(255, 255, 255, 0.25),
    0 18px 40px rgba(0, 0, 0, 0.45);
  padding: 14px;
  display: flex;
  animation: pauseBoardPopIn 0.2s cubic-bezier(0.34, 1.35, 0.64, 1);
  user-select: none;
}

.pause-modal-board {
  box-sizing: border-box;
  width: 100%;
  background: #FFF4DF;
  border: 3px solid #361E10;
  border-radius: 4px;
  box-shadow: inset -10px 0px 0px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: 30px 28px 32px;
}

.pause-modal-title {
  margin: 0;
  font-family: 'Lilita One', 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 32px;
  letter-spacing: 0.02em;
  color: #361E10;
  text-align: center;
  line-height: 1.1;
}

.pause-volume-wrapper {
  position: relative;
  width: 100%;
  max-width: 310px;
  aspect-ratio: 386 / 54;
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
}

.pause-volume-bg {
  width: 100%;
  height: 100%;
  display: block;
}

.pause-volume-range-overlay {
  position: absolute;
  left: calc(66 / 386 * 100%);
  top: 0;
  width: calc(320 / 386 * 100%);
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
  z-index: 5;
}

.pause-speaker-toggle-zone {
  position: absolute;
  left: 0;
  top: 0;
  width: calc(60 / 386 * 100%);
  height: 100%;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  z-index: 5;
  outline: none;
}

.pause-actions-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  width: 100%;
}

.pause-icon-tile {
  box-sizing: border-box;
  width: 68px;
  height: 64px;
  background: #FFF4DF;
  border: none;
  border-radius: 14px;
  box-shadow:
    0px 4px 4px rgba(185, 124, 73, 0.27),
    inset 0px 4px 4px rgba(185, 124, 73, 0.08);
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  transition: transform 0.14s ease, filter 0.14s ease, box-shadow 0.14s ease;
}

.pause-icon-tile svg {
  width: 100%;
  height: 100%;
  display: block;
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

.pause-continue-btn {
  box-sizing: border-box;
  width: 100%;
  max-width: 280px;
  height: 46px;
  background: #B87B47;
  border: 3px solid #361E10;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 18px;
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

.pause-modal-frame.is-confirm {
  max-width: 410px;
}

.pause-confirm-board {
  justify-content: center;
  gap: 24px;
  padding: 32px 26px;
}

.pause-confirm-text-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.pause-confirm-heading {
  margin: 0;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.01em;
  color: #361E10;
  line-height: 1.2;
}

.pause-confirm-subtitle {
  margin: 0;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: #7A4B2A;
  line-height: 1.25;
}

.pause-confirm-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 280px;
}

.pause-confirm-btn {
  box-sizing: border-box;
  flex: 1;
  height: 42px;
  border: 2.5px solid #361E10;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.03em;
  transition: transform 0.14s ease, filter 0.14s ease;
}

.pause-confirm-btn.is-yes {
  background: #B87B47;
  color: #FFF4DF;
}

.pause-confirm-btn.is-no {
  background: #FFF4DF;
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

function GamePaused({ isOpen, onContinue, onRestart, onLeave }) {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
    return saved !== null ? Number(saved) : 60;
  });
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem(MUTED_STORAGE_KEY) === 'true';
  });
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  if (!isOpen) return null;

  const displayedVolume = isMuted ? 0 : volume;
  const currentFillWidth = (displayedVolume / 100) * 306;

  const updateVolume = (nextVal) => {
    setVolume(nextVal);
    localStorage.setItem(VOLUME_STORAGE_KEY, String(nextVal));
    if (nextVal > 0 && isMuted) {
      setIsMuted(false);
      localStorage.setItem(MUTED_STORAGE_KEY, 'false');
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTED_STORAGE_KEY, String(next));
      return next;
    });
  };

  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const trackStart = (66 / 386) * rect.width;
    const trackWidth = (320 / 386) * rect.width;
    if (clickX >= trackStart) {
      const rawPct = (clickX - trackStart) / trackWidth;
      const nextVal = Math.max(0, Math.min(100, Math.round(rawPct * 100)));
      updateVolume(nextVal);
    }
  };

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

  const handleLeave = () => {
  if (onLeave) {
    onLeave();
  } else {
    navigate('/');
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
          key={showLeaveConfirm ? 'confirm-leave' : 'pause-menu'}
          className={showLeaveConfirm ? 'pause-modal-frame is-confirm' : 'pause-modal-frame'}
          onClick={(e) => e.stopPropagation()}
        >
          {!showLeaveConfirm ? (
            <div className="pause-modal-board">
              <h2 id="pause-modal-title" className="pause-modal-title">
                GAME PAUSED
              </h2>

              <div
                className="pause-volume-wrapper"
                onClick={handleTrackClick}
              >
                <svg viewBox="0 0 386 54" className="pause-volume-bg" xmlns="http://www.w3.org/2000/svg">
                  {displayedVolume > 0 ? (
                    <>
                      <image href={volumeSvg} x="0" y="0" width="386" height="54" />
                      <rect
                        x="73"
                        y="25"
                        width={currentFillWidth}
                        height="9"
                        rx="4.5"
                        fill="#B97C49"
                      />
                    </>
                  ) : (
                    <>
                      <image href={noVolumeSvg} x="13" y="12.5" width="34" height="34" />
                      <rect x="66" y="19" width="320" height="21" rx="10.5" fill="#361E10" />
                    </>
                  )}
                </svg>

                <button
                  type="button"
                  className="pause-speaker-toggle-zone"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  title={isMuted ? 'Unmute' : 'Mute'}
                />

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={displayedVolume}
                  onChange={(e) => {
                    const nextVolume = Number(e.target.value);
                    updateVolume(nextVolume);
                  }}
                  className="pause-volume-range-overlay"
                  aria-label="Volume"
                />
              </div>

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
                  onClick={handleLeave}
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
