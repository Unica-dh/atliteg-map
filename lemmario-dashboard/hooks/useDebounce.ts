import { useEffect, useState } from 'react';

/**
 * Hook per il debouncing di un valore
 * Utile per ottimizzare le ricerche in tempo reale
 * @param value Il valore da debounciare
 * @param delay Il ritardo in millisecondi (default: 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
