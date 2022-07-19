import { Button, chakra } from '@chakra-ui/react';

export const PrimaryButton = chakra(Button, {
  baseStyle: {
    colorScheme: 'green',
    color: 'purple.800',
    bg: 'green.500',
  },
});
