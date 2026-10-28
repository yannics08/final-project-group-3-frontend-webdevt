import { useState, useEffect } from 'react';
import settingsSvg from '../assets/settings.svg';
import menuButtonSvg from '../assets/menu.svg';
import menuWrapperSvg from '../assets/collapsed menu.svg';
import settingsButtonSvg from '../assets/settings button.svg';
import leaderboardButtonSvg from '../assets/leaderboard button.svg';
import closeButtonSvg from '../assets/close button.svg';

const USERS_STORAGE_KEY = 'madcoffee_users';
const CURRENT_USER_STORAGE_KEY = 'madcoffee_current_user';
const VOLUME_STORAGE_KEY = 'madcoffee_volume';
const MUTED_STORAGE_KEY = 'madcoffee_muted';

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

.ribbon-menu-wrapper.is-expanded {
  width: calc(108 / 1440 * 100%);
  max-width: 108px;
  min-width: 60px;
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

.ribbon-menu-wrapper.is-collapsed:hover {
  transform: translateY(2px);
  filter: brightness(1.03);
}

.ribbon-menu-wrapper.is-collapsed:active {
  transform: translateY(5px);
  filter: brightness(0.96);
}

.expanded-menu-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  padding-top: 13%;
  box-sizing: border-box;
}

.menu-close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0 0 11% 0;
  width: 44%;
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

.menu-action-tile {
  box-sizing: border-box;
  width: 85%;
  aspect-ratio: 97 / 92;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0 0 9% 0;
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

.menu-action-tile:hover {
  transform: translateY(-2px);
  filter: brightness(1.03);
}

.menu-action-tile:active {
  transform: translateY(2px) scale(0.96);
  filter: brightness(0.96);
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
  padding: 34px 28px 34px;
  position: relative;
}

.settings-modal-title {
  margin: 0 0 24px 0;
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
  max-width: 310px;
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

.settings-user-section {
  width: 100%;
  max-width: 310px;
  margin-top: 22px;
  display: flex;
  flex-direction: column;
}

.settings-user-label {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 13.5px;
  color: #361E10;
  margin-bottom: 8px;
  text-align: left;
}

.settings-username-display-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.settings-username-pill {
  flex: 1;
  min-width: 0;
  height: 46px;
  background: #FAF0DC;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(54, 30, 16, 0.12);
  display: flex;
  align-items: center;
  padding: 0 18px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 15px;
  color: #361E10;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-edit-btn {
  height: 34px;
  min-width: 82px;
  padding: 0 18px;
  background: #FFF4DF;
  border: 1.8px solid #361E10;
  border-radius: 8px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #361E10;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.settings-edit-btn:hover {
  transform: translateY(-1px);
  filter: brightness(0.97);
}

.settings-edit-btn:active {
  transform: translateY(1px);
}

.settings-username-input {
  box-sizing: border-box;
  width: 100%;
  height: 46px;
  padding: 0 16px;
  background: #FFF4DF;
  border: 1.8px solid #361E10;
  border-radius: 10px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 15px;
  color: #361E10;
  outline: none;
}

.settings-edit-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 12px;
  width: 100%;
}

.settings-save-btn {
  flex: 1;
  height: 36px;
  background: #AFBF5C;
  border: 1.8px solid #361E10;
  border-radius: 8px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 14.5px;
  color: #FFFFFF;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease, opacity 0.15s ease;
}

.settings-save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.04);
}

.settings-save-btn:disabled {
  opacity: 0.48;
  cursor: not-allowed;
}

.settings-cancel-btn {
  flex: 1;
  height: 36px;
  background: #FFF4DF;
  border: 1.8px solid #361E10;
  border-radius: 8px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 14.5px;
  color: #1E120A;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.settings-cancel-btn:hover {
  transform: translateY(-1px);
  filter: brightness(0.97);
}

.settings-error-text {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 12px;
  color: #B93829;
  margin-top: 6px;
  text-align: left;
}

.settings-logout-btn {
  width: 100%;
  max-width: 290px;
  height: 44px;
  margin-top: 26px;
  background: #B97C49;
  border: 2.5px solid #361E10;
  border-radius: 10px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 16.5px;
  color: #FFF4DF;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.settings-logout-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.settings-logout-btn:active {
  transform: translateY(1px);
  filter: brightness(0.96);
}

.logout-confirm-text {
  margin: 0 0 26px 0;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.45;
  color: #361E10;
  text-align: center;
}

.logout-confirm-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
  max-width: 290px;
}

.logout-cancel-btn {
  flex: 1;
  height: 40px;
  background: #FFF4DF;
  border: 1.8px solid #361E10;
  border-radius: 10px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 15.5px;
  color: #1E120A;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.logout-cancel-btn:hover {
  transform: translateY(-1px);
  filter: brightness(0.97);
}

.logout-confirm-btn {
  flex: 1;
  height: 40px;
  background: #B97C49;
  border: 1.8px solid #361E10;
  border-radius: 10px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 15.5px;
  color: #FFF4DF;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.logout-confirm-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}
`;

function Settings({ user, onUpdateUser, onLogout, onClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
    return saved !== null ? Number(saved) : 60;
  });
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem(MUTED_STORAGE_KEY) === 'true';
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [draftUsername, setDraftUsername] = useState('');
  const [editError, setEditError] = useState('');

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (isLogoutConfirmOpen) {
          setIsLogoutConfirmOpen(false);
        } else if (isOpen) {
          setIsOpen(false);
          setIsEditingUsername(false);
          setEditError('');
        } else if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLogoutConfirmOpen, isMenuOpen]);

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

  const openSettingsModal = () => {
    if (onClick) {
      onClick();
      return;
    }
    setIsMenuOpen(false);
    setIsEditingUsername(false);
    setEditError('');
    setDraftUsername(user?.username || '');
    setIsOpen(true);
  };

  const closeSettingsModal = () => {
    setIsOpen(false);
    setIsEditingUsername(false);
    setEditError('');
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

  const handleStartEditUsername = () => {
    setDraftUsername(user?.username || '');
    setEditError('');
    setIsEditingUsername(true);
  };

  const handleCancelEditUsername = () => {
    setDraftUsername(user?.username || '');
    setEditError('');
    setIsEditingUsername(false);
  };

  const isUsernameUnchanged =
    !draftUsername.trim() || draftUsername.trim() === (user?.username || '');

  const handleSaveUsername = () => {
    const trimmed = draftUsername.trim();
    if (!trimmed || trimmed === (user?.username || '')) {
      return;
    }

    try {
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users = rawUsers ? JSON.parse(rawUsers) : [];
      const duplicate = users.some(
        (u) =>
          u.username.toLowerCase() === trimmed.toLowerCase() &&
          u.username.toLowerCase() !== (user?.username || '').toLowerCase()
      );
      if (duplicate) {
        setEditError('Username is already taken.');
        return;
      }

      const updatedUsers = users.map((u) =>
        u.username.toLowerCase() === (user?.username || '').toLowerCase()
          ? { ...u, username: trimmed }
          : u
      );
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      const updatedUser = { ...user, username: trimmed };
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedUser));

      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      setIsEditingUsername(false);
      setEditError('');
    } catch {
      setEditError('Could not save username.');
    }
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setIsLogoutConfirmOpen(false);
    setIsOpen(false);
    setIsMenuOpen(false);
    setIsEditingUsername(false);
    if (onLogout) {
      onLogout();
    }
  };

  const displayedVolume = isMuted ? 0 : volume;
  const currentFillWidth = (displayedVolume / 100) * 306;

  return (
    <>
      <style>{settingsStyles}</style>

      {!user ? (
        <button
          type="button"
          className="ribbon-settings-btn"
          onClick={openSettingsModal}
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
      ) : !isMenuOpen ? (
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
        <div className="ribbon-menu-wrapper is-expanded" aria-label="Expanded Menu">
          <img
            className="ribbon-svg"
            src={menuWrapperSvg}
            alt=""
            draggable="false"
          />

          <div className="expanded-menu-content">
            <button
              type="button"
              className="menu-close-btn"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close Menu"
              title="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 5L19 19M19 5L5 19"
                  stroke="#5E3A24"
                  strokeWidth="4.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="menu-action-tile"
              onClick={openSettingsModal}
              aria-label="Settings"
              title="Settings"
            >
              <img src={settingsButtonSvg} alt="" draggable="false" />
            </button>

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

      {isOpen && !isLogoutConfirmOpen && (
        <div
          className="settings-modal-backdrop"
          onClick={closeSettingsModal}
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
              onClick={closeSettingsModal}
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
                  <g transform="translate(30, 29.5) scale(0.76) translate(-26, -27)">
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
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    )}
                  </g>
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
                    toggleMute();
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
                    updateVolume(val);
                  }}
                  className="settings-volume-range-overlay"
                  aria-label="Volume Slider"
                />
              </div>

              {user && (
                <>
                  <div className="settings-user-section">
                    <span className="settings-user-label">Username</span>
                    {!isEditingUsername ? (
                      <div className="settings-username-display-row">
                        <div className="settings-username-pill">{user.username}</div>
                        <button
                          type="button"
                          className="settings-edit-btn"
                          onClick={handleStartEditUsername}
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          className="settings-username-input"
                          value={draftUsername}
                          onChange={(e) => {
                            setDraftUsername(e.target.value);
                            if (editError) setEditError('');
                          }}
                          aria-label="Username"
                        />
                        {editError && (
                          <span className="settings-error-text" role="alert">
                            {editError}
                          </span>
                        )}
                        <div className="settings-edit-actions">
                          <button
                            type="button"
                            className="settings-save-btn"
                            disabled={isUsernameUnchanged}
                            onClick={handleSaveUsername}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="settings-cancel-btn"
                            onClick={handleCancelEditUsername}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    className="settings-logout-btn"
                    onClick={() => setIsLogoutConfirmOpen(true)}
                  >
                    Log out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isLogoutConfirmOpen && (
        <div
          className="settings-modal-backdrop"
          onClick={() => setIsLogoutConfirmOpen(false)}
          aria-label="Log Out Confirmation Modal"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="settings-modal-frame"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="settings-modal-board">
              <h2 className="settings-modal-title">LOG OUT?</h2>
              <p className="logout-confirm-text">
                You will need to sign in again to
                <br />
                keep playing.
              </p>
              <div className="logout-confirm-actions">
                <button
                  type="button"
                  className="logout-cancel-btn"
                  onClick={() => setIsLogoutConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="logout-confirm-btn"
                  onClick={handleConfirmLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;
