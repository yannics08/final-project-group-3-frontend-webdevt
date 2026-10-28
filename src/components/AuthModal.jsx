import { useState, useEffect } from 'react';
import closeButtonSvg from '../assets/close button.svg';

const authModalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&family=Lilita+One&family=Nunito:wght@600;700;800&display=swap');

.cafe-modal-backdrop {
  position: absolute;
  inset: 0;
  z-index: 60;
  background: rgba(20, 10, 5, 0.52);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: cafeModalFadeIn 0.18s ease-out;
  padding: 16px;
  box-sizing: border-box;
}

@keyframes cafeModalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes cafeModalPopIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.cafe-modal-frame {
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  background: #C48B56;
  border: 4px solid #361E10;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  animation: cafeModalPopIn 0.2s cubic-bezier(0.34, 1.35, 0.64, 1);
  user-select: none;
  position: relative;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}

.cafe-modal-close-btn {
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

.cafe-modal-close-btn img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.cafe-modal-close-btn:hover {
  transform: scale(1.1);
  filter: brightness(1.06);
}

.cafe-modal-close-btn:active {
  transform: scale(0.94);
}

.cafe-modal-board {
  box-sizing: border-box;
  width: 100%;
  background: #FFF4DF;
  border: 3px solid #361E10;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 30px 32px 24px;
  position: relative;
}

.cafe-modal-title {
  margin: 0 0 20px 0;
  font-family: 'Lilita One', 'Fredoka', cursive, sans-serif;
  font-weight: 700;
  font-size: 34px;
  color: #361E10;
  text-align: center;
  letter-spacing: 0.03em;
  line-height: 1;
}

.cafe-modal-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.cafe-form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.cafe-form-label {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 15px;
  color: #361E10;
  margin-bottom: 5px;
}

.cafe-form-input {
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  padding: 0 14px;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: #361E10;
  background: #FFFAF0;
  border: 2.5px solid #361E10;
  border-radius: 12px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.cafe-form-input:focus {
  border-color: #B97C49;
  box-shadow: 0 0 0 3px rgba(185, 124, 73, 0.3);
}

.cafe-form-helper {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-size: 11.5px;
  line-height: 1.35;
  color: #361E10;
  margin-top: 4px;
}

.cafe-modal-btn {
  margin-top: 14px;
  width: 100%;
  height: 48px;
  background: #B97C49;
  border: 3px solid #361E10;
  border-radius: 12px;
  color: #FFFFFF;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.cafe-modal-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
}

.cafe-modal-btn:active {
  transform: translateY(2px);
  filter: brightness(0.96);
}

.cafe-modal-footer {
  margin-top: 14px;
  text-align: center;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-size: 13.5px;
  color: #361E10;
}

.cafe-switch-btn {
  background: transparent;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  font-weight: 800;
  color: #361E10;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  margin-left: 4px;
}

.cafe-switch-btn:hover {
  color: #865023;
}
`;

function AuthModal({ mode = 'login', onClose, onSwitchMode, onSuccess }) {
  const [internalMode, setInternalMode] = useState(mode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const currentMode = internalMode;
  const isLogin = currentMode === 'login';

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (onSuccess) {
      onSuccess({ username: isLogin ? (username || email) : username, email, mode: currentMode });
    }
    onClose();
  };

  const handleSwitch = (newMode) => {
    setInternalMode(newMode);
    if (onSwitchMode) {
      onSwitchMode(newMode);
    }
  };

  return (
    <>
      <style>{authModalStyles}</style>
      <div
        className="cafe-modal-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={isLogin ? 'Log In Modal' : 'Sign Up Modal'}
      >
        <div
          className="cafe-modal-frame"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="cafe-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <img src={closeButtonSvg} alt="Close" draggable="false" />
          </button>

          <div className="cafe-modal-board">
            <h2 className="cafe-modal-title">
              {isLogin ? 'LOG IN' : 'SIGN UP'}
            </h2>

            {isLogin ? (
              <form className="cafe-modal-form" onSubmit={handleSubmit}>
                <div className="cafe-form-group">
                  <label htmlFor="login-email" className="cafe-form-label">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="cafe-form-input"
                    autoComplete="email"
                  />
                </div>

                <div className="cafe-form-group">
                  <label htmlFor="login-password" className="cafe-form-label">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cafe-form-input"
                    autoComplete="current-password"
                  />
                </div>

                <button type="submit" className="cafe-modal-btn">
                  Log in
                </button>

                <div className="cafe-modal-footer">
                  No account yet?
                  <button
                    type="button"
                    className="cafe-switch-btn"
                    onClick={() => handleSwitch('signup')}
                  >
                    Sign up
                  </button>
                </div>
              </form>
            ) : (
              <form className="cafe-modal-form" onSubmit={handleSubmit}>
                <div className="cafe-form-group">
                  <label htmlFor="signup-username" className="cafe-form-label">Username *</label>
                  <input
                    id="signup-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="cafe-form-input"
                    autoComplete="username"
                  />
                  <span className="cafe-form-helper">Must be unique.</span>
                </div>

                <div className="cafe-form-group">
                  <label htmlFor="signup-password" className="cafe-form-label">Password *</label>
                  <input
                    id="signup-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cafe-form-input"
                    autoComplete="new-password"
                  />
                  <span className="cafe-form-helper">
                    At least 8 characters, with a number and a special character (like ! @ # $ %).
                  </span>
                </div>

                <div className="cafe-form-group">
                  <label htmlFor="signup-confirm-password" className="cafe-form-label">Confirm Password *</label>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="cafe-form-input"
                    autoComplete="new-password"
                  />
                </div>

                <button type="submit" className="cafe-modal-btn">
                  Sign up
                </button>

                <div className="cafe-modal-footer">
                  Already have an account?
                  <button
                    type="button"
                    className="cafe-switch-btn"
                    onClick={() => handleSwitch('login')}
                  >
                    Log in
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthModal;
