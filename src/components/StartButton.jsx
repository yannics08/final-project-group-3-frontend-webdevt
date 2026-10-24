const startButtonStyles = `
/* Fonts (Poor Story for START, Inter for DAY) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&family=Poor+Story&display=swap');

/* ==========================================================================
   Start Button Styles
   Every size is "cqw" = 1% of the button's own width (269px in the design),
   so the whole button scales together with the game screen.
   Formula: design pixels / 269 * 100
   ========================================================================== */

/* Outer wrapper: positioned like in the design (1126, 867 on a 1440 x 1024 screen) */
.start-btn {
  position: absolute;
  left: calc(1126 / 1440 * 100%);
  top: calc(867 / 1024 * 100%);
  width: calc(269 / 1440 * 100%);
  aspect-ratio: 269 / 107;
  z-index: 20;

  /* Lets the children use cqw units relative to this button */
  container-type: inline-size;

  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  transition: transform 0.15s ease, filter 0.15s ease;
}

/* The green body with the dark brown border (thicker at the bottom) */
.start-btn-face {
  display: block;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #9CAF37;
  border-style: solid;
  border-color: #361E10;
  border-width: 1.86cqw 1.86cqw 4.09cqw 1.86cqw;
  border-radius: 9.29cqw;
  box-shadow: 0 0 1.49cqw rgba(0, 0, 0, 0.25);
}

/* Light green inner outline */
.start-btn-outline {
  position: absolute;
  box-sizing: border-box;
  left: 1.86cqw;
  top: 1.86cqw;
  width: 92.57cqw;
  height: 31.22cqw;
  border: 1.49cqw solid #D9EB7C;
  border-radius: 5.58cqw;
}

/* Glossy white strip at the top */
.start-btn-shine {
  position: absolute;
  left: 2.23cqw;
  top: 0.37cqw;
  width: 91.82cqw;
  height: 10.04cqw;
  background: rgba(255, 255, 255, 0.19);
  border-radius: 5.02cqw;
}

/* Shared text settings: white letters with a dark brown outline */
.start-btn-text {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  color: #FFFFFF;
  font-style: normal;
  /* Draw the outline behind the white fill so it only shows on the outside */
  paint-order: stroke fill;
  -webkit-text-stroke-color: #361E10;
}

.start-btn-title {
  top: 2.6cqw;
  font-family: 'Poor Story', 'Comic Sans MS', cursive;
  font-weight: 400;
  font-size: 18.59cqw;
  line-height: 23.05cqw;
  -webkit-text-stroke-width: 2.2cqw;
}

.start-btn-day {
  top: 18.59cqw;
  font-family: 'Inter', Arial, sans-serif;
  font-weight: 700;
  font-size: 6.69cqw;
  line-height: 14.87cqw;
  -webkit-text-stroke-width: 1.49cqw;
}

/* Hover: lift up and brighten slightly */
.start-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
}

/* Pressed: push down */
.start-btn:active {
  transform: translateY(3px);
  filter: brightness(0.95);
}
`;

function StartButton({ day, onClick }) {
  return (
    <>
      <style>{startButtonStyles}</style>

      <button
        type="button"
        className="start-btn"
        onClick={onClick}
        aria-label={`Start Day ${day}`}
      >
        <span className="start-btn-face">
          <span className="start-btn-outline" />
          <span className="start-btn-shine" />
          <span className="start-btn-text start-btn-title">START</span>
          <span className="start-btn-text start-btn-day">DAY {day}</span>
        </span>
      </button>
    </>
  );
}

export default StartButton;