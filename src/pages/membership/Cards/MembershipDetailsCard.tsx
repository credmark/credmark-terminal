import { VStack, Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { BsInfoCircle } from 'react-icons/bs';

import { Card } from './Card';

// interface MembershipDetailsCardProps {}

const MembershipDetailsCard = () => {
  return (
    <Card fontSize="sm">
      <VStack p="4">
        <Text color="gray.400">Membership NFT Details</Text>
        <Flex pt="4" w="100%" justify="space-between">
          <Text color="gray.400">Date Created</Text>
          <Text fontWeight="bold">Jan 02 2022</Text>
        </Flex>
        <Flex pt="2" w="100%" justify="space-between">
          <Text color="gray.400">Tier</Text>
          <Text fontWeight="bold">
            Pro{' '}
            <Icon>
              <BsInfoCircle />
            </Icon>
          </Text>
        </Flex>
        <Flex pt="2" w="100%" justify="space-between">
          <Text lineHeight="1.2" color="gray.400">
            Lookup Days <br /> Remaining
          </Text>
          <Text fontWeight="bold">20 Days</Text>
        </Flex>
        <Flex pt="2" w="100%" justify="space-between">
          <Text lineHeight="1.2" color="gray.400">
            Total <br /> Consumption
          </Text>
          <Text fontWeight="bold">6,378 CMK</Text>
        </Flex>
        <Flex pt="2" w="100%" justify="space-between">
          <Text color="gray.400">Net APY</Text>
          <Text fontWeight="bold">-33.52%</Text>
        </Flex>
      </VStack>
    </Card>
  );
};
export default MembershipDetailsCard;
