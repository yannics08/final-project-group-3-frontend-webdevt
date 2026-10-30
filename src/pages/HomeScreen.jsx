import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from '../components/Settings';
import MenuBoard from '../components/MenuBoard';
import StartButton from '../components/StartButton';
import AuthModal from '../components/AuthModal';
import AdminDashboard from '../components/AdminDashboard';
import Leaderboard from '../components/Leaderboard';
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
      .filter((u) => u.username?.toLowerCase() !== 'admin')
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

function HomeScreen() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser());
  const [activeOverlay, setActiveOverlay] = useState(null);

  const activeUser = computeUserWithStats(currentUser);
  const isAdmin = Boolean(activeUser && (activeUser.isAdmin || activeUser.username?.toLowerCase() === 'admin'));

  function handleLogin() {
    setAuthMode('login');
  }

  function handleSignup() {
    setAuthMode('signup');
  }

  function handleAuthSuccess(userData) {
    setCurrentUser(userData);
    setAuthMode(null);
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
          />
        )}
        {activeOverlay === 'dashboard' && (
          <AdminDashboard onClose={() => setActiveOverlay(null)} />
        )}
        {activeOverlay === 'leaderboard' && (
          <Leaderboard onClose={() => setActiveOverlay(null)} />
        )}
      </main>
    </div>
  );
}

export default HomeScreen;
