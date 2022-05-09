import { Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

const CmkArrowRight = (props: IconProps) => {
  return (
    <Icon viewBox="0 0 10 14" {...props}>
      <path
        d="M0 5.25H9.1275L4.935 1.0575L6 0L12 6L6 12L4.9425 10.9425L9.1275 6.75H0V5.25Z"
        fill="#3B0065"
      />
    </Icon>
  );
};

export default CmkArrowRight;
