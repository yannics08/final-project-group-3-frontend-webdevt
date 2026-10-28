import { useState } from 'react';
import Settings from '../components/Settings';
import MenuBoard from '../components/MenuBoard';
import AuthModal from '../components/AuthModal';
import './HomeScreen.css';

function HomeScreen() {
  const [authMode, setAuthMode] = useState(null);

  function handleLogin() {
    setAuthMode('login');
  }

  function handleSignup() {
    setAuthMode('signup');
  }

  function handleAuthSuccess() {
    setAuthMode(null);
  }

  return (
    <div className="home-container">
      <main className="game-screen" aria-label="Mad Coffee Game Screen">
        <Settings />
        <MenuBoard onLogin={handleLogin} onSignup={handleSignup} />
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onSwitchMode={(mode) => setAuthMode(mode)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </main>
    </div>
  );
}

export default HomeScreen;
