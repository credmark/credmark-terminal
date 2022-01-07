import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

interface StatContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function StatContainer({ title, children }: StatContainerProps) {
  return (
    <Box
      position="relative"
      bg="gray.50"
      py="8"
      zIndex="1"
      rounded="md"
      mt="12"
    >
      <HStack
        mx="auto"
        mt="-12"
        mb="8"
        pt="1"
        pb="1"
        bg="white"
        shadow="lg"
        rounded="lg"
        w="400px"
        justify="center"
      >
        <Text
          fontFamily="Credmark Regular"
          pt="1"
          textAlign="center"
          lineHeight="1.2"
          fontSize="xl"
          color="purple.500"
        >
          {title}
        </Text>
      </HStack>
      {children}
    </Box>
  );
}
