import { VStack, Container, Text } from '@chakra-ui/layout';
import React from 'react';

import AccessKeyList from '~/components/AccessKeyList';
import MintBox from '~/components/MintBox';
import Navbar from '~/components/Navbar';

export default function AccessKeysPage() {
  return (
    <VStack
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
      spacing="8"
      pb="20"
    >
      <Navbar />
      <Container maxW="xs" p="0">
        <MintBox />
      </Container>

      <Container maxW="container.md" p="8" bg="white" shadow="xl" rounded="3xl">
        <VStack align="stretch" spacing="6">
          <Text
            fontFamily="Credmark Regular"
            textAlign="center"
            bgGradient="linear(135deg, #CC1662, #3B0066)"
            bgClip="text"
            lineHeight="1.2"
            fontSize="3xl"
          >
            YOUR MINTED ACCESS KEYS
          </Text>
          <AccessKeyList />
        </VStack>
      </Container>
    </VStack>
  );
}
