const serveButtonStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&display=swap');

.serve-btn {
  position: absolute;
  left: calc(460 / 1440 * 100%);
  bottom: calc((1024 - 616) / 1024 * 100%);
  width: calc(185 / 1440 * 100%);
  aspect-ratio: 185 / 72;
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
  border-width: 2.2cqw 2.2cqw 4.8cqw 2.2cqw;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 19cqw;
  line-height: 1;
  letter-spacing: 1.5px;
  color: #FFFFFF;
  paint-order: stroke fill;
  -webkit-text-stroke: 2cqw #361E10;
  text-shadow:
    -0.5cqw -0.5cqw 0 #361E10,
     0.5cqw -0.5cqw 0 #361E10,
  -0.5cqw  0.5cqw 0 #361E10,
   0.5cqw  0.5cqw 0 #361E10,
   0 0.8cqw 1cqw rgba(0, 0, 0, 0.35);
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
