import { Box, Skeleton } from '@chakra-ui/react';
import React, { useRef } from 'react';

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
  const [show] = useIntersectionObserver(ref, { freezeOnceVisible: true });
  if (show) {
    return <>{children}</>;
  }

  return <Box ref={ref}>{placeholder}</Box>;
}
