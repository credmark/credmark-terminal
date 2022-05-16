import {
  Button,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import { PrimaryButton } from '~/components/base';

export const Card = chakra('div', {
  baseStyle: {
    shadow: 'md',
    rounded: 'base',
    bg: 'white',
    height: '100%',
  },
});

const Membership = () => {
  return (
    <Flex w="full" minH="100%">
      <Grid
        padding="8"
        templateRows={{ sm: 'repeat(8, 1fr)', lg: 'repeat(7, 1fr)' }}
        templateColumns={{ sm: 'repeat(8, 1fr)', lg: 'repeat(9, 1fr)' }}
        width="full"
        flex="1"
        gap="4"
        bg="gray.50"
      >
        <GridItem colSpan={{ sm: 8, lg: 5 }} rowSpan={{ sm: 1, lg: 2 }}>
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
                  <Heading fontSize={{ base: 'sm', md: 'md' }}>
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
                    colorScheme="green"
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
              <VStack spacing={0} justify="center">
                <Text fontSize="sm" color="gray.500">
                  Current Balance
                </Text>

                <HStack>
                  <Text
                    fontSize={{ base: '3xl', sm: '2xl' }}
                    fontWeight="600"
                    color="gray.800"
                  >
                    40,783
                  </Text>
                  <Text fontSize="md" color="gray.500">
                    CMK
                  </Text>
                </HStack>

                <Text fontSize="sm" color="gray.500">
                  Current Balance
                </Text>
              </VStack>
            </Flex>
          </Card>
        </GridItem>
        <GridItem colSpan={{ sm: 4, lg: 2 }} rowSpan={{ sm: 1, lg: 2 }}>
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
        </GridItem>
        <GridItem colSpan={{ sm: 4, lg: 2 }} rowSpan={{ sm: 1, lg: 2 }}>
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
                Days of Access Remaining
              </Text>
              <HStack>
                <Text
                  fontSize={{ base: '3xl', sm: '2xl' }}
                  fontWeight="600"
                  color="gray.800"
                >
                  636
                </Text>
                <Text fontSize="md" color="gray.500">
                  Days
                </Text>
              </HStack>
              <Text fontSize="md" color="gray.500">
                ~20.8 months
              </Text>
            </VStack>
          </Card>
        </GridItem>

        <GridItem colSpan={{ sm: 8, lg: 3 }} rowSpan={{ sm: 2, lg: 5 }}>
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
                  Pro <Icon>{/* <BsInfoCircle /> */}</Icon>
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
        </GridItem>
        <GridItem
          w="100%"
          colSpan={{ sm: 8, lg: 6 }}
          rowSpan={{ sm: 2, lg: 5 }}
          as={Card}
        >
          {/* Chart here */}
        </GridItem>
        <GridItem
          colStart={{ sm: 7, lg: 8 }}
          colEnd={{ sm: 9, lg: 10 }}
          display="flex"
          justifyContent="center"
        >
          <PrimaryButton w="full">Mint New Key</PrimaryButton>
        </GridItem>
      </Grid>
    </Flex>
  );
};
export default Membership;
