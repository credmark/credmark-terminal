import { SwitchProps } from '@chakra-ui/react';
import React from 'react';

import { PrimarySwitch } from '~/components/base/Switch';

export const Switch = ({
  height = '20px',
  width = '40px',
  colorScheme = '#00D696',
  borderRadius,
  ...rest
}: SwitchProps) => {
  return (
    <PrimarySwitch
      colorScheme={colorScheme}
      height={height}
      width={width}
      borderRadius={borderRadius}
      {...rest}
    />
  );
};
