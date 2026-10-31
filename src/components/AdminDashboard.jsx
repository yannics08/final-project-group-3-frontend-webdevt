import { useState, useEffect } from 'react';
import adminBgSvg from '../assets/admin (bg).svg';
import closeButtonSvg from '../assets/close button.svg';
import searchButtonSvg from '../assets/search button.svg';
import resetNameButtonSvg from '../assets/reset name button.svg';
import deleteButtonSvg from '../assets/delete button.svg';
import {
  getAdminUsers,
  resetDisplayName,
  banUser,
  unbanUser,
  deleteUser,
} from '../services/api';
import { useDebounce } from '../hooks/useDebounce';

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
  grid-template-columns: 2fr 0.9fr 0.8fr 2.6fr;
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
  grid-template-columns: 2fr 0.9fr 0.8fr 2.6fr;
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

.admin-player-status {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: clamp(11px, 0.95vw, 13px);
  color: #B93829;
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

.admin-ban-btn {
  height: 36px;
  padding: 0 14px;
  background: #FFF4DF;
  border: 2px solid #361E10;
  border-radius: 8px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: clamp(12px, 1.05vw, 14px);
  color: #361E10;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease, opacity 0.15s ease;
}

.admin-ban-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(0.97);
}

.admin-ban-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.admin-action-error {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: #B93829;
  text-align: center;
  margin-bottom: 8px;
}
`;

function AdminDashboard({ onClose }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [busyId, setBusyId] = useState(null);       // id of the player being changed
  const [actionError, setActionError] = useState(''); // message if an action fails
  const [reloadKey, setReloadKey] = useState(0);     // change it to reload the list

  // Only changes 500 ms after the admin stops typing.
  const debouncedSearch = useDebounce(searchInput.trim(), 500);
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

  useEffect(() => {
    // If the admin types again before this request finishes,
    // the cleanup below sets this to true so the old answer is ignored.
    let isCancelled = false;

    async function loadUsers() {
      try {
        const data = await getAdminUsers(debouncedSearch, 200);
        if (isCancelled) return;
        setUsers(data.users);
        setTotal(data.total);
        setErrorMessage('');
      } catch (error) {
        if (isCancelled) return;
        setErrorMessage(error.message);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadUsers();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, reloadKey]);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // the debounce already handles searching
  };
  
const handleOpenResetModal = (player) => {
  if (player.nameResetPending) return;
  setResetTarget(player);
};

async function handleConfirmResetName() {
  if (!resetTarget || busyId !== null) return;

  setBusyId(resetTarget.id);
  setActionError('');
  try {
    const data = await resetDisplayName(resetTarget.id);

    // Merge, don't replace: this response has no `rank`, so we keep
    // the old row and only overwrite the fields that came back.
    setUsers((oldUsers) =>
      oldUsers.map((u) =>
        u.id === resetTarget.id ? { ...u, ...data.user } : u
      )
    );
  } catch (error) {
    setActionError(error.message);
  } finally {
    setBusyId(null);
    setResetTarget(null);
  }
}

  async function handleToggleBan(player) {
    if (busyId !== null) return;

    setBusyId(player.id);
    setActionError('');
    try {
      let data;
      if (player.isBanned) {
        data = await unbanUser(player.id);
      } else {
        data = await banUser(player.id);
      }

      setUsers((oldUsers) =>
        oldUsers.map((u) => (u.id === player.id ? { ...u, ...data.user } : u))
      );
      setReloadKey((key) => key + 1); // ranks of other players may have changed
    } catch (error) {
      setActionError(error.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleConfirmDeletePlayer() {
    if (!deleteTarget || busyId !== null) return;

    setBusyId(deleteTarget.id);
    setActionError('');
    try {
      await deleteUser(deleteTarget.id);

      // Remove the row right away, then reload to fix everyone's rank.
      setUsers((oldUsers) => oldUsers.filter((u) => u.id !== deleteTarget.id));
      setTotal((oldTotal) => oldTotal - 1);
      setReloadKey((key) => key + 1);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  }

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

          {/* The cream panel. EVERYTHING below lives inside this div. */}
          <div className="admin-board-inner">
            <h2 className="admin-board-title">ADMIN DASHBOARD</h2>

            <div className="admin-toolbar-row">
              <form className="admin-search-box" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by name"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  aria-label="Search by name"
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
                {total} {total === 1 ? 'player' : 'players'}
              </span>
            </div>

            {actionError && (
              <div className="admin-action-error" role="alert">{actionError}</div>
            )}

            <div className="admin-table-header">
              <span className="admin-col-player">PLAYER</span>
              <span className="admin-col-points">POINTS</span>
              <span className="admin-col-rank">RANK</span>
              <span className="admin-col-actions">ACTIONS</span>
            </div>

            <div className="admin-table-body">
              {isLoading && <div className="admin-empty-state">Loading players...</div>}

              {!isLoading && errorMessage && (
                <div className="admin-empty-state" role="alert">{errorMessage}</div>
              )}

              {!isLoading && !errorMessage && users.length === 0 && (
                <div className="admin-empty-state">No players found.</div>
              )}

              {!isLoading && !errorMessage && users.map((player) => (
                <div key={player.id} className="admin-table-row">
                  <div className="admin-player-info">
                    <span className="admin-player-username">{player.displayName}</span>
                    {player.isBanned && (
                      <span className="admin-player-status">Banned</span>
                    )}
                  </div>

                  <span className="admin-player-points">{player.highScore}</span>

                  <span className="admin-player-rank">
                    {player.rank !== null ? '#' + player.rank : '—'}
                  </span>

                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-action-svg-btn is-reset"
                      disabled={Boolean(player.nameResetPending) || busyId === player.id}
                      onClick={() => handleOpenResetModal(player)}
                      aria-label={`Reset name for ${player.displayName}`}
                      title={player.nameResetPending ? 'Waiting for the player to pick a new name' : 'Reset Name'}
                    >
                      <img src={resetNameButtonSvg} alt="Reset Name" draggable="false" />
                    </button>

                    <button
                      type="button"
                      className="admin-ban-btn"
                      disabled={busyId === player.id}
                      onClick={() => handleToggleBan(player)}
                    >
                      {player.isBanned ? 'Unban' : 'Ban'}
                    </button>

                    <button
                      type="button"
                      className="admin-action-svg-btn is-delete"
                      disabled={busyId === player.id}
                      onClick={() => setDeleteTarget(player)}
                      aria-label={`Delete ${player.displayName}`}
                      title="Delete"
                    >
                      <img src={deleteButtonSvg} alt="Delete" draggable="false" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* end of admin-board-inner */}
        </div>
        {/* end of admin-board-frame */}

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
                  {resetTarget.displayName} will be given a random
                  <br />
                  name, like Barista4821. They will be asked
                  <br />
                  to choose a new one.
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
                    disabled={busyId !== null}
                    onClick={handleConfirmResetName}
                  >
                    {busyId !== null ? 'Resetting...' : 'Reset Name'}
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
                  {deleteTarget.displayName} and all their data. This
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
                    disabled={busyId !== null}
                    onClick={handleConfirmDeletePlayer}
                  >
                    {busyId !== null ? 'Deleting...' : 'Delete'}
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