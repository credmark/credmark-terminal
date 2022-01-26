import { VStack, Container, Box, Link } from '@chakra-ui/react';
import React from 'react';

import CmkAnalytics from '~/components/CmkAnalytics';
import Navbar from '~/components/Navbar';

export default function AnalyticsPage() {
  return (
    <VStack
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
      spacing="8"
    >
      <Navbar />
      <Container maxW="container.md" py="8" textAlign="center" fontSize="lg">
        <Box bg="blackAlpha.50" rounded="lg" p="4">
          Credmark&apos;s <strong>analytics</strong> is THE source for{' '}
          <strong>CMK</strong> stats.
        </Box>
      </Container>
      <Container
        maxW="100vw"
        px={{ base: 2, md: 8 }}
        pt={{ base: 2, md: 8 }}
        bg="white"
        roundedTop="3xl"
        position="relative"
        border="1px"
        borderColor="gray.100"
        pb="40"
      >
        <Container maxW="container.md">
          <CmkAnalytics />
        </Container>
      </Container>
    </VStack>
  );
}
