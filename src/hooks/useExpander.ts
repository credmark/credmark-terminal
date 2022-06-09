import { useState, useRef, useCallback } from 'react';

import { useDeepCompareCallback } from './useDeepCompare';

export default function useExpander<T extends string | number = string>() {
  const [expandedItems, setExpandedItems] = useState<T[]>([]);
  const refs = useRef<Record<T, HTMLDivElement | null>>(
    {} as Record<T, HTMLDivElement | null>,
  );

  const refByKey = useCallback(
    (key: T) => (ref: HTMLDivElement | null) => (refs.current[key] = ref),
    [],
  );

  const isExpanded = useDeepCompareCallback(
    (key: T) => expandedItems.includes(key),
    [expandedItems],
  );

  const onExpand = useDeepCompareCallback(
    (key: T) => {
      if (expandedItems.includes(key)) {
        setExpandedItems(expandedItems.filter((ep) => ep !== key));
        return;
      }

      setExpandedItems([...expandedItems, key]);

      const elem = refs.current[key];
      if (elem) {
        requestAnimationFrame(() => {
          const headerOffset = 10;
          const elementPosition = elem.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        });
      }
    },
    [expandedItems],
  );

  return {
    refByKey,
    isExpanded,
    onExpand,
  };
}
