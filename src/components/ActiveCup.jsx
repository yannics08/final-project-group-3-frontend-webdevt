import smallCupSvg from '../assets/small cup.svg';
import mediumCupSvg from '../assets/medium cup.svg';
import largeCupSvg from '../assets/large cup.svg';
import teacupSvg from '../assets/teacup.svg';

const ACTIVE_CUP_ASSETS = {
  S: {
    label: "Selected Small Cup",
    src: smallCupSvg,
  },
  M: {
    label: "Selected Medium Cup",
    src: mediumCupSvg,
  },
  L: {
    label: "Selected Large Cup",
    src: largeCupSvg,
  },
  teacup: {
    label: "Selected Teacup",
    src: teacupSvg,
  },
};

const activeCupStyles = `
.active-cup-slot {
  position: absolute;
  left: calc(1003 / 1440 * 100%);
  bottom: calc((1024 - 584) / 1024 * 100%);
  transform: translateX(-50%);
  z-index: 25;
  pointer-events: none;
  user-select: none;
  animation: placeCupUnderNozzle 0.22s cubic-bezier(0.34, 1.35, 0.64, 1);
  transform-origin: bottom center;
}

@keyframes placeCupUnderNozzle {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(18px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

.active-cup-slot.is-paper-cup {
  width: calc(112 / 1440 * 100%);
}

.active-cup-slot.is-paper-cup.size-s {
  aspect-ratio: 103 / 122;
}

.active-cup-slot.is-paper-cup.size-m {
  aspect-ratio: 103 / 139;
}

.active-cup-slot.is-paper-cup.size-l {
  aspect-ratio: 103 / 155;
}

.active-cup-slot.is-teacup {
  width: calc(210 / 1440 * 100%);
  aspect-ratio: 201 / 107;
  left: calc(1014 / 1440 * 100%);
}

.active-cup-slot img,
.active-cup-slot svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
  pointer-events: none;
  user-select: none;
}
`;

function ActiveCup({ cupType }) {
  if (!cupType) return null;

  const isTeacup = cupType === "teacup";
  const cupAsset = ACTIVE_CUP_ASSETS[cupType];
  if (!cupAsset) return null;

  return (
    <>
      <style>{activeCupStyles}</style>

      <div
        key={cupType}
        className={
          isTeacup
            ? "active-cup-slot is-teacup"
            : `active-cup-slot is-paper-cup size-${cupType.toLowerCase()}`
        }
      >
        <img
          src={cupAsset.src}
          alt={cupAsset.label}
          draggable="false"
        />
      </div>
    </>
  );
}

export default ActiveCup;
