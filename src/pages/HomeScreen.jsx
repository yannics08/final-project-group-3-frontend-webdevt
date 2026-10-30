import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from '../components/Settings';
import MenuBoard from '../components/MenuBoard';
import StartButton from '../components/StartButton';
import AuthModal from '../components/AuthModal';
import AdminDashboard from '../components/AdminDashboard';
import Leaderboard from '../components/Leaderboard';
import './HomeScreen.css';
import {
  callApi,
  warmUpServer,
  getStoredToken,
  loadSavedUser,
  saveLogin,
  clearSavedLogin,
} from '../services/api';

// Used until the real numbers arrive from the server.
const EMPTY_PLAYER_INFO = { day: 1, ranking: null, highScore: null };

function HomeScreen() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => loadSavedUser());
  const [playerInfo, setPlayerInfo] = useState(EMPTY_PLAYER_INFO);
  const [activeOverlay, setActiveOverlay] = useState(null);

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
    setCurrentUser(userData);
    setAuthMode(null);
  }

  function handleLogout() {
    clearSavedLogin();
    setCurrentUser(null);
    setPlayerInfo(EMPTY_PLAYER_INFO);
    setActiveOverlay(null);
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
          onLogout={handleLogout}
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
      </main>
    </div>
  );
}

export default HomeScreen;