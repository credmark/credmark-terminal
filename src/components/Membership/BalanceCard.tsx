import { Flex, Stack, Heading, Button, VStack, Text } from '@chakra-ui/react';
import React from 'react';

import { Card } from './Card';

// interface BalanceCardProps {}

const BalanceCard = () => {
  return (
    <Card p={4}>
      <Flex
        h="100%"
        justify="space-between"
        gap={4}
        flexDirection={{ base: 'column-reverse', sm: 'row' }}
      >
        <Stack
          flex="1"
          justify={{
            base: 'flex-end',
            sm: 'space-between',
          }}
        >
          <Stack spacing={0}>
            <Heading fontSize={{ base: 'md', md: 'lg' }}>
              Pro Membership NFT:0x7777....7777
            </Heading>
            <Text color="gray.300" fontSize="sm">
              Minted on 02 Feb 2022
            </Text>
          </Stack>
          <Flex flexDir={{ base: 'column', md: 'row' }} gap="2">
            <Button
              fontSize="sm"
              fontWeight="400"
              w="full"
              colorScheme="pink"
              maxW={{ base: '', sm: '250px' }}
            >
              Add Funds
            </Button>
            <Button
              fontWeight="400"
              variant="outline"
              colorScheme="gray"
              w="full"
              fontSize="sm"
              maxW={{ base: '', sm: '250px' }}
            >
              Burn Membership NFT
            </Button>
          </Flex>
        </Stack>
        <VStack spacing={0} minW="250px" justify="center">
          <Text fontSize="sm" color="gray.500">
            Current Balance
          </Text>
          <Text
            fontSize={{ base: '5xl', sm: '3xl' }}
            fontWeight="600"
            color="gray.800"
          >
            40,783
          </Text>
          <Text fontSize="sm" color="gray.500">
            Current Balance
          </Text>
        </VStack>
      </Flex>
    </Card>
  );
};
export default BalanceCard;
