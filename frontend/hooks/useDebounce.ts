import { useEffect, useState } from 'react';
import { UI_CONSTANTS } from '@/lib/constants';

export function useDebounce<T>(value: T, delay: number = UI_CONSTANTS.DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
