import { useState } from 'react';
import menuButtonSvg from '../assets/menu.svg';
import menuWrapperSvg from '../assets/collapsed menu.svg';
import settingsButtonSvg from '../assets/settings button.svg';
import leaderboardButtonSvg from '../assets/leaderboard button.svg';

const settingsStyles = `
/* ==========================================================================
   Settings Ribbon Component Styles
   Self-contained in Settings.jsx
   ========================================================================== */

.ribbon-menu-wrapper {
  box-sizing: border-box;
  position: absolute;
  width: calc(96 / 1440 * 100%);
  max-width: 96px;
  min-width: 52px;
  right: calc(21 / 1440 * 100%);
  top: 0px;
  z-index: 30;
  transform-origin: top center;
  filter: none;
  box-shadow: none;
  user-select: none;
}

/* Collapsed State: Hamburger Menu Ribbon (menu.svg: 100 x 117) */
.ribbon-menu-wrapper.is-collapsed {
  aspect-ratio: 100 / 117;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  transition: transform 0.15s ease, filter 0.15s ease;
}

/* Expanded State: Settings + Leaderboard Ribbon (collapsed menu.svg: 126 x 360) */
.ribbon-menu-wrapper.is-expanded {
  aspect-ratio: 126 / 360;
  animation: ribbonUnroll 0.22s cubic-bezier(0.34, 1.25, 0.64, 1);
}

@keyframes ribbonUnroll {
  from {
    transform: scaleY(0.4);
    opacity: 0.9;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

/* Full Vector Ribbon Image */
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

/* Hover & Active on Collapsed Button */
.ribbon-menu-wrapper.is-collapsed:hover {
  transform: translateY(2px);
  filter: brightness(1.03);
}

.ribbon-menu-wrapper.is-collapsed:active {
  transform: translateY(5px);
  filter: brightness(0.96);
}

/* ==========================================================================
   Expanded State Content (Close Button, Settings Tile, Leaderboard Tile)
   ========================================================================== */

.expanded-menu-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  padding-top: 18%;
  box-sizing: border-box;
}

/* Close "X" Button */
.menu-close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  margin: 0 0 12% 0;
  width: 36%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  transition: transform 0.15s ease;
}

.menu-close-btn svg {
  width: 100%;
  height: 100%;
  display: block;
}

.menu-close-btn:hover {
  transform: scale(1.12);
}

.menu-close-btn:active {
  transform: scale(0.9);
}

/* Action Buttons (Settings & Leaderboard SVG assets) */
.menu-action-tile {
  box-sizing: border-box;
  width: 77%;
  aspect-ratio: 97 / 92;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0 0 10% 0;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.menu-action-tile img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

/* Hover State on Tiles */
.menu-action-tile:hover {
  transform: translateY(-2px);
  filter: brightness(1.03);
}

/* Pressed State on Tiles */
.menu-action-tile:active {
  transform: translateY(2px) scale(0.96);
  filter: brightness(0.96);
}
`;

function Settings() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <style>{settingsStyles}</style>

      {/* Collapsed State: Menu Button Asset */}
      {!isMenuOpen ? (
        <button
          type="button"
          className="ribbon-menu-wrapper is-collapsed"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open Menu"
          title="Menu"
        >
          <img
            className="ribbon-svg"
            src={menuButtonSvg}
            alt=""
            draggable="false"
          />
        </button>
      ) : (
        /* Expanded State: Menu Wrapper + X Button + Settings & Leaderboard Assets */
        <div className="ribbon-menu-wrapper is-expanded" aria-label="Expanded Menu">
          <img
            className="ribbon-svg"
            src={menuWrapperSvg}
            alt=""
            draggable="false"
          />

          <div className="expanded-menu-content">
            {/* Close Button ("X") */}
            <button
              type="button"
              className="menu-close-btn"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close Menu"
              title="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="#5E3A24"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Settings Button Asset */}
            <button
              type="button"
              className="menu-action-tile"
              aria-label="Settings"
              title="Settings"
            >
              <img src={settingsButtonSvg} alt="" draggable="false" />
            </button>

            {/* Leaderboard Button Asset */}
            <button
              type="button"
              className="menu-action-tile"
              aria-label="Leaderboard"
              title="Leaderboard"
            >
              <img src={leaderboardButtonSvg} alt="" draggable="false" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;