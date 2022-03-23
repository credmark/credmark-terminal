import { VStack, Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { BsInfoCircle } from 'react-icons/bs';

import { Card } from './Card';

// interface MembershipDetailsCardProps {}

const MembershipDetailsCard = () => {
  return (
    <Card>
      <VStack p="4">
        <Text fontSize="sm" color="gray.400">
          Membership NFT Details
        </Text>
        <Flex pt="4" w="100%" justify="space-between">
          <Text>Date Created</Text>
          <Text fontWeight="bold">Jan 02 2022</Text>
        </Flex>
        <Flex pt="2" w="100%" justify="space-between">
          <Text>Tier</Text>
          <Text fontWeight="bold">
            Pro{' '}
            <Icon>
              <BsInfoCircle />
            </Icon>
          </Text>
        </Flex>
        <Flex pt="2" w="100%" justify="space-between">
          <Text lineHeight="1.2">
            Lookup Days <br /> Remaining
          </Text>
          <Text fontWeight="bold">20 Days</Text>
        </Flex>
        <Flex pt="2" w="100%" justify="space-between">
          <Text lineHeight="1.2">
            Total <br /> Consumption
          </Text>
          <Text fontWeight="bold">6,378</Text>
        </Flex>
        <Flex pt="2" w="100%" justify="space-between">
          <Text>Net APY</Text>
          <Text fontWeight="bold">-33.52%</Text>
        </Flex>
      </VStack>
    </Card>
  );
};
export default MembershipDetailsCard;
