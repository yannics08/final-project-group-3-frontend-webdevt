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

const USERS_STORAGE_KEY = 'madcoffee_users';
const CURRENT_USER_STORAGE_KEY = 'madcoffee_current_user';

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function computeUserWithStats(user) {
  if (!user) return null;
  if (user.isAdmin || user.username?.toLowerCase() === 'admin') {
    return {
      username: 'admin',
      isAdmin: true,
    };
  }
  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const users = rawUsers ? JSON.parse(rawUsers) : [];
    const matched = users.find(
      (u) => u.username.toLowerCase() === user.username.toLowerCase()
    );
    const points = matched?.points ?? user.points ?? 0;
    const day = matched?.day ?? user.day ?? 0;
    const sorted = [...users]
      .filter((u) => u.username?.toLowerCase() !== 'admin' && !u.deleted)
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
    const rankIndex = sorted.findIndex(
      (u) => u.username.toLowerCase() === (matched?.username || user.username).toLowerCase()
    );
    const ranking = rankIndex >= 0 ? rankIndex + 1 : 1;
    return {
      ...user,
      username: matched?.username || user.username,
      points,
      day,
      ranking,
    };
  } catch {
    return {
      ...user,
      points: user.points ?? 0,
      day: user.day ?? 0,
      ranking: 1,
    };
  }
}

function readAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function evaluateSession(session) {
  if (!session || session.isAdmin || session.username?.toLowerCase() === 'admin') {
    return { session, notice: null };
  }
  const name = session.username?.toLowerCase();
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
  const stored = loadCurrentUser();
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
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser());
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [notice, setNotice] = useState(() => evaluateSession(loadCurrentUser()).notice);
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

  const activeUser = computeUserWithStats(currentUser);
  const isAdmin = Boolean(activeUser && (activeUser.isAdmin || activeUser.username?.toLowerCase() === 'admin'));

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
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    currentUserRef.current = null;
    setCurrentUser(null);
    setNotice(null);
    setActiveOverlay(null);
    setAuthMode('login');
  }

  function handleStart() {
    navigate('/game');
  }

  return (
    <div className="home-container">
      <main className="game-screen" aria-label="Mad Coffee Game Screen">
        <Settings
          user={activeUser}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          onLogout={() => {
            setCurrentUser(null);
            setActiveOverlay(null);
          }}
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
            day={activeUser.day ?? 0}
            onClick={handleStart}
          />
        )}
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onSwitchMode={(mode) => setAuthMode(mode)}
            onSuccess={handleAuthSuccess}
            onAccountDeleted={() => setNotice('deleted')}
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