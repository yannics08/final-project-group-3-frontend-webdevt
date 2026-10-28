import loginButtonSvg from '../assets/log in button.svg';
import signupButtonSvg from '../assets/sign up button.svg';

const menuBoardStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&family=Nunito:wght@600;700;800&display=swap');

.menu-board-guest-bg {
  position: absolute;
  left: calc(1117 / 1440 * 100%);
  top: calc(567 / 1024 * 100%);
  width: calc(280 / 1440 * 100%);
  height: calc(309 / 1024 * 100%);
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

.menu-board-stats {
  box-sizing: border-box;
  position: absolute;
  left: calc(1142 / 1440 * 100%);
  top: calc(654 / 1024 * 100%);
  width: calc(230 / 1440 * 100%);
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
  font-size: 6.4cqw;
  line-height: 1.25;
  color: #F3E0BE;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-board-stat-row + .menu-board-stat-row {
  margin-top: 8.5cqw;
}
`;

function MenuBoard({ user, onLogin, onSignup }) {
  if (user) {
    const hasPoints = typeof user.points === 'number' && user.points > 0;
    const pointsDisplay = hasPoints ? ` ${user.points}` : '';
    const rankingDisplay = hasPoints && user.ranking ? ` #${user.ranking}` : '';

    return (
      <>
        <style>{menuBoardStyles}</style>
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
      <svg
        className="menu-board-guest-bg"
        viewBox="1117 567 280 309"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#guest_board_outer)">
          <rect x="1117" y="567" width="280" height="309" rx="10" fill="#C48B56" />
        </g>
        <rect x="1119.5" y="569.5" width="275" height="304" rx="7.5" stroke="#361E10" strokeWidth="5" />
        <g filter="url(#guest_board_inner)">
          <rect x="1130" y="580" width="254" height="283" rx="5" fill="#3E5C4B" />
        </g>
        <rect x="1132.5" y="582.5" width="249" height="278" rx="2.5" stroke="#361E10" strokeWidth="5" />
        <use href="#guest_menu_title_path" fill="#F3E0BE" />
        <mask id="guest_menu_title_mask" maskUnits="userSpaceOnUse" x="1218" y="608" width="85" height="26" fill="black">
          <rect fill="white" x="1218" y="608" width="85" height="26" />
          <use href="#guest_menu_title_path" />
        </mask>
        <use
          href="#guest_menu_title_path"
          stroke="#361E10"
          strokeWidth="4"
          mask="url(#guest_menu_title_mask)"
        />
        <defs>
          <filter id="guest_board_outer" x="1117" y="567" width="280" height="309" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="13" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.835294 0 0 0 0 0.631373 0 0 0 0 0.427451 0 0 0 1 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          </filter>
          <filter id="guest_board_inner" x="1130" y="580" width="254" height="283" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dx="-19" dy="4" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          </filter>
          <path
            id="guest_menu_title_path"
            d="M1242.13 611.26C1242.28 611.54 1242.37 611.792 1242.38 612.016C1242.42 612.24 1242.44 612.567 1242.44 612.996V628.536C1242.44 629.824 1242.09 630.58 1241.38 630.804C1241.02 630.916 1240.57 630.972 1240.03 630.972C1239.49 630.972 1239.06 630.925 1238.74 630.832C1238.43 630.739 1238.18 630.627 1238.02 630.496C1237.85 630.365 1237.72 630.179 1237.62 629.936C1237.53 629.619 1237.48 629.133 1237.48 628.48V619.1C1237.02 619.679 1236.34 620.603 1235.44 621.872C1234.54 623.123 1233.98 623.907 1233.73 624.224C1233.49 624.541 1233.32 624.765 1233.23 624.896C1233.14 625.008 1232.9 625.176 1232.53 625.4C1232.17 625.605 1231.78 625.708 1231.35 625.708C1230.94 625.708 1230.56 625.615 1230.2 625.428C1229.87 625.223 1229.63 625.027 1229.48 624.84L1229.25 624.532C1228.88 624.065 1228.14 623.076 1227.04 621.564C1225.94 620.033 1225.34 619.212 1225.25 619.1V628.536C1225.25 628.965 1225.23 629.292 1225.19 629.516C1225.17 629.721 1225.09 629.955 1224.94 630.216C1224.66 630.72 1223.93 630.972 1222.76 630.972C1221.62 630.972 1220.91 630.72 1220.63 630.216C1220.48 629.955 1220.39 629.712 1220.35 629.488C1220.33 629.264 1220.32 628.928 1220.32 628.48V612.94C1220.32 612.511 1220.33 612.193 1220.35 611.988C1220.39 611.764 1220.48 611.512 1220.63 611.232C1220.91 610.747 1221.64 610.504 1222.81 610.504C1223.32 610.504 1223.75 610.569 1224.1 610.7C1224.47 610.812 1224.72 610.933 1224.83 611.064L1225 611.232L1231.35 619.576C1234.53 615.376 1236.64 612.604 1237.71 611.26C1238.03 610.756 1238.77 610.504 1239.95 610.504C1241.14 610.504 1241.87 610.756 1242.13 611.26ZM1249.64 626.044H1258.26C1258.69 626.044 1259.01 626.063 1259.22 626.1C1259.44 626.119 1259.69 626.203 1259.97 626.352C1260.48 626.613 1260.73 627.341 1260.73 628.536C1260.73 629.843 1260.38 630.608 1259.69 630.832C1259.37 630.944 1258.89 631 1258.24 631H1247.15C1245.84 631 1245.08 630.645 1244.85 629.936C1244.74 629.637 1244.68 629.161 1244.68 628.508V612.94C1244.68 611.988 1244.86 611.344 1245.22 611.008C1245.57 610.653 1246.24 610.476 1247.23 610.476H1258.26C1258.69 610.476 1259.01 610.495 1259.22 610.532C1259.44 610.551 1259.69 610.635 1259.97 610.784C1260.48 611.045 1260.73 611.773 1260.73 612.968C1260.73 614.275 1260.38 615.04 1259.69 615.264C1259.37 615.376 1258.89 615.432 1258.24 615.432H1249.64V618.26H1255.18C1255.61 618.26 1255.93 618.279 1256.14 618.316C1256.36 618.335 1256.61 618.419 1256.89 618.568C1257.4 618.829 1257.65 619.557 1257.65 620.752C1257.65 622.059 1257.29 622.824 1256.58 623.048C1256.27 623.16 1255.78 623.216 1255.13 623.216H1249.64V626.044ZM1275.78 611.344C1275.97 611.008 1276.24 610.784 1276.6 610.672C1276.95 610.56 1277.39 610.504 1277.91 610.504C1278.45 610.504 1278.88 610.551 1279.2 610.644C1279.54 610.737 1279.78 610.849 1279.93 610.98C1280.1 611.111 1280.22 611.307 1280.29 611.568C1280.4 611.867 1280.46 612.343 1280.46 612.996V628.536C1280.46 628.984 1280.44 629.311 1280.4 629.516C1280.38 629.721 1280.3 629.964 1280.15 630.244C1279.89 630.748 1279.16 631 1277.97 631C1277.24 631 1276.74 630.944 1276.46 630.832C1276.18 630.72 1275.94 630.543 1275.76 630.3C1271.56 624.7 1268.79 621.041 1267.47 619.324V628.536C1267.47 628.984 1267.45 629.311 1267.41 629.516C1267.39 629.721 1267.31 629.964 1267.16 630.244C1266.9 630.748 1266.17 631 1264.98 631C1263.82 631 1263.11 630.748 1262.85 630.244C1262.7 629.964 1262.6 629.712 1262.57 629.488C1262.55 629.264 1262.54 628.937 1262.54 628.508V612.884C1262.54 612.175 1262.62 611.661 1262.79 611.344C1262.98 611.008 1263.25 610.784 1263.6 610.672C1263.96 610.56 1264.42 610.504 1264.98 610.504C1265.54 610.504 1265.97 610.56 1266.29 610.672C1266.63 610.765 1266.86 610.877 1266.99 611.008C1267.07 611.064 1267.28 611.307 1267.64 611.736C1271.57 617.093 1274.21 620.631 1275.53 622.348V612.884C1275.53 612.175 1275.62 611.661 1275.78 611.344ZM1296.1 611.232C1296.29 610.933 1296.56 610.728 1296.92 610.616C1297.27 610.504 1297.71 610.448 1298.23 610.448C1298.77 610.448 1299.2 610.495 1299.52 610.588C1299.84 610.681 1300.08 610.793 1300.25 610.924C1300.42 611.055 1300.54 611.251 1300.61 611.512C1300.72 611.829 1300.78 612.315 1300.78 612.968V621.424C1300.78 623.888 1300.01 626.128 1298.48 628.144C1297.74 629.096 1296.78 629.871 1295.6 630.468C1294.42 631.047 1293.12 631.336 1291.68 631.336C1290.26 631.336 1288.96 631.037 1287.79 630.44C1286.63 629.843 1285.69 629.059 1284.96 628.088C1283.45 626.109 1282.69 623.869 1282.69 621.368V612.94C1282.69 612.492 1282.7 612.165 1282.72 611.96C1282.76 611.736 1282.85 611.484 1283 611.204C1283.15 610.924 1283.4 610.728 1283.76 610.616C1284.11 610.504 1284.59 610.448 1285.18 610.448C1285.78 610.448 1286.26 610.504 1286.61 610.616C1286.97 610.728 1287.21 610.924 1287.34 611.204C1287.56 611.633 1287.68 612.221 1287.68 612.968V621.368C1287.68 622.507 1287.96 623.589 1288.52 624.616C1288.8 625.139 1289.22 625.559 1289.78 625.876C1290.34 626.193 1291 626.352 1291.76 626.352C1293.13 626.352 1294.14 625.848 1294.82 624.84C1295.49 623.832 1295.82 622.665 1295.82 621.34V612.772C1295.82 612.044 1295.92 611.531 1296.1 611.232Z"
          />
        </defs>
      </svg>

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
