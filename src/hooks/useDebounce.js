import { useState, useEffect } from 'react';

// Returns a copy of `value` that only updates after it has
// stopped changing for `delayMs` milliseconds.
export function useDebounce(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer. When it finishes, save the latest value.
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Cleanup: if `value` changes again before the timer ends,
    // React runs this first, which cancels the old timer.
    return () => clearTimeout(timerId);
  }, [value, delayMs]);

  return debouncedValue;
}