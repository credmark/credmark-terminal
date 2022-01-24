import { useState, useEffect } from 'react';

export const useOnScreen = (ref: { current: HTMLElement | null }) => {
  const [isOnScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      {
        threshold: [0.25, 0.5, 0.75],
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isOnScreen;
};
