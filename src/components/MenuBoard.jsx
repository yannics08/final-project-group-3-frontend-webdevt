import loginButtonSvg from '../assets/log in button.svg';
import signupButtonSvg from '../assets/sign up button.svg';

const menuBoardStyles = `
.menu-board-actions {
  box-sizing: border-box;
  position: absolute;
  left: calc(1169 / 1440 * 100%);
  top: calc(666 / 1024 * 100%);
  width: calc(175 / 1440 * 100%);
  display: flex;
  flex-direction: column;
  gap: 0;            
  z-index: 20;
}

.menu-board-btn + .menu-board-btn {
  margin-top: calc(12 / 175 * 100%);
}

.menu-board-btn {
  box-sizing: border-box;
  width: 100%;
  aspect-ratio: 175 / 61;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  display: block;
  user-select: none;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.menu-board-btn img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.menu-board-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
}

.menu-board-btn:active {
  transform: translateY(2px) scale(0.98);
  filter: brightness(0.95);
}

.menu-board-btn:focus-visible {
  outline: 2px solid #F3E0BE;
  outline-offset: 3px;
  border-radius: 14px;
}
`;

function MenuBoard({ onLogin, onSignup }) {
  return (
    <>
      <style>{menuBoardStyles}</style>
      <nav className="menu-board-actions" aria-label="Account Access">
        <button
          type="button"
          className="menu-board-btn"
          onClick={onLogin}
          aria-label="Log In"
          title="Log In"
        >
          <img src={loginButtonSvg} alt="Log In" draggable="false" />
        </button>

        <button
          type="button"
          className="menu-board-btn"
          onClick={onSignup}
          aria-label="Sign Up"
          title="Sign Up"
        >
          <img src={signupButtonSvg} alt="Sign Up" draggable="false" />
        </button>
      </nav>
    </>
  );
}

export default MenuBoard;
