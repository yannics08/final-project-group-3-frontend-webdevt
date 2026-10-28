import { useState, useEffect } from 'react';
import settingsSvg from '../assets/settings.svg';
import closeButtonSvg from '../assets/close button.svg';

const settingsStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&family=Lilita+One&family=Nunito:wght@600;700;800&display=swap');

.ribbon-settings-btn {
  box-sizing: border-box;
  position: absolute;
  width: calc(96 / 1440 * 100%);
  max-width: 96px;
  min-width: 52px;
  right: calc(21 / 1440 * 100%);
  top: 0px;
  z-index: 30;
  aspect-ratio: 100 / 117;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  transform-origin: top center;
  transition: transform 0.15s ease, filter 0.15s ease;
  user-select: none;
}

.ribbon-settings-btn:hover {
  transform: translateY(2px);
  filter: brightness(1.04);
}

.ribbon-settings-btn:active {
  transform: translateY(5px);
  filter: brightness(0.95);
}

.ribbon-settings-btn:focus-visible {
  outline: 2px solid #5A3824;
  outline-offset: 3px;
  border-radius: 4px;
}

.ribbon-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.settings-modal-backdrop {
  position: absolute;
  inset: 0;
  z-index: 60;
  background: rgba(20, 10, 5, 0.52);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: settingsModalFadeIn 0.18s ease-out;
  padding: 16px;
  box-sizing: border-box;
}

@keyframes settingsModalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes settingsModalPopIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.settings-modal-frame {
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  background: #C48B56;
  border: 4px solid #361E10;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  animation: settingsModalPopIn 0.2s cubic-bezier(0.34, 1.35, 0.64, 1);
  user-select: none;
  position: relative;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}

.settings-close-circle-btn {
  position: absolute;
  top: -16px;
  right: -16px;
  width: 48px;
  height: 48px;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  z-index: 10;
  display: block;
  transition: transform 0.15s ease, filter 0.15s ease;
  outline: none;
}

.settings-close-circle-btn img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.settings-close-circle-btn:hover {
  transform: scale(1.1);
  filter: brightness(1.06);
}

.settings-close-circle-btn:active {
  transform: scale(0.94);
}

.settings-modal-board {
  box-sizing: border-box;
  width: 100%;
  background: #FFF4DF;
  border: 3px solid #361E10;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 34px 28px 40px;
  position: relative;
}

.settings-modal-title {
  margin: 0 0 28px 0;
  font-family: 'Lilita One', 'Fredoka', cursive, sans-serif;
  font-weight: 700;
  font-size: 34px;
  color: #361E10;
  text-align: center;
  letter-spacing: 0.03em;
  line-height: 1;
}

.settings-volume-wrapper {
  position: relative;
  width: 100%;
  max-width: 340px;
  aspect-ratio: 386 / 54;
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
}

.settings-volume-bg {
  width: 100%;
  height: 100%;
  display: block;
}

.settings-volume-range-overlay {
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

.settings-speaker-toggle-zone {
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
`;

function Settings({ onClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(60);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsOpen(true);
    }
  };

  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const trackStart = (66 / 386) * rect.width;
    const trackWidth = (320 / 386) * rect.width;
    if (clickX >= trackStart) {
      const rawPct = (clickX - trackStart) / trackWidth;
      const nextVal = Math.max(0, Math.min(100, Math.round(rawPct * 100)));
      setVolume(nextVal);
      if (nextVal > 0 && isMuted) {
        setIsMuted(false);
      }
    }
  };

  const displayedVolume = isMuted ? 0 : volume;
  const currentFillWidth = (displayedVolume / 100) * 306;

  return (
    <>
      <style>{settingsStyles}</style>

      <button
        type="button"
        className="ribbon-settings-btn"
        onClick={handleButtonClick}
        aria-label="Settings"
        title="Settings"
      >
        <img
          className="ribbon-svg"
          src={settingsSvg}
          alt=""
          draggable="false"
        />
      </button>

      {isOpen && (
        <div
          className="settings-modal-backdrop"
          onClick={() => setIsOpen(false)}
          aria-label="Settings Modal"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="settings-modal-frame"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="settings-close-circle-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Settings"
              title="Close"
            >
              <img src={closeButtonSvg} alt="Close" draggable="false" />
            </button>

            <div className="settings-modal-board">
              <h2 className="settings-modal-title">SETTINGS</h2>

              <div
                className="settings-volume-wrapper"
                onClick={handleTrackClick}
              >
                <svg viewBox="0 0 386 54" className="settings-volume-bg" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M27.7352 6.99555L13.7555 17.6972H7.1781C5.69979 17.6972 4.5 18.897 4.5 20.3753V33.6051C4.5 35.0834 5.69979 36.2832 7.1781 36.2832H13.7555L27.7352 46.9849C28.5707 47.6276 29.7812 47.0278 29.7812 45.9779V8.02393C29.7812 6.96341 28.5707 6.37422 27.7352 7.01697V6.99555Z"
                    fill="#361E10"
                  />
                  {displayedVolume > 0 ? (
                    <>
                      <path
                        d="M40.1507 26.8558C40.1507 30.6909 37.7083 33.9474 34.291 35.1579V18.5537C37.7083 19.7642 40.1507 23.0315 40.1507 26.8665V26.8558Z"
                        fill="#361E10"
                      />
                      {displayedVolume > 35 && (
                        <path
                          d="M35.4158 40.0108C34.7302 40.3108 34.2803 40.9964 34.2803 41.7355C34.2803 42.3783 34.6016 42.9675 35.1373 43.3103C35.4479 43.5138 35.8014 43.6209 36.1657 43.6209C36.4228 43.6209 36.6799 43.5674 36.9262 43.4602C43.5144 40.5465 47.7779 34.0226 47.7779 26.8346C47.7779 19.6466 43.5144 13.1228 36.9262 10.209C36.3478 9.95188 35.6729 10.0054 35.148 10.3482C34.6124 10.7017 34.291 11.2909 34.291 11.9337C34.291 12.6728 34.7302 13.3477 35.4265 13.6584C40.6434 15.9722 44.0178 21.1463 44.0178 26.8346C44.0178 32.5229 40.6434 37.697 35.4265 40.0108H35.4158Z"
                          fill="#361E10"
                        />
                      )}
                    </>
                  ) : (
                    <path
                      d="M35 21L45 31M45 21L35 31"
                      stroke="#361E10"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                  )}
                  <rect x="66" y="19" width="320" height="21" rx="10.5" fill="#361E10" />
                  {displayedVolume > 0 && (
                    <rect
                      x="73"
                      y="25"
                      width={currentFillWidth}
                      height="9"
                      rx="4.5"
                      fill="#B97C49"
                    />
                  )}
                </svg>

                <button
                  type="button"
                  className="settings-speaker-toggle-zone"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted((prev) => !prev);
                  }}
                  aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                  title={isMuted ? 'Unmute' : 'Mute'}
                />

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={displayedVolume}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setVolume(val);
                    if (val > 0 && isMuted) {
                      setIsMuted(false);
                    }
                  }}
                  className="settings-volume-range-overlay"
                  aria-label="Volume Slider"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;
