import { ButtonProps } from '@chakra-ui/react';
import React from 'react';

import { PrimaryButton } from '~/components/base';

export interface PrimaryButtonProps extends ButtonProps {
  borderRadius?: string;
  fontWeight?: '700' | '400';
  content?: string;
  backgroundColor?: 'green.500' | 'grey.500' | 'grey.100' | string;
  height?: string;
}
export const Button = ({
  borderRadius = '4px',
  backgroundColor,
  content,
  height = '32px',
  fontWeight,
  ...rest
}: PrimaryButtonProps) => {
  return (
    <PrimaryButton
      bg={backgroundColor}
      borderRadius={borderRadius}
      fontWeight={fontWeight}
      cursor="pointer"
      height={height}
      {...rest}
    >
      {content}
    </PrimaryButton>
  );
};
