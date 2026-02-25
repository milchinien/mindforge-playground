import { useState, useCallback } from 'react';

const STORAGE_KEY = 'mindforge_onboarding';

const DEFAULT_HINTS = [
  'sidebar',
  'avatar',
  'quests',
  'browse',
  'create',
  'shop',
  'achievements',
  'friends',
];

function getSeenHints() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Corrupted data – reset
    localStorage.removeItem(STORAGE_KEY);
  }
  return [];
}

function persistSeenHints(seen) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
  } catch {
    // localStorage full or unavailable – silently ignore
  }
}

export function useOnboarding() {
  const [seenHints, setSeenHints] = useState(() => getSeenHints());

  const hasSeenHint = useCallback(
    (hintId) => seenHints.includes(hintId),
    [seenHints],
  );

  const markSeen = useCallback((hintId) => {
    setSeenHints((prev) => {
      if (prev.includes(hintId)) return prev;
      const next = [...prev, hintId];
      persistSeenHints(next);
      return next;
    });
  }, []);

  const resetAllHints = useCallback(() => {
    setSeenHints([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    seenHints,
    hasSeenHint,
    markSeen,
    resetAllHints,
    allHintIds: DEFAULT_HINTS,
  };
}

export default useOnboarding;
