const serveButtonStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poor+Story&display=swap');

.serve-btn {
  position: absolute;
  left: calc(480 / 1440 * 100%);
  top: calc(628 / 1024 * 100%);
  width: calc(200 / 1440 * 100%);
  aspect-ratio: 200 / 80;
  z-index: 20;
  container-type: inline-size;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.serve-btn-face {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #9CAF37;
  border-style: solid;
  border-color: #361E10;
  border-width: 2cqw 2cqw 4.5cqw 2cqw;
  border-radius: 10cqw;
  box-shadow: 0 0 1.5cqw rgba(0, 0, 0, 0.25);
  font-family: 'Poor Story', 'Comic Sans MS', cursive;
  font-size: 18cqw;
  line-height: 1;
  color: #FFFFFF;
  paint-order: stroke fill;
  -webkit-text-stroke: 1.8cqw #361E10;
}

.serve-btn:not(:disabled):hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
}

.serve-btn:not(:disabled):active {
  transform: translateY(3px);
  filter: brightness(0.95);
}

.serve-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  filter: grayscale(0.6);
}
`;

function ServeButton({ onClick, disabled }) {
  return (
    <>
      <style>{serveButtonStyles}</style>

      <button
        type="button"
        className="serve-btn"
        onClick={onClick}
        disabled={disabled}
        aria-label="Serve the drink"
        title={disabled ? 'Select a cup first' : 'Serve the drink'}
      >
        <span className="serve-btn-face">SERVE</span>
      </button>
    </>
  );
}

export default ServeButton;