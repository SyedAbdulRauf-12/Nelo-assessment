import { useState, useEffect } from 'react';

// This hook receives a value and a delay (default 500ms)
// It only updates its return value after the user stops typing for that duration
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: If the user types again before the timer finishes, 
    // we clear the old timer so it doesn't fire.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;