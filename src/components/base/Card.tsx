import { Box, BoxProps, useColorMode, forwardRef } from '@chakra-ui/react';
import React from 'react';

const Card = forwardRef<BoxProps, 'div'>(({ children, ...props }, ref) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      ref={ref}
      rounded="lg"
      p="2"
      bg={colorMode === 'dark' ? '#18131b' : 'white'}
      {...props}
    >
      {children}
    </Box>
  );
});

const BorderedCard = forwardRef<BoxProps, 'div'>(
  ({ children, ...props }, ref) => {
    const { colorMode } = useColorMode();
    return (
      <Box
        ref={ref}
        rounded="lg"
        p="2"
        bg={colorMode === 'dark' ? '#18131b' : 'white'}
        border="1px"
        {...props}
      >
        {children}
      </Box>
    );
  },
);

export default Card;
export { BorderedCard };
