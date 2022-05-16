import { chakra, Box } from '@chakra-ui/react';

export default chakra(Box, {
  baseStyle: {
    bg: 'white',
    rounded: 'base',
    shadow: 'xl',
    px: 6,
    py: 8,
  },
});

export const BorderedCard = chakra(Box, {
  baseStyle: {
    rounded: 'base',
    border: '1px',
    borderColor: '#DEDEDE',
    bg: 'white',
    shadow: 'md',
  },
});
