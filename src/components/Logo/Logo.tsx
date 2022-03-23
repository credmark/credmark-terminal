import { HStack, Heading, Img } from '@chakra-ui/react';
import React from 'react';

// interface LogoProps {}

const Logo = () => {
  return (
    <HStack>
      <Img src="/img/apiPortal/logo.svg" />
      <Heading as="h3" fontSize="xl" fontWeight="400">
        Credmark
      </Heading>
    </HStack>
  );
};
export default Logo;
