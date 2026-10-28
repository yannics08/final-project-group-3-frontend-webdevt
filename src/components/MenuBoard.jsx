import loginButtonSvg from '../assets/log in button.svg';
import signupButtonSvg from '../assets/sign up button.svg';
import menuBoardAlrUserSvg from '../assets/menu board (alr user).svg';
import menuBoardNewUserSvg from '../assets/menu board (new user).svg';
import adminMenuBoardSvg from '../assets/admin menu board.svg';
import dashboardButtonSvg from '../assets/dashboard button.svg';
import adminLeaderboardButtonSvg from '../assets/leaderboard button (admin).svg';

const menuBoardStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&family=Nunito:wght@600;700;800&display=swap');

.menu-board-user-bg {
  position: absolute;
  left: calc(1117 / 1440 * 100%);
  top: calc(567 / 1024 * 100%);
  width: calc(280 / 1440 * 100%);
  height: calc(239 / 1024 * 100%);
  z-index: 15;
  pointer-events: none;
  user-select: none;
  display: block;
}

.menu-board-guest-bg {
  position: absolute;
  left: calc(1117 / 1440 * 100%);
  top: calc(567 / 1024 * 100%);
  width: calc(280 / 1440 * 100%);
  height: calc(310 / 1024 * 100%);
  z-index: 15;
  pointer-events: none;
  user-select: none;
  display: block;
}

.menu-board-admin-bg {
  position: absolute;
  left: calc(1117 / 1440 * 100%);
  top: calc(567 / 1024 * 100%);
  width: calc(280 / 1440 * 100%);
  height: calc(304 / 1024 * 100%);
  z-index: 15;
  pointer-events: none;
  user-select: none;
  display: block;
}

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

.menu-board-admin-actions {
  box-sizing: border-box;
  position: absolute;
  left: calc(1154.5 / 1440 * 100%);
  top: calc(664 / 1024 * 100%);
  width: calc(205 / 1440 * 100%);
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 20;
}

.menu-board-btn + .menu-board-btn {
  margin-top: calc(12 / 175 * 100%);
}

.menu-board-admin-btn + .menu-board-admin-btn {
  margin-top: calc(18 / 205 * 100%);
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

.menu-board-admin-btn {
  box-sizing: border-box;
  width: 100%;
  aspect-ratio: 205 / 61;
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

.menu-board-btn img,
.menu-board-admin-btn img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.menu-board-btn:hover,
.menu-board-admin-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
}

.menu-board-btn:active,
.menu-board-admin-btn:active {
  transform: translateY(2px) scale(0.98);
  filter: brightness(0.95);
}

.menu-board-btn:focus-visible,
.menu-board-admin-btn:focus-visible {
  outline: 2px solid #F3E0BE;
  outline-offset: 3px;
  border-radius: 14px;
}

.menu-board-stats {
  box-sizing: border-box;
  position: absolute;
  left: calc(1140 / 1440 * 100%);
  top: calc(650 / 1024 * 100%);
  width: calc(234 / 1440 * 100%);
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 20;
  pointer-events: none;
  user-select: none;
}

.menu-board-stat-row {
  margin: 0;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 7.5cqw;
  line-height: 1.2;
  color: #F3E0BE;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-board-stat-row + .menu-board-stat-row {
  margin-top: 7.5cqw;
}
`;

function MenuBoard({ user, onLogin, onSignup, onOpenDashboard, onOpenLeaderboard }) {
  const isAdmin = Boolean(user && (user.isAdmin || user.username?.toLowerCase() === 'admin'));

  if (isAdmin) {
    return (
      <>
        <style>{menuBoardStyles}</style>
        <img
          className="menu-board-admin-bg"
          src={adminMenuBoardSvg}
          alt=""
          draggable="false"
        />

        <nav className="menu-board-admin-actions" aria-label="Admin Actions">
          <button
            type="button"
            className="menu-board-admin-btn"
            onClick={onOpenDashboard}
            aria-label="Dashboard"
            title="Dashboard"
          >
            <img src={dashboardButtonSvg} alt="Dashboard" draggable="false" />
          </button>

          <button
            type="button"
            className="menu-board-admin-btn"
            onClick={onOpenLeaderboard}
            aria-label="Leaderboard"
            title="Leaderboard"
          >
            <img src={adminLeaderboardButtonSvg} alt="Leaderboard" draggable="false" />
          </button>
        </nav>
      </>
    );
  }

  if (user) {
    const hasPoints = typeof user.points === 'number' && user.points > 0;
    const pointsDisplay = hasPoints ? ` ${user.points}` : '';
    const rankingDisplay = hasPoints && user.ranking ? ` #${user.ranking}` : '';

    return (
      <>
        <style>{menuBoardStyles}</style>
        <img
          className="menu-board-user-bg"
          src={menuBoardAlrUserSvg}
          alt=""
          draggable="false"
        />
        <div className="menu-board-stats" aria-label="Player Menu Board">
          <p className="menu-board-stat-row">Username: {user.username}</p>
          <p className="menu-board-stat-row">Points Achieved:{pointsDisplay}</p>
          <p className="menu-board-stat-row">Ranking:{rankingDisplay}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{menuBoardStyles}</style>
      <img
        className="menu-board-guest-bg"
        src={menuBoardNewUserSvg}
        alt=""
        draggable="false"
      />

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
