import PaperCupStack from './PaperCupStack';
import Teacup from './Teacup';

const cupShelfStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');

.cup-shelf {
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
  z-index: 15;
}

.cup-stack-btn,
.teacup-btn {
  position: absolute;
  bottom: calc((1024 - 948) / 1024 * 100%);
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  pointer-events: auto;
  transform-origin: bottom center;
  transition: transform 0.14s ease, filter 0.14s ease;
}

.cup-stack-btn img,
.cup-stack-btn svg,
.teacup-btn img,
.teacup-btn svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
  pointer-events: none;
  user-select: none;
}

.cup-stack-btn:hover,
.teacup-btn:hover {
  transform: translateY(-3px) scale(1.02);
  filter: brightness(1.04);
}

.cup-stack-btn:active,
.teacup-btn:active {
  transform: translateY(2px) scale(0.97);
  filter: brightness(0.96);
}

.cup-stack-s {
  left: calc(716 / 1440 * 100%);
  width: calc(130 / 1440 * 100%);
  aspect-ratio: 103 / 141;
}

.cup-stack-m {
  left: calc(872 / 1440 * 100%);
  width: calc(130 / 1440 * 100%);
  aspect-ratio: 103 / 157;
}

.cup-stack-l {
  left: calc(1028 / 1440 * 100%);
  width: calc(130 / 1440 * 100%);
  aspect-ratio: 103 / 174;
}

.teacup-btn {
  left: calc(1182 / 1440 * 100%);
  width: calc(232 / 1440 * 100%);
  aspect-ratio: 201 / 107;
}
`;

function CupShelf({ onSelectCup }) {
  return (
    <>
      <style>{cupShelfStyles}</style>

      <div className="cup-shelf" aria-label="Cup Storage Shelf">
        <PaperCupStack size="S" onClick={onSelectCup} />
        <PaperCupStack size="M" onClick={onSelectCup} />
        <PaperCupStack size="L" onClick={onSelectCup} />
        <Teacup onClick={onSelectCup} />
      </div>
    </>
  );
}

export default CupShelf;
