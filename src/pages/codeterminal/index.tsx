import { Container, VStack } from '@chakra-ui/layout';
import React from 'react';

import CodeTerminal from '~/components/CodeTerminal';

export default function CodeTerminalPage() {
  const speed = 100;

  return (
    <VStack
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
      spacing="8"
    >
      <Container maxW="container.md" py="8" textAlign="center" fontSize="lg">
        <CodeTerminal speed={speed} />
      </Container>
    </VStack>
  );
}
