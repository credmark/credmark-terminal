import { Box, Skeleton } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

import useIntersectionObserver from '~/hooks/useIntersectionObserver';

interface LazyLoadProps {
  placeholder?: React.ReactNode;
  children: React.ReactNode;
}

export default function LazyLoad({
  placeholder = <Skeleton height="20px" />,
  children,
}: LazyLoadProps) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const [isEntryIntersecting] = useIntersectionObserver(ref, {
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (isEntryIntersecting && !show) {
      setShow(true);
    }
  }, [isEntryIntersecting, show]);

  if (show) {
    return <>{children}</>;
  }

  return <Box ref={ref}>{placeholder}</Box>;
}
