import { useState, useEffect, useRef } from 'react';
import pourButtonSvg from '../assets/pour button.svg';
import './TimingBar.css';

const TARGET_WIDTH = 20; // % wide
const SPEED = 90; // % of the bar per second

export default function TimingBar({ onPour, onCancel }) {
  // Random green zone, picked once per mount
  const [targetStart] = useState(
    () => 10 + Math.floor(Math.random() * (80 - TARGET_WIDTH))
  );
  const [cursorPos, setCursorPos] = useState(0); // 0 to 100
  const [result, setResult] = useState(null); // null | 'hit' | 'miss'
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const stoppedRef = useRef(false);

  // Move the cursor back and forth until the player pours
  useEffect(() => {
    let frame;
    let last = performance.now();

    const tick = (now) => {
      if (stoppedRef.current) return;
      const dt = (now - last) / 1000;
      last = now;

      let next = posRef.current + dirRef.current * SPEED * dt;
      if (next >= 100) {
        next = 100;
        dirRef.current = -1;
      } else if (next <= 0) {
        next = 0;
        dirRef.current = 1;
      }
      posRef.current = next;
      setCursorPos(next);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handlePour = () => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;

    const pos = posRef.current;
    const hit = pos >= targetStart && pos <= targetStart + TARGET_WIDTH;
    setResult(hit ? 'hit' : 'miss');
    if (onPour) onPour(hit);

    // Let the player see where the line stopped, then close
    setTimeout(() => {
      if (onCancel) onCancel();
    }, 900);
  };

  return (
    <div className="timing-panel" aria-label="Timing bar">
      <div className={`bar-container ${result ? `result-${result}` : ''}`}>
        {/* The green target zone */}
        <div
          className="target-zone"
          style={{ left: `${targetStart}%`, width: `${TARGET_WIDTH}%` }}
        ></div>

        {/* The moving red line */}
        <div className="red-line" style={{ left: `${cursorPos}%` }}></div>
      </div>

      <button
        type="button"
        className="pour-btn"
        onClick={handlePour}
        disabled={result !== null}
        aria-label="Pour"
        title="Pour"
      >
        <img src={pourButtonSvg} alt="" draggable="false" />
      </button>
    </div>
  );
}
