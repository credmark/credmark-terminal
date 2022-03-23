import { VStack, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import { Card } from './Card';

// interface RemainingDaysCardProps {}

const RemainingDaysCard = () => {
  return (
    <Card>
      <VStack
        py="4"
        h="100%"
        align="center"
        spacing={0}
        minW="250px"
        justify="center"
      >
        <Text fontSize="sm" color="gray.500">
          Days of Access Remaining
        </Text>
        <HStack>
          <Text
            fontSize={{ base: '5xl', sm: '3xl' }}
            fontWeight="600"
            color="gray.800"
          >
            636
          </Text>
          <Text fontSize="md" color="gray.500">
            Days
          </Text>
        </HStack>
        <Text fontSize="lg" color="gray.500">
          ~20.8 months
        </Text>
      </VStack>
    </Card>
  );
};
export default RemainingDaysCard;
