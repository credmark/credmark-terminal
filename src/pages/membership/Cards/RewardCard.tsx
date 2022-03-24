import { HStack, Text, VStack } from '@chakra-ui/react';
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
        // minW="250px"
        justify="center"
      >
        <Text fontSize="sm" color="gray.500">
          Total Rewards Recieved
        </Text>
        <HStack>
          <Text
            fontSize={{ base: '3xl', sm: '2xl' }}
            fontWeight="600"
            color="gray.800"
          >
            2,469
          </Text>
          <Text fontSize="md" color="gray.500">
            CMK
          </Text>
        </HStack>

        <Text fontSize="md" color="gray.500">
          $592.56
        </Text>
      </VStack>
    </Card>
  );
};
export default RewardCard;
