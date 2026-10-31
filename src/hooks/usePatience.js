import { useState, useEffect } from 'react';

// How many seconds each customer type waits before leaving.
// The API does not set these numbers, they are our own choice. Change freely.
const PATIENCE_SECONDS = {
  student: 40,
  elderly: 50,
  karen: 30,
};

export function usePatience(customerType, isRunning) {
  const [patience, setPatience] = useState(100); // 100 = just arrived, 0 = leaves
  const secondsToWait = PATIENCE_SECONDS[customerType] ?? 40;

  useEffect(() => {
    // Not running (paused or busy): no timer at all.
    if (!isRunning) return undefined;

    let lastTick = Date.now();
    const timerId = setInterval(() => {
      const now = Date.now();
      const secondsPassed = (now - lastTick) / 1000;
      lastTick = now;

      setPatience((current) => {
        const drained = current - (secondsPassed * 100) / secondsToWait;
        return Math.max(0, drained);
      });
    }, 200);

    // Cleanup: runs when isRunning changes or the component goes away.
    return () => clearInterval(timerId);
  }, [isRunning, secondsToWait]);

  function resetPatience() {
    setPatience(100);
  }

  const secondsLeft = Math.ceil((patience * secondsToWait) / 100);

  return { patience, secondsLeft, resetPatience };
}