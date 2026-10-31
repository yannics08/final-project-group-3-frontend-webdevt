import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GamePaused from './GamePaused';
import pauseSvg from '../assets/pause.svg';
import latteDesignBgSvg from '../assets/latte design screen (bg).svg';
import latteTopViewSvg from '../assets/latte top view.svg';

import heartOutlineSvg from '../assets/heart latte outline.svg';
import heartDesignSvg from '../assets/heart latte design.svg';

import flowerOutlineSvg from '../assets/flower latte outline.svg';
import flowerDesignSvg from '../assets/flower latte design.svg';

import leafOutlineSvg from '../assets/leaf latte outline.svg';
import leafDesignSvg from '../assets/leaf latte design.svg';

import swanOutlineSvg from '../assets/swan latte outline.svg';
import swanDesignSvg from '../assets/swan latte design.svg';

import coffeeBeanOutlineSvg from '../assets/coffee bean latte outline.svg';
import coffeeBeanDesignSvg from '../assets/coffee bean latte design.svg';

const LATTE_DESIGNS = [
  {
    id: 'heart',
    name: 'Heart',
    outlineSrc: heartOutlineSvg,
    designSrc: heartDesignSvg,
    svgElements: [
      {
        type: 'path',
        d: 'M172.635 269C172.635 269 309.952 170.494 269.565 110.008C229.178 49.5213 187.637 82.9327 172.635 110.008C148.98 65.0749 98.2075 61.6186 72.8209 110.008C47.4344 158.397 109.558 225.805 172.635 269ZM172.635 110.008V269',
      },
    ],
  },
  {
    id: 'flower',
    name: 'Flower',
    outlineSrc: flowerOutlineSvg,
    designSrc: flowerDesignSvg,
    svgElements: [
      { type: 'ellipse', cx: 172, cy: 97.5, rx: 29, ry: 47.5 },
      { type: 'ellipse', cx: 236.652, cy: 135.325, rx: 29, ry: 47.5, transform: 'rotate(58.9933 236.652 135.325)' },
      { type: 'ellipse', cx: 29, cy: 47.5, rx: 29, ry: 47.5, transform: 'matrix(0.515139 -0.857107 -0.857107 -0.515139 262.425 258.65)' },
      { type: 'ellipse', cx: 29, cy: 47.5, rx: 29, ry: 47.5, transform: 'matrix(-0.515139 0.857107 0.857107 0.515139 80.8779 86)' },
      { type: 'ellipse', cx: 106.651, cy: 209.325, rx: 29, ry: 47.5, transform: 'rotate(-121.007 106.651 209.325)' },
      { type: 'ellipse', cx: 172, cy: 245.5, rx: 29, ry: 47.5 },
      { type: 'circle', cx: 171.5, cy: 171.5, r: 20.5 },
    ],
  },
  {
    id: 'leaf',
    name: 'Leaf',
    outlineSrc: leafOutlineSvg,
    designSrc: leafDesignSvg,
    svgElements: [
      {
        type: 'path',
        d: 'M229.467 62.2749L111.865 275.808M111.865 275.808C69.5093 196.736 86.1111 121.762 158.243 84.087C177.888 73.826 201.653 66.3317 229.467 62.2749C292.295 182.733 222.286 272.45 111.865 275.808Z',
      },
      { type: 'path', d: 'M158.888 84.8691L184.236 145.74L247.027 119.943' },
      { type: 'path', d: 'M116.092 119.943L155.032 197.336L248.974 170.565' },
      { type: 'path', d: 'M94.1876 162.29L133.128 237.249L233.653 213.628' },
    ],
  },
  {
    id: 'swan',
    name: 'Swan',
    outlineSrc: swanOutlineSvg,
    designSrc: swanDesignSvg,
    svgElements: [
      {
        type: 'path',
        d: 'M132.15 93.7749C132.15 93.7749 110.97 84.7147 98.2803 83.7236C85.5907 82.7324 129.477 60.4226 148.194 59.0519C166.912 57.6813 182.51 83.7235 174.934 102.913C167.358 122.102 158.89 168.704 178.945 173.729C199 178.755 267.631 175.557 293.034 141.748C304.621 247.744 208.804 270.131 174.934 267.847C73.4918 255.07 60.8634 232.487 105.411 176.014C108.53 144.946 140.618 115.705 132.15 93.7749Z',
      },
      { type: 'path', d: 'M151 223C187.093 210.882 214.857 210.421 270 218.162' },
    ],
  },
  {
    id: 'coffee-bean',
    name: 'Coffee Bean',
    outlineSrc: coffeeBeanOutlineSvg,
    designSrc: coffeeBeanDesignSvg,
    svgElements: [
      {
        type: 'ellipse',
        cx: 172,
        cy: 164.451,
        rx: 76.2602,
        ry: 100.993,
        transform: 'rotate(39.3377 172 164.451)',
      },
      { type: 'path', d: 'M108.047 241.204C199.065 195.843 160.177 103.882 233.904 88.7576' },
    ],
  },
];

const latteDesignStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Poppins:wght@500;600;700;800&display=swap');

/* ==========================================================================
   Latte Art Tracing Screen (1440 x 1024 Coordinate Space)
   ========================================================================== */

.latte-screen-container {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  padding: min(24px, 2vw, 2vh);
  background-color: #2b1810;
  background-image: radial-gradient(circle at 50% 30%, #3e2417 0%, #201109 100%);
  user-select: none;
}

.latte-design-screen {
  box-sizing: border-box;
  position: relative;
  width: min(1200px, 92vw, calc(90vh * 1440 / 1024));
  aspect-ratio: 1440 / 1024;
  container-type: inline-size;
  background-color: #5A3824;
  background-image: url("${latteDesignBgSvg}");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  border: min(7px, 0.53vw, 0.73vh) solid #3d2112;
  border-radius: min(14px, 1.07vw, 1.48vh);
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.65),
    0 4px 12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  animation: latteScreenFadeIn 0.2s ease-out;
}

.latte-design-screen.is-embedded {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.latte-pause-btn {
  box-sizing: border-box;
  position: absolute;
  width: calc(96 / 1440 * 100%);
  max-width: 96px;
  aspect-ratio: 100 / 117;
  right: calc(21 / 1440 * 100%);
  top: 0px;
  z-index: 30;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  user-select: none;
  transform-origin: top center;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.latte-pause-btn img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.latte-pause-btn:hover {
  transform: translateY(2px);
  filter: brightness(1.03);
}

.latte-pause-btn:active {
  transform: translateY(5px);
  filter: brightness(0.96);
}

@keyframes latteScreenFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ==========================================================================
   Left Area: Top-View Latte Cup + Outline + Tracing Layer
   ========================================================================== */

.latte-cup-stage {
  position: absolute;
  left: calc(82 / 1440 * 100%);
  top: calc(153 / 1024 * 100%);
  width: calc(781 / 1440 * 100%);
  aspect-ratio: 781 / 718;
}

.latte-cup-base-img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

/* Centered inside the cup bowl (cx = 358.5, cy = 358.5 in 781 x 718) */
.latte-outline-container {
  position: absolute;
  left: calc((358.5 - 252) / 781 * 100%);
  top: calc((358.5 - 252) / 718 * 100%);
  width: calc(504 / 781 * 100%);
  height: calc(504 / 718 * 100%);
  border-radius: 50%;
}

.latte-outline-img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.latte-trace-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
  cursor: crosshair;
  touch-action: none;
}

/* ==========================================================================
   Right Area: Expected Design Preview & Match Card
   ========================================================================== */

.latte-info-card {
  box-sizing: border-box;
  position: absolute;
  left: calc(946 / 1440 * 100%);
  top: calc(242 / 1024 * 100%);
  width: calc(444 / 1440 * 100%);
  height: calc(582 / 1024 * 100%);
  background: #F4E1C1;
  border: calc(7.5 / 1440 * 100cqw) solid #5F5F5F;
  border-radius: calc(24 / 1440 * 100cqw);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(24 / 1440 * 100cqw);
  padding: calc(28 / 1440 * 100cqw) calc(34 / 1440 * 100cqw);
  overflow: hidden;
}

.latte-preview-btn {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  width: 58%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  flex-shrink: 0;
  transition: transform 0.14s ease;
}

.latte-preview-btn:hover {
  transform: scale(1.03);
}

.latte-preview-btn:active {
  transform: scale(0.97);
}

.latte-preview-img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.latte-design-title {
  margin: calc(-6 / 1440 * 100cqw) 0 0 0;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: calc(31 / 1440 * 100cqw);
  color: #361E10;
  text-align: center;
  line-height: 1.1;
}

/* Match Progress Section */
.latte-match-section {
  width: 84%;
  display: flex;
  flex-direction: column;
  gap: calc(7 / 1440 * 100cqw);
}

.latte-match-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: calc(20 / 1440 * 100cqw);
  color: #361E10;
  line-height: 1.1;
}

.latte-match-track {
  box-sizing: border-box;
  width: 100%;
  height: calc(23 / 1440 * 100cqw);
  background: #361E10;
  border: calc(3.5 / 1440 * 100cqw) solid #361E10;
  border-radius: 999px;
  overflow: hidden;
}

.latte-match-fill {
  height: 100%;
  background: #B87B47;
  border-radius: 999px;
  transition: width 0.12s ease-out;
}

/* Done & Cancel Action Buttons */
.latte-card-actions {
  width: 84%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 9%;
  margin-top: calc(4 / 1440 * 100cqw);
}

.latte-action-btn {
  box-sizing: border-box;
  flex: 1;
  aspect-ratio: 144 / 58;
  border: calc(2.5 / 1440 * 100cqw) solid #361E10;
  border-radius: calc(12 / 1440 * 100cqw);
  padding: 0;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 600;
  font-size: calc(23 / 1440 * 100cqw);
  line-height: 1;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.latte-action-btn.is-done {
  background: #B5C665;
  color: #FFFFFF;
}

.latte-action-btn.is-cancel {
  background: #F3DEC0;
  color: #361E10;
}

.latte-action-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.04);
}

.latte-action-btn:active {
  transform: translateY(1px) scale(0.97);
  filter: brightness(0.96);
}
`;

function buildPolylinePoints(stroke) {
  return stroke.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
}

function LatteDesign({ isOpen = true, onDone, onServe, onCancel, initialDesignIndex = 0, lockedDesign = null, onPause = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isStandaloneScreen = location.pathname === '/latte-design' && !onDone && !onServe && !onCancel;

  // If a design is locked, start on it. Otherwise use the start index.
  const lockedIndex = LATTE_DESIGNS.findIndex((design) => design.id === lockedDesign);
  const [designIndex, setDesignIndex] = useState(
    lockedIndex >= 0 ? lockedIndex : initialDesignIndex
  );
  const [strokes, setStrokes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [targetPoints, setTargetPoints] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const traceSvgRef = useRef(null);
  const measureGroupRef = useRef(null);

  const currentDesign = LATTE_DESIGNS[designIndex] || LATTE_DESIGNS[0];

  // Sample target checkpoints along the SVG shapes of the active design in 344 x 344 space
  useEffect(() => {
    if (!isOpen || !measureGroupRef.current) return;

    const shapes = measureGroupRef.current.querySelectorAll('path, ellipse, circle');
    const sampled = [];

    shapes.forEach((shape) => {
      if (typeof shape.getTotalLength !== 'function') return;
      const totalLen = shape.getTotalLength();
      if (!totalLen || totalLen <= 0) return;

      const step = Math.max(6, totalLen / 45);
      const ctm = shape.getCTM();
      const rootCtm = measureGroupRef.current.getCTM();

      for (let dist = 0; dist <= totalLen; dist += step) {
        const pt = shape.getPointAtLength(dist);
        if (ctm && rootCtm) {
          const relMatrix = rootCtm.inverse().multiply(ctm);
          const tx = pt.x * relMatrix.a + pt.y * relMatrix.c + relMatrix.e;
          const ty = pt.x * relMatrix.b + pt.y * relMatrix.d + relMatrix.f;
          sampled.push({ x: tx, y: ty });
        } else {
          sampled.push({ x: pt.x, y: pt.y });
        }
      }
    });

    setTargetPoints(sampled);
  }, [isOpen, currentDesign]);

  // Compute Match % based on how well drawn points cover and stay on the outline
  const matchPercent = useMemo(() => {
    const drawnPoints = strokes.flat();
    if (drawnPoints.length === 0 || targetPoints.length === 0) return 0;

    const hitRadiusSq = 20 * 20;
    const accuracyRadiusSq = 25 * 25;

    let coveredCount = 0;
    for (let i = 0; i < targetPoints.length; i += 1) {
      const target = targetPoints[i];
      const isCovered = drawnPoints.some((p) => {
        const dx = p.x - target.x;
        const dy = p.y - target.y;
        return dx * dx + dy * dy <= hitRadiusSq;
      });
      if (isCovered) coveredCount += 1;
    }

    let accurateCount = 0;
    for (let i = 0; i < drawnPoints.length; i += 1) {
      const p = drawnPoints[i];
      const isNearOutline = targetPoints.some((target) => {
        const dx = p.x - target.x;
        const dy = p.y - target.y;
        return dx * dx + dy * dy <= accuracyRadiusSq;
      });
      if (isNearOutline) accurateCount += 1;
    }

    const coverageRatio = coveredCount / targetPoints.length;
    const accuracyRatio = accurateCount / drawnPoints.length;

    const rawScore = coverageRatio * (0.45 + 0.55 * accuracyRatio) * 108;
    return Math.min(100, Math.max(0, Math.round(rawScore)));
  }, [strokes, targetPoints]);

  if (!isOpen) return null;

  const getSvgCoords = (clientX, clientY) => {
    const svgEl = traceSvgRef.current;
    if (!svgEl) return null;
    const rect = svgEl.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 344;
    const y = ((clientY - rect.top) / rect.height) * 344;

    // Keep drawing inside the coffee foam circle (center 172, 172, radius 150)
    const dx = x - 172;
    const dy = y - 172;
    if (dx * dx + dy * dy > 150 * 150) return null;

    return { x, y };
  };

  const handlePointerDown = (e) => {
    const pt = getSvgCoords(e.clientX, e.clientY);
    if (!pt) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setStrokes((prev) => [...prev, [pt]]);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    const pt = getSvgCoords(e.clientX, e.clientY);
    if (!pt) return;

    setStrokes((prev) => {
      if (prev.length === 0) return [[pt]];
      const currentStroke = prev[prev.length - 1];
      const lastPt = currentStroke[currentStroke.length - 1];
      const distSq = (pt.x - lastPt.x) ** 2 + (pt.y - lastPt.y) ** 2;
      if (distSq < 9) return prev;

      const updated = [...prev];
      updated[updated.length - 1] = [...currentStroke, pt];
      return updated;
    });
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleCycleDesign = () => {
    if (lockedDesign) return; // the customer asked for this design  
    setStrokes([]);
    setDesignIndex((prev) => (prev + 1) % LATTE_DESIGNS.length);
  };

  const handleDoneClick = () => {
    const result = { design: currentDesign.id, matchPercent };
    setStrokes([]);
    const callback = onDone || onServe;
    if (callback) {
      callback(result);
    } else {
      navigate('/game', {
        state: {
          selectedCup: location.state?.selectedCup ?? null,
          latteResult: result,
        },
      });
    }
  };

  const handleCancelClick = () => {
    setStrokes([]);
    if (onCancel) {
      onCancel();
    } else {
      navigate('/game', {
        state: {
          selectedCup: location.state?.selectedCup ?? null,
        },
      });
    }
  };

  const screenContent = (
    <main
      className={isStandaloneScreen ? 'latte-design-screen' : 'latte-design-screen is-embedded'}
      aria-label="Latte Art Design Screen"
    >
      <button
        type="button"
        className="latte-pause-btn"
        onClick={() => setIsPaused(true)}
        aria-label="Pause Game"
        title="Pause"
      >
        <img src={pauseSvg} alt="" draggable="false" />
      </button>

      {/* Left: Top-View Cup + Dashed Outline + Interactive Tracing Canvas */}
      <div className="latte-cup-stage">
        <img
          className="latte-cup-base-img"
          src={latteTopViewSvg}
          alt="Latte Cup Top View"
          draggable="false"
        />

        <div className="latte-outline-container">
          <img
            className="latte-outline-img"
            src={currentDesign.outlineSrc}
            alt={`${currentDesign.name} Outline`}
            draggable="false"
          />

          <svg
            ref={traceSvgRef}
            className="latte-trace-svg"
            viewBox="0 0 344 344"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Hidden measurement group for sampling target outline points */}
            <g ref={measureGroupRef} opacity="0" pointerEvents="none">
              {currentDesign.svgElements.map((el, idx) => {
                if (el.type === 'path') {
                  return <path key={idx} d={el.d} />;
                }
                if (el.type === 'ellipse') {
                  return (
                    <ellipse
                      key={idx}
                      cx={el.cx}
                      cy={el.cy}
                      rx={el.rx}
                      ry={el.ry}
                      transform={el.transform}
                    />
                  );
                }
                if (el.type === 'circle') {
                  return <circle key={idx} cx={el.cx} cy={el.cy} r={el.r} />;
                }
                return null;
              })}
            </g>

            {/* Player's traced latte foam strokes */}
            {strokes.map((stroke, idx) =>
              stroke.length === 1 ? (
                <circle
                  key={idx}
                  cx={stroke[0].x}
                  cy={stroke[0].y}
                  r="8"
                  fill="#FFFFFF"
                />
              ) : (
                <polyline
                  key={idx}
                  points={buildPolylinePoints(stroke)}
                  stroke="#FFFFFF"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )
            )}
          </svg>
        </div>
      </div>

      {/* Right: Expected Output Card, Match Bar, Done & Cancel Buttons */}
      <div className="latte-info-card">
        <button
          type="button"
          className="latte-preview-btn"
          onClick={handleCycleDesign}
          title={lockedDesign ? 'This is the design the customer asked for' : 'Click to switch latte art design'}
          style={lockedDesign ? { cursor: 'default' } : undefined}
          aria-label={`Expected Design: ${currentDesign.name}. Click to switch design`}
        >
          <img
            className="latte-preview-img"
            src={currentDesign.designSrc}
            alt={currentDesign.name}
            draggable="false"
          />
        </button>

        <h2 className="latte-design-title">{currentDesign.name}</h2>

        <div className="latte-match-section">
          <div className="latte-match-labels">
            <span>Match</span>
            <span>{matchPercent}%</span>
          </div>
          <div className="latte-match-track">
            <div
              className="latte-match-fill"
              style={{ width: `${matchPercent}%` }}
            />
          </div>
        </div>

        <div className="latte-card-actions">
          <button
            type="button"
            className="latte-action-btn is-done"
            onClick={handleDoneClick}
          >
            Done
          </button>
          <button
            type="button"
            className="latte-action-btn is-cancel"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      </div>

    {!onPause && (
      <GamePaused
        isOpen={isPaused}
        onContinue={() => setIsPaused(false)}
        onRestart={() => {
          setStrokes([]);
          if (onCancel) {
            onCancel();
          } else {
            navigate('/game');
          }
        }}
      />
    )}
    </main>
  );
  return (
    <>
      <style>{latteDesignStyles}</style>
      {isStandaloneScreen ? (
        <div className="latte-screen-container">{screenContent}</div>
      ) : (
        screenContent
      )}
    </>
  );
}


export default LatteDesign;

