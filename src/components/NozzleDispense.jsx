const OUTLINE_COLOR = "#5F5F5F";

// In coffee machine.svg (viewBox="0 0 584 709"):
// The nozzle spout bottom edge (y = 372 + 6px stroke) is at y = 378, centered at x = 291.
// Stopping the dispense channel just inside each cup's top rim ensures ingredients
// enter the cup and never reach or poke out the bottom of the cup.
const CUP_CHANNEL_HEIGHTS = {
  L: 58,       // y = 378 .. 436
  M: 77,       // y = 378 .. 455
  S: 95,       // y = 378 .. 473
  teacup: 124, // y = 378 .. 502
};

const STREAM_COLORS = {
  "hot-water": {
    main: "#BCE6FF",
    shade: "#8ED0F9",
    highlight: "#E8F6FF",
  },
  "cold-water": {
    main: "#6EC1EE",
    shade: "#4DA8DA",
    highlight: "#BCE6FF",
  },
  milk: {
    main: "#FFFFFF",
    shade: "#DCE8F5",
    highlight: "#F5FAFF",
  },
  "coffee-bean": {
    main: "#6C4831",
    shade: "#4E3220",
    highlight: "#A66A3E",
  },
  cream: {
    main: "#FFFDF9",
    shade: "#F7B7C8",
    highlight: "#FFFFFF",
  },
  "latte-design": {
    main: "#D8B58E",
    shade: "#8B5A3C",
    highlight: "#F6E7D0",
  },
};

export const nozzleDispenseStyles = `
/* ==========================================================================
   Nozzle Ingredient Dispensing Animation (Strictly Between Nozzle & Cup Rim)
   ========================================================================== */

.coffee-machine-dispense-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  overflow: hidden;
}

@keyframes nozzleStreamSlideDown {
  0% {
    transform: translateY(-140px);
  }
  28% {
    transform: translateY(0px);
  }
  72% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(140px);
  }
}

@keyframes nozzleCubeDrop {
  0% {
    transform: translateY(-32px);
  }
  100% {
    transform: translateY(135px);
  }
}

.nozzle-stream-mover {
  animation: nozzleStreamSlideDown 0.9s cubic-bezier(0.3, 0, 0.3, 1) forwards;
}

.nozzle-cube-1 {
  animation: nozzleCubeDrop 0.48s ease-in 0s both;
}

.nozzle-cube-2 {
  animation: nozzleCubeDrop 0.48s ease-in 0.16s both;
}

.nozzle-cube-3 {
  animation: nozzleCubeDrop 0.48s ease-in 0.32s both;
}
`;

function LiquidStream({ colors }) {
  return (
    <g className="nozzle-stream-mover">
      <defs>
        <clipPath id="clip-liquid-bar">
          <rect x="279" y="376" width="24" height="134" rx="12" />
        </clipPath>
      </defs>

      <g clipPath="url(#clip-liquid-bar)">
        <rect x="279" y="376" width="24" height="134" fill={colors.main} />
        <rect x="294" y="376" width="9" height="134" fill={colors.shade} />
        <rect x="283" y="388" width="4" height="110" rx="2" fill={colors.highlight} />
      </g>

      <rect
        x="279"
        y="376"
        width="24"
        height="134"
        rx="12"
        stroke={OUTLINE_COLOR}
        strokeWidth="3"
      />
    </g>
  );
}

function FallingIceCube({ x, className }) {
  return (
    <g className={className}>
      <rect
        x={x}
        y="378"
        width="26"
        height="26"
        rx="5"
        fill="#D4F3F7"
        stroke={OUTLINE_COLOR}
        strokeWidth="3"
      />
      <rect
        x={x + 6}
        y="384"
        width="6"
        height="6"
        rx="1"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
    </g>
  );
}

function FallingSugarCube({ x, className }) {
  return (
    <g className={className}>
      <rect
        x={x}
        y="378"
        width="22"
        height="22"
        rx="4"
        fill="#FFFFFF"
      />
      <path
        d={`M ${x + 14} 380 H ${x + 20} V 398 H ${x + 2} V 392 H ${x + 14} Z`}
        fill="#EADBC4"
      />
      <rect
        x={x}
        y="378"
        width="22"
        height="22"
        rx="4"
        stroke={OUTLINE_COLOR}
        strokeWidth="3"
      />
    </g>
  );
}

function NozzleDispense({ dispenseEvent }) {
  if (!dispenseEvent || !dispenseEvent.cupType) return null;

  const { id, ingredient, cupType } = dispenseEvent;
  const channelHeight = CUP_CHANNEL_HEIGHTS[cupType] || 95;

  return (
    <g key={id} aria-label={`Dispensing ${ingredient}`}>
      <defs>
        {/* Clips strictly between the nozzle spout (y = 378) and just inside the top rim of the selected cup */}
        <clipPath id="clip-nozzle-vertical-channel">
          <rect x="268" y="378" width="46" height={channelHeight} />
        </clipPath>
      </defs>

      <g clipPath="url(#clip-nozzle-vertical-channel)">
        {ingredient === "ice" ? (
          <>
            <FallingIceCube x={278} className="nozzle-cube-1" />
            <FallingIceCube x={280} className="nozzle-cube-2" />
            <FallingIceCube x={277} className="nozzle-cube-3" />
          </>
        ) : ingredient === "sugar" ? (
          <>
            <FallingSugarCube x={280} className="nozzle-cube-1" />
            <FallingSugarCube x={282} className="nozzle-cube-2" />
            <FallingSugarCube x={279} className="nozzle-cube-3" />
          </>
        ) : (
          <LiquidStream colors={STREAM_COLORS[ingredient] || STREAM_COLORS["coffee-bean"]} />
        )}
      </g>
    </g>
  );
}

export default NozzleDispense;
