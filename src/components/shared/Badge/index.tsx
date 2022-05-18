import React from 'react';

import { PrimaryBadge } from '~/components/base';

export interface BadgeProps {
  backgroundColor?: 'green.500' | 'grey.500' | 'grey.100' | string;
  content: string;
  color?: 'white' | 'black' | string;
  fontWeight?: '700' | '400';
  onClick?: () => void;
}
export const Badge = ({
  backgroundColor = 'primary.green',
  content,
  color = 'white',
  fontWeight = '700',
  onClick = () => false,
  ...rest
}: BadgeProps) => {
  return (
    <PrimaryBadge
      bg={backgroundColor}
      pt="6px"
      pb="6px"
      pl="15px"
      pr="15px"
      borderRadius="15px"
      color={color}
      fontWeight={fontWeight}
      onClick={onClick}
      cursor="pointer"
      {...rest}
    >
      {content}
    </PrimaryBadge>
  );
};
