import { VStack, Heading, Box, Text } from '@chakra-ui/react';
import React from 'react';

import { CModelRunError } from '~/types/model';

interface ModelRunErrorProps {
  error: CModelRunError;
}

export default function ModelRunError({ error }: ModelRunErrorProps) {
  return (
    <VStack
      bg="red.50"
      borderWidth="1px"
      borderColor="red.500"
      rounded="base"
      spacing="4"
      p="8"
      color="red.500"
      align="stretch"
    >
      <Heading size="md" textAlign="center" mb="4">
        Error while running model
      </Heading>

      <Text fontWeight="bold">
        <i>message: </i>
        {error.message || 'Some unexpected error has occured'}
      </Text>
      <Text>
        <i>code: </i>
        {error.code || '-'}
      </Text>
      <Text>
        <i>details: </i>
        {JSON.stringify(error.details ?? {})}
      </Text>

      <Box>
        <i>trace:</i>
        {error.stack.map((s, i) => (
          <Box key={i} mt="2">
            <Text>
              <i>
                [{i}] chainId: {s.chainId}, block: {s.blockNumber}, slug:{' '}
                {s.slug}, version: {s.version}
              </i>
            </Text>
            <Text as="pre" whiteSpace="pre-wrap">
              {s.trace}
            </Text>
          </Box>
        ))}
      </Box>
    </VStack>
  );
}
