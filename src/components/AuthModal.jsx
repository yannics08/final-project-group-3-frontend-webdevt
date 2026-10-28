import { useState, useEffect } from 'react';
import closeButtonSvg from '../assets/close button.svg';
import showPasswordSvg from '../assets/show password.svg';
import hidePasswordSvg from '../assets/hide password.svg';

const USERS_STORAGE_KEY = 'madcoffee_users';
const CURRENT_USER_STORAGE_KEY = 'madcoffee_current_user';

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

.cafe-password-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
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

.cafe-password-wrapper .cafe-form-input {
  padding-right: 44px;
}

.cafe-form-input:focus {
  border-color: #B97C49;
  box-shadow: 0 0 0 3px rgba(185, 124, 73, 0.3);
}

.cafe-password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  transition: opacity 0.15s ease, transform 0.15s ease;
  outline: none;
}

.cafe-password-toggle:hover {
  opacity: 1;
}

.cafe-password-toggle img {
  width: 22px;
  height: auto;
  display: block;
  pointer-events: none;
  user-select: none;
}

.cafe-form-helper {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-size: 11.5px;
  line-height: 1.35;
  color: #361E10;
  margin-top: 4px;
}

.cafe-form-error {
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: #B93829;
  text-align: center;
  margin-top: 2px;
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

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
}

function AuthModal({ mode = 'login', onClose, onSwitchMode, onSuccess }) {
  const [internalMode, setInternalMode] = useState(mode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setErrorMessage('Please enter a username.');
      return;
    }

    const users = getStoredUsers();

    if (isLogin) {
      const matchedUser = users.find(
        (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase() && u.password === password
      );

      if (!matchedUser) {
        setErrorMessage('Invalid username or password.');
        return;
      }

      const sessionUser = {
        username: matchedUser.username,
        points: matchedUser.points ?? 0,
        day: matchedUser.day ?? 0,
      };
      saveCurrentUser(sessionUser);

      if (onSuccess) {
        onSuccess(sessionUser);
      }
      onClose();
      return;
    }

    const usernameExists = users.some(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );
    if (usernameExists) {
      setErrorMessage('Username is already taken.');
      return;
    }

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (!hasMinLength || !hasNumber || !hasSpecialChar) {
      setErrorMessage('Password must be at least 8 characters with a number and special character.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const updatedUsers = [...users, { username: trimmedUsername, password, points: 0, day: 0 }];
    saveStoredUsers(updatedUsers);

    const sessionUser = { username: trimmedUsername, points: 0, day: 0 };
    saveCurrentUser(sessionUser);

    if (onSuccess) {
      onSuccess(sessionUser);
    }
    onClose();
  };

  const handleSwitch = (newMode) => {
    setInternalMode(newMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMessage('');
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
                  <label htmlFor="login-username" className="cafe-form-label">Username</label>
                  <input
                    id="login-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="cafe-form-input"
                    autoComplete="username"
                  />
                </div>

                <div className="cafe-form-group">
                  <label htmlFor="login-password" className="cafe-form-label">Password</label>
                  <div className="cafe-password-wrapper">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="cafe-form-input"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="cafe-password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <img
                        src={showPassword ? showPasswordSvg : hidePasswordSvg}
                        alt=""
                        draggable="false"
                      />
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="cafe-form-error" role="alert">
                    {errorMessage}
                  </div>
                )}

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
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="cafe-form-input"
                    autoComplete="username"
                  />
                  <span className="cafe-form-helper">Must be unique.</span>
                </div>

                <div className="cafe-form-group">
                  <label htmlFor="signup-password" className="cafe-form-label">Password *</label>
                  <div className="cafe-password-wrapper">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="cafe-form-input"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="cafe-password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <img
                        src={showPassword ? showPasswordSvg : hidePasswordSvg}
                        alt=""
                        draggable="false"
                      />
                    </button>
                  </div>
                  <span className="cafe-form-helper">
                    At least 8 characters, with a number and a special character (like ! @ # $ %).
                  </span>
                </div>

                <div className="cafe-form-group">
                  <label htmlFor="signup-confirm-password" className="cafe-form-label">Confirm Password *</label>
                  <div className="cafe-password-wrapper">
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="cafe-form-input"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="cafe-password-toggle"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <img
                        src={showConfirmPassword ? showPasswordSvg : hidePasswordSvg}
                        alt=""
                        draggable="false"
                      />
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="cafe-form-error" role="alert">
                    {errorMessage}
                  </div>
                )}

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
