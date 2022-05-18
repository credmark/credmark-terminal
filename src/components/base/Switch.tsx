import { Switch, chakra } from '@chakra-ui/react';

export const PrimarySwitch = chakra(Switch, {
  baseStyle: {
    colorScheme: 'green',
    color: 'purple.500',
    width: '40px',
    height: '20px',
  },
});
