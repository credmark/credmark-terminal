import { VStack } from '@chakra-ui/layout';
import React from 'react';

import Rewards from '~/components/ApiPortal/rewards';

export default function CodeTerminalPage() {
  return (
    <VStack
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
      spacing="8"
    >
      <Rewards />
    </VStack>
  );
}
