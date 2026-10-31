
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from '../components/Settings';
import MenuBoard from '../components/MenuBoard';
import StartButton from '../components/StartButton';
import AuthModal from '../components/AuthModal';
import AdminDashboard from '../components/AdminDashboard';
import Leaderboard from '../components/Leaderboard';
import AccountNotice from '../components/AccountNotice';
import './HomeScreen.css';
import {
  callApi,
  warmUpServer,
  getStoredToken,
  loadSavedUser,
  saveLogin,
  CURRENT_USER_STORAGE_KEY,
  clearSavedLogin,
} from '../services/api';
import { useGame } from '../context/GameContext';

const USERS_STORAGE_KEY = 'madcoffee_users';

// Used until the real numbers arrive from the server.
const EMPTY_PLAYER_INFO = { day: 1, ranking: null, highScore: null };

function readAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function evaluateSession(session) {
  if (!session || session.isAdmin || session.role === 'admin' || session.username?.toLowerCase() === 'admin') {
    return { session, notice: null };
  }
  const name = (session.username || session.displayName)?.toLowerCase();
  if (!name) return { session, notice: null };
  const users = readAllUsers();
  const entry =
    users.find((u) => u.username?.toLowerCase() === name) ||
    users.find((u) => u.resetFrom?.toLowerCase() === name);
  if (!entry) return { session, notice: null };
  if (entry.deleted) return { session, notice: 'deleted' };
  if (entry.nameResetPending) {
    const synced = { ...session, username: entry.username, nameResetPending: true };
    return { session: synced, notice: session.noticeAcked ? null : 'reset' };
  }
  return { session, notice: null };
}

function persistSession(session, previousNames) {
  const stored = loadSavedUser();
  if (!stored) return;
  const storedName = stored.username?.toLowerCase();
  const names = [...previousNames, session.username].map((n) => n?.toLowerCase());
  if (names.includes(storedName)) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(session));
  }
}

function HomeScreen() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => loadSavedUser());
  const [playerInfo, setPlayerInfo] = useState(EMPTY_PLAYER_INFO);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [notice, setNotice] = useState(() => evaluateSession(loadSavedUser()).notice);
  const [openSettingsEditKey, setOpenSettingsEditKey] = useState(0);
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const checkAccountStatus = useCallback(() => {
    const session = currentUserRef.current;
    if (!session) return;
    const result = evaluateSession(session);
    if (result.session && result.session.username !== session.username) {
      persistSession(result.session, [session.username]);
      currentUserRef.current = result.session;
      setCurrentUser(result.session);
    }
    setNotice((prev) => (prev === result.notice ? prev : result.notice));
  }, []);

  useEffect(() => {
    checkAccountStatus();
    const intervalId = setInterval(checkAccountStatus, 1500);
    window.addEventListener('storage', checkAccountStatus);
    window.addEventListener('focus', checkAccountStatus);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', checkAccountStatus);
      window.removeEventListener('focus', checkAccountStatus);
    };
  }, [checkAccountStatus]);
  const { startGame } = useGame();
  const [isStarting, setIsStarting] = useState(false);

  // Small values worked out from currentUser on every render.
  const userId = currentUser ? currentUser.id : null;
  const userDisplayName = currentUser ? currentUser.displayName : '';
  const isAdmin = currentUser ? currentUser.role === 'admin' : false;

  // Effect 1: runs once when the page loads.
  useEffect(() => {
    async function restoreLogin() {
      const token = getStoredToken();

      // Not logged in: wake the server up while the player reads the page.
      if (!token) {
        warmUpServer().catch(() => {});
        return;
      }

      // Logged in before: ask the server if the token still works.
      try {
        const data = await callApi('/api/auth/me');
        saveLogin(token, data.user);
        setCurrentUser(data.user);
      } catch (error) {
        // 401 = expired or invalid token, 403 = banned.
        if (error.status === 401 || error.status === 403) {
          clearSavedLogin();
          setCurrentUser(null);
        }
      }
    }

    restoreLogin();
  }, []);

  // Effect 2: loads the high score, games played and rank for a player.
  useEffect(() => {
    if (!userId || isAdmin) return;

    async function loadPlayerInfo() {
      try {
        const statsData = await callApi('/api/users/me/stats');
        const boardData = await callApi('/api/leaderboard?limit=100');

        // Find this player's position in the top 100.
        let ranking = null;
        for (let i = 0; i < boardData.leaderboard.length; i++) {
          const entryName = boardData.leaderboard[i].displayName.toLowerCase();
          if (entryName === userDisplayName.toLowerCase()) {
            ranking = i + 1;
            break;
          }
        }

        setPlayerInfo({
          day: statsData.stats.totalSessions + 1,
          ranking: ranking,
          highScore: statsData.stats.highScore,
        });
      } catch (error) {
        console.log('Could not load player info:', error);
      }
    }

    loadPlayerInfo();
  }, [userId, userDisplayName, isAdmin]);

  // The user object the other components expect (same field names as before).
  let activeUser = null;
  if (currentUser) {
    activeUser = {
      ...currentUser,
      username: currentUser.username || currentUser.displayName,
      isAdmin: isAdmin,
      points: playerInfo.highScore ?? currentUser.highScore ?? 0,
      day: playerInfo.day,
      ranking: playerInfo.ranking,
    };
  }

  function handleLogin() {
    setAuthMode('login');
  }

  function handleSignup() {
    setAuthMode('signup');
  }

  function handleAuthSuccess(userData) {
    currentUserRef.current = userData;
    setCurrentUser(userData);
    setAuthMode(null);
    setNotice(evaluateSession(userData).notice);
  }

  function handleChangeUsername() {
    const session = currentUserRef.current;
    if (session) {
      const acknowledged = { ...session, noticeAcked: true };
      persistSession(acknowledged, [session.username]);
      currentUserRef.current = acknowledged;
      setCurrentUser(acknowledged);
    }
    setNotice(null);
    setOpenSettingsEditKey((prev) => prev + 1);
  }

  function handleBackToLogin() {
    clearSavedLogin();
    setPlayerInfo(EMPTY_PLAYER_INFO);
    currentUserRef.current = null;
    setCurrentUser(null);
    setNotice(null);
    setActiveOverlay(null);
    setAuthMode('login');
  }

  function handleLogout() {
    clearSavedLogin();
    setCurrentUser(null);
    setPlayerInfo(EMPTY_PLAYER_INFO);
    setActiveOverlay(null);
  }

  async function handleStart() {
    if (isStarting) return;

    setIsStarting(true);
    try {
      await startGame();
      navigate('/game');
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        handleLogout();
      }
      alert(error.message);
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div className="home-container">
      <main className="game-screen" aria-label="Mad Coffee Game Screen">
        <Settings
          user={activeUser}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          onLogout={handleLogout}
          onOpenLeaderboard={() => setActiveOverlay('leaderboard')}
          autoOpenEditKey={openSettingsEditKey}
        />
        <MenuBoard
          user={activeUser}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onOpenDashboard={() => setActiveOverlay('dashboard')}
          onOpenLeaderboard={() => setActiveOverlay('leaderboard')}
        />
        {activeUser && !isAdmin && (
          <StartButton
            day={activeUser.day}
            onClick={handleStart}
          />
        )}
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onSwitchMode={(mode) => setAuthMode(mode)}
            onSuccess={handleAuthSuccess}
          />
        )}
        {activeOverlay === 'dashboard' && (
          <AdminDashboard onClose={() => setActiveOverlay(null)} />
        )}
        {activeOverlay === 'leaderboard' && (
          <Leaderboard onClose={() => setActiveOverlay(null)} />
        )}
        {notice && (
          <AccountNotice
            type={notice}
            username={activeUser?.username}
            onChangeUsername={handleChangeUsername}
            onBackToLogin={handleBackToLogin}
          />
        )}
      </main>
    </div>
  );
}

export default HomeScreen;