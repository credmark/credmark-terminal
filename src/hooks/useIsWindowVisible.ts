import { useCallback, useEffect, useState } from 'react';

function visibilityStateSupported() {
  const isServer = typeof window === 'undefined';
  return !isServer && 'visibilityState' in document;
}

function isWindowVisible() {
  const isServer = typeof window === 'undefined';

  return (
    !isServer &&
    (!visibilityStateSupported() || document.visibilityState !== 'hidden')
  );
}

/**
 * Returns whether the window is currently visible to the user.
 */
export default function useIsWindowVisible(): boolean {
  const [focused, setFocused] = useState<boolean>(isWindowVisible());
  const listener = useCallback(() => {
    setFocused(isWindowVisible());
  }, [setFocused]);

  useEffect(() => {
    if (!visibilityStateSupported()) return undefined;

    document.addEventListener('visibilitychange', listener);
    return () => {
      document.removeEventListener('visibilitychange', listener);
    };
  }, [listener]);

  return focused;
}
