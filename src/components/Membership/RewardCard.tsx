import { Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { Card } from './Card';

// interface RewardCardProps {}

const RewardCard = () => {
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
          Total Rewards Recieved
        </Text>
        <Text
          fontSize={{ base: '5xl', sm: '3xl' }}
          fontWeight="600"
          color="gray.800"
        >
          2,469
        </Text>
        <Text fontSize="lg" color="gray.500">
          $592.56
        </Text>
      </VStack>
    </Card>
  );
};
export default RewardCard;
