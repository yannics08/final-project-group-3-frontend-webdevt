import { useState, useEffect } from 'react';

// The game clock. It counts played time and paused time separately.
export function useGameClock(totalSeconds, isPaused) {
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [pausedSeconds, setPausedSeconds] = useState(0);

  const isOver = playedSeconds >= totalSeconds;

  useEffect(() => {
    // Once the game is over, the clock stops for good.
    if (isOver) return undefined;

    let lastTick = Date.now();
    const timerId = setInterval(() => {
      const now = Date.now();
      const secondsPassed = (now - lastTick) / 1000;
      lastTick = now;

      // Time goes into one bucket or the other, depending on the pause.
      if (isPaused) {
        setPausedSeconds((current) => current + secondsPassed);
      } else {
        setPlayedSeconds((current) => current + secondsPassed);
      }
    }, 200);

    return () => clearInterval(timerId);
  }, [isPaused, isOver]);

  const secondsLeft = Math.max(0, Math.ceil(totalSeconds - playedSeconds));

  return { playedSeconds, pausedSeconds, secondsLeft, isOver };
}