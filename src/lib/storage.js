import { useEffect, useState } from 'react';

const PREFIX = 'ro-b1:';
export const HISTORY_LIMIT = 30;

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private mode): the app keeps working in memory.
  }
}

/** useState that mirrors its value to localStorage. */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => load(key, initial));
  useEffect(() => save(key, value), [key, value]);
  return [value, setValue];
}
