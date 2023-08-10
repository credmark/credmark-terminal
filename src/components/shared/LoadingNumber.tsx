import { useInterval, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

interface LoadingNumberProps {
  fractionDigits?: number;
}

export default function LoadingNumber({
  fractionDigits = 0,
}: LoadingNumberProps) {
  const multiplier = Math.pow(10, fractionDigits);

  function generateRandomNumber() {
    return (
      (Math.floor(Math.random() * 90 * multiplier) + 10 * multiplier) /
      multiplier
    ).toFixed(fractionDigits);
  }

  const [number, setNumber] = useState<number | string>(generateRandomNumber());

  useInterval(() => {
    setNumber(generateRandomNumber());
  }, 17);

  return (
    <Text
      as="span"
      sx={{
        fontFeatureSettings: 'tnum',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {number}
    </Text>
  );
}
