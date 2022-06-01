import { RefObject, useCallback, useState } from 'react';

export default function useFullscreen<T extends HTMLElement>(
  node: RefObject<T | undefined>,
) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      node?.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document?.exitFullscreen();
      setIsFullScreen(false);
    }
  }, [isFullScreen, node]);

  return {
    isFullScreen,
    toggleFullScreen,
  };
}
