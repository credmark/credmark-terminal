import { useInterval } from '@chakra-ui/react';
import React, { useState } from 'react';

export default function LoadingNumber() {
  const [number, setNumber] = useState<number>(
    Math.floor(Math.random() * 90) + 10,
  );

  useInterval(() => {
    setNumber(Math.floor(Math.random() * 90) + 10);
  }, 17);

  return <>{number}</>;
}
