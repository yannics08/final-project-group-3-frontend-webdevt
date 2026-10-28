import { useState, useEffect } from 'react';
import adminBgSvg from '../assets/admin (bg).svg';
import closeButtonSvg from '../assets/close button.svg';
import searchButtonSvg from '../assets/search button.svg';
import resetNameButtonSvg from '../assets/reset name button.svg';
import deleteButtonSvg from '../assets/delete button.svg';

const USERS_STORAGE_KEY = 'madcoffee_users';
const CURRENT_USER_STORAGE_KEY = 'madcoffee_current_user';

const adminDashboardStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&family=Lilita+One&family=Nunito:wght@600;700;800;900&display=swap');

.admin-screen-overlay {
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

.admin-board-frame {
  box-sizing: border-box;
  position: relative;
  width: 86.5%;
  height: 84.5%;
  background: #C48B56;
  border: 4px solid #361E10;
  border-radius: 14px;
  padding: 1.4%;
  display: flex;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.32);
}

.admin-close-btn {
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

.admin-close-btn img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.admin-close-btn:hover {
  transform: scale(1.08);
  filter: brightness(1.05);
}

.admin-close-btn:active {
  transform: scale(0.94);
}

.admin-board-inner {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #FFF4DF;
  border: 3.5px solid #361E10;
  border-radius: 4px;
  box-shadow: inset -12px 0 0 rgba(54, 30, 16, 0.18);
  display: flex;
  flex-direction: column;
  padding: 3.2% 4.2% 2.6%;
  overflow: hidden;
}

.admin-board-title {
  margin: 0 0 2.2% 0;
  font-family: 'Lilita One', 'Fredoka', cursive, sans-serif;
  font-weight: 700;
  font-size: clamp(24px, 3.3vw, 44px);
  color: #361E10;
  text-align: center;
  letter-spacing: 0.02em;
  line-height: 1;
}

.admin-toolbar-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  width: 100%;
  margin-bottom: 2.2%;
}

.admin-search-box {
  position: relative;
  flex: 0 1 70%;
  height: 48px;
  background: #FFFDF8;
  border: 2px solid #361E10;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 6px 0 16px;
  box-sizing: border-box;
}

.admin-search-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  background: transparent;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: clamp(13px, 1.2vw, 16px);
  color: #361E10;
  outline: none;
}

.admin-search-input::placeholder {
  color: #9C8B7A;
  font-weight: 600;
}

.admin-search-submit-btn {
  height: 38px;
  aspect-ratio: 147 / 63;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.admin-search-submit-btn img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.admin-search-submit-btn:hover {
  transform: scale(1.03);
  filter: brightness(1.05);
}

.admin-search-submit-btn:active {
  transform: scale(0.97);
}

.admin-players-count {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: clamp(13px, 1.2vw, 16.5px);
  color: #361E10;
  white-space: nowrap;
}

.admin-table-header {
  display: grid;
  grid-template-columns: 2.2fr 1fr 0.9fr 1.8fr;
  align-items: center;
  padding: 0 10px 8px;
  border-bottom: 3.5px solid #361E10;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: clamp(12px, 1.15vw, 15.5px);
  color: #5A3824;
  letter-spacing: 0.02em;
}

.admin-col-player {
  text-align: left;
}

.admin-col-points,
.admin-col-rank,
.admin-col-actions {
  text-align: center;
}

.admin-table-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.admin-table-row {
  display: grid;
  grid-template-columns: 2.2fr 1fr 0.9fr 1.8fr;
  align-items: center;
  padding: 12px 10px;
  border-bottom: 2px dashed #D8BF99;
  min-height: 62px;
  box-sizing: border-box;
}

.admin-player-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.admin-player-username {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: clamp(14px, 1.3vw, 18px);
  color: #1E120A;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.admin-player-email {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: clamp(11px, 0.95vw, 13px);
  color: #361E10;
  line-height: 1.2;
  margin-top: 2px;
}

.admin-player-points,
.admin-player-rank {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: clamp(14px, 1.3vw, 18px);
  color: #1E120A;
  text-align: center;
}

.admin-row-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.admin-action-svg-btn {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  transition: transform 0.12s ease, filter 0.12s ease, opacity 0.15s ease;
}

.admin-action-svg-btn.is-reset {
  aspect-ratio: 152 / 52;
}

.admin-action-svg-btn.is-delete {
  aspect-ratio: 120 / 52;
}

.admin-action-svg-btn img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.admin-action-svg-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.04);
}

.admin-action-svg-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.admin-action-svg-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.admin-empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #7A5A40;
}

.admin-popup-backdrop {
  position: absolute;
  inset: 0;
  z-index: 80;
  background: rgba(20, 10, 5, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

.admin-popup-frame {
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  background: #C48B56;
  border: 4px solid #361E10;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}

.admin-popup-board {
  box-sizing: border-box;
  width: 100%;
  background: #FFF4DF;
  border: 3px solid #361E10;
  border-radius: 4px;
  box-shadow: inset -10px 0 0 rgba(54, 30, 16, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 28px 30px;
}

.admin-popup-title {
  margin: 0 0 18px 0;
  font-family: 'Lilita One', 'Fredoka', cursive, sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: #361E10;
  text-align: center;
  letter-spacing: 0.02em;
  line-height: 1;
}

.admin-popup-message {
  margin: 0 0 24px 0;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 15.5px;
  line-height: 1.45;
  color: #361E10;
  text-align: center;
}

.admin-popup-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 300px;
}

.admin-popup-cancel-btn {
  flex: 1;
  height: 40px;
  background: #FFF4DF;
  border: 1.8px solid #361E10;
  border-radius: 10px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: #1E120A;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.admin-popup-cancel-btn:hover {
  transform: translateY(-1px);
  filter: brightness(0.97);
}

.admin-popup-confirm-reset-btn {
  flex: 1.25;
  height: 40px;
  background: #B97C49;
  border: 1.8px solid #361E10;
  border-radius: 10px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 15px;
  color: #FFF4DF;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.admin-popup-confirm-reset-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.admin-popup-confirm-delete-btn {
  flex: 1;
  height: 40px;
  background: #8C3023;
  border: 1.8px solid #361E10;
  border-radius: 10px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 15px;
  color: #FFF4DF;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.admin-popup-confirm-delete-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}
`;

function loadStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return parsed.filter((u) => u.username?.toLowerCase() !== 'admin');
  } catch {
    return [];
  }
}

function generateDefaultPlayerName(existingUsers) {
  const existingSet = new Set(existingUsers.map((u) => u.username.toLowerCase()));
  for (let i = 0; i < 100; i += 1) {
    const digits = Math.floor(1000 + Math.random() * 9000);
    const candidate = `Player${digits}`;
    if (!existingSet.has(candidate.toLowerCase())) {
      return candidate;
    }
  }
  return `Player${Date.now().toString().slice(-4)}`;
}

function AdminDashboard({ onClose }) {
  const [users, setUsers] = useState(() => loadStoredUsers());
  const [searchInput, setSearchInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [resetTarget, setResetTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (resetTarget) {
          setResetTarget(null);
        } else if (deleteTarget) {
          setDeleteTarget(null);
        } else if (onClose) {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetTarget, deleteTarget, onClose]);

  const rankedUsers = [...users]
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

  const activeQuery = (appliedQuery || searchInput).trim().toLowerCase();
  const filteredUsers = activeQuery
    ? rankedUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(activeQuery) ||
          (u.email && u.email.toLowerCase().includes(activeQuery))
      )
    : rankedUsers;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedQuery(searchInput);
  };

  const handleOpenResetModal = (player) => {
    if (player.nameResetPending) return;
    const defaultName = generateDefaultPlayerName(users);
    setResetTarget({ player, defaultName });
  };

  const handleConfirmResetName = () => {
    if (!resetTarget) return;
    const { player, defaultName } = resetTarget;

    const updatedUsers = users.map((u) =>
      u.username.toLowerCase() === player.username.toLowerCase()
        ? { ...u, username: defaultName, nameResetPending: true }
        : u
    );
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    try {
      const rawCurrent = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (rawCurrent) {
        const parsedCurrent = JSON.parse(rawCurrent);
        if (parsedCurrent.username?.toLowerCase() === player.username.toLowerCase()) {
          localStorage.setItem(
            CURRENT_USER_STORAGE_KEY,
            JSON.stringify({ ...parsedCurrent, username: defaultName, nameResetPending: true })
          );
        }
      }
    } catch {
      void 0;
    }

    setResetTarget(null);
  };

  const handleConfirmDeletePlayer = () => {
    if (!deleteTarget) return;
    const updatedUsers = users.filter(
      (u) => u.username.toLowerCase() !== deleteTarget.username.toLowerCase()
    );
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    try {
      const rawCurrent = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (rawCurrent) {
        const parsedCurrent = JSON.parse(rawCurrent);
        if (parsedCurrent.username?.toLowerCase() === deleteTarget.username.toLowerCase()) {
          localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
        }
      }
    } catch {
      void 0;
    }

    setDeleteTarget(null);
  };

  return (
    <>
      <style>{adminDashboardStyles}</style>
      <div className="admin-screen-overlay" role="dialog" aria-modal="true" aria-label="Admin Dashboard">
        <div className="admin-board-frame">
          <button
            type="button"
            className="admin-close-btn"
            onClick={onClose}
            aria-label="Close Admin Dashboard"
            title="Close"
          >
            <img src={closeButtonSvg} alt="Close" draggable="false" />
          </button>

          <div className="admin-board-inner">
            <h2 className="admin-board-title">ADMIN DASHBOARD</h2>

            <div className="admin-toolbar-row">
              <form className="admin-search-box" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by username or email"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setAppliedQuery(e.target.value);
                  }}
                  aria-label="Search by username or email"
                />
                <button
                  type="submit"
                  className="admin-search-submit-btn"
                  aria-label="Search"
                  title="Search"
                >
                  <img src={searchButtonSvg} alt="Search" draggable="false" />
                </button>
              </form>

              <span className="admin-players-count">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'player' : 'players'}
              </span>
            </div>

            <div className="admin-table-header">
              <span className="admin-col-player">PLAYER</span>
              <span className="admin-col-points">POINTS</span>
              <span className="admin-col-rank">RANK</span>
              <span className="admin-col-actions">ACTIONS</span>
            </div>

            <div className="admin-table-body">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((player) => (
                  <div key={player.username} className="admin-table-row">
                    <div className="admin-player-info">
                      <span className="admin-player-username">{player.username}</span>
                      {player.email && (
                        <span className="admin-player-email">{player.email}</span>
                      )}
                    </div>

                    <span className="admin-player-points">{player.points ?? 0}</span>

                    <span className="admin-player-rank">#{player.rank}</span>

                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-action-svg-btn is-reset"
                        disabled={Boolean(player.nameResetPending)}
                        onClick={() => handleOpenResetModal(player)}
                        aria-label={`Reset name for ${player.username}`}
                        title="Reset Name"
                      >
                        <img src={resetNameButtonSvg} alt="Reset Name" draggable="false" />
                      </button>

                      <button
                        type="button"
                        className="admin-action-svg-btn is-delete"
                        onClick={() => setDeleteTarget(player)}
                        aria-label={`Delete ${player.username}`}
                        title="Delete"
                      >
                        <img src={deleteButtonSvg} alt="Delete" draggable="false" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">No players found.</div>
              )}
            </div>
          </div>
        </div>

        {resetTarget && (
          <div
            className="admin-popup-backdrop"
            onClick={() => setResetTarget(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Reset Name Confirmation"
          >
            <div className="admin-popup-frame" onClick={(e) => e.stopPropagation()}>
              <div className="admin-popup-board">
                <h3 className="admin-popup-title">RESET NAME?</h3>
                <p className="admin-popup-message">
                  {resetTarget.player.username} will be given a default
                  <br />
                  name, like {resetTarget.defaultName}. They can
                  <br />
                  change their username in the settings.
                </p>
                <div className="admin-popup-actions">
                  <button
                    type="button"
                    className="admin-popup-cancel-btn"
                    onClick={() => setResetTarget(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="admin-popup-confirm-reset-btn"
                    onClick={handleConfirmResetName}
                  >
                    Reset Name
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div
            className="admin-popup-backdrop"
            onClick={() => setDeleteTarget(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Delete Player Confirmation"
          >
            <div className="admin-popup-frame" onClick={(e) => e.stopPropagation()}>
              <div className="admin-popup-board">
                <h3 className="admin-popup-title">DELETE PLAYER?</h3>
                <p className="admin-popup-message">
                  This will permanently delete
                  <br />
                  {deleteTarget.username} and all their data. This
                  <br />
                  can’t be undone.
                </p>
                <div className="admin-popup-actions">
                  <button
                    type="button"
                    className="admin-popup-cancel-btn"
                    onClick={() => setDeleteTarget(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="admin-popup-confirm-delete-btn"
                    onClick={handleConfirmDeletePlayer}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;

