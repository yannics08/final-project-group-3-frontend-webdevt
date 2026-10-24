import smallCupStackSvg from '../assets/small cup stack.svg';
import mediumCupStackSvg from '../assets/medium cups.svg';
import largeCupStackSvg from '../assets/large cup stack.svg';

const CUP_STACK_ASSETS = {
  S: {
    label: "Small Cup",
    src: smallCupStackSvg,
  },
  M: {
    label: "Medium Cup",
    src: mediumCupStackSvg,
  },
  L: {
    label: "Large Cup",
    src: largeCupStackSvg,
  },
};

function PaperCupStack({ size = "L", className = "", style, onClick }) {
  const cfg = CUP_STACK_ASSETS[size] || CUP_STACK_ASSETS.L;

  return (
    <button
      type="button"
      className={`cup-stack-btn cup-stack-${size.toLowerCase()} ${className}`}
      style={style}
      onClick={() => onClick && onClick(size)}
      aria-label={cfg.label}
      title={cfg.label}
    >
      <img src={cfg.src} alt="" draggable="false" />
    </button>
  );
}

export default PaperCupStack;
