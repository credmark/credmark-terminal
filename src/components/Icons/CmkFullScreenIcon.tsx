import { Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

const CmkFullScreenIcon = (props: IconProps) => {
  return (
    <Icon viewBox="0 0 10 14" {...props}>
      <path
        d="M2.25 7.5H0.75V11.25H4.5V9.75H2.25V7.5ZM0.75 4.5H2.25V2.25H4.5V0.75H0.75V4.5ZM9.75 9.75H7.5V11.25H11.25V7.5H9.75V9.75ZM7.5 0.75V2.25H9.75V4.5H11.25V0.75H7.5Z"
        fill="#999999"
      />
    </Icon>
  );
};

export default CmkFullScreenIcon;
